from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .core.database import get_db
from .auth import get_current_user
from ..models import User, Video, Like, Follow
from ..schemas import VideoOut

router = APIRouter(prefix="/feed", tags=["feed"])

@router.get("/", response_model=List[VideoOut])
def get_personalized_feed(current_user: User = Depends(get_current_user), db: Session = Depends(get_db), limit: int = 20, offset: int = 0):
    # MVP Logic:
    # 1. Get videos from people the user follows
    # 2. Fill remaining with global trending videos (most liked)
    # 3. Return a merged list

    following_ids = db.query(Follow.following_id).filter(Follow.follower_id == current_user.id).all()
    following_ids = [f[0] for f in following_ids]

    # Videos from followed creators
    feed_videos = db.query(Video).filter(
        Video.creator_id.in_(following_ids),
        Video.status == "READY"
    ).order_by(Video.created_at.desc()).limit(limit).all()

    # If not enough, add global trending
    if len(feed_videos) < limit:
        trending_videos = db.query(Video).filter(
            Video.status == "READY"
        ).order_by(Video.created_at.desc()).limit(limit - len(feed_videos)).all()
        feed_videos.extend(trending_videos)

    return feed_videos

@router.get("/trending", response_model=List[VideoOut])
def get_trending_videos(db: Session = Depends(get_db), limit: int = 20):
    # Simple trending: most liked recently
    # This is a simplified version for MVP
    return db.query(Video).filter(Video.status == "READY").order_by(Video.created_at.desc()).limit(limit).all()
