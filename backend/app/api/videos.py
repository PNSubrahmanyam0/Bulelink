from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
from .core.database import get_db
from .auth import get_current_user
from ..models import User, Video
from ..schemas import VideoCreate, VideoOut
from ..services.storage import storage_service
from ..workers.transcoder import process_video_task

router = APIRouter(prefix="/videos", tags=["videos"])

@router.post("/", response_model=VideoOut, status_code=status.HTTP_201_CREATED)
async def upload_video(
    title: str,
    description: str = None,
    video_type: str = "FLICK",
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Upload to Object Storage
    content = await file.read()
    object_name = f"sources/{current_user.id}/{file.filename}"
    source_url = storage_service.upload_file(content, object_name)

    # 2. Create Video record
    new_video = Video(
        creator_id=current_user.id,
        title=title,
        description=description,
        source_url=source_url,
        video_type=video_type,
        status="PENDING"
    )
    db.add(new_video)
    db.commit()
    db.refresh(new_video)

    # 3. Trigger Async Transcoding
    process_video_task.delay(str(new_video.id))

    return new_video

@router.get("/", response_model=List[VideoOut])
def list_videos(db: Session = Depends(get_db), limit: int = 20, offset: int = 0):
    return db.query(Video).filter(Video.status == "READY").offset(offset).limit(limit).all()

@router.get("/{video_id}", response_model=VideoOut)
def get_video(video_id: str, db: Session = Depends(get_db)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video
