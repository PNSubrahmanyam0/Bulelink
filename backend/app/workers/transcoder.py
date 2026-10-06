import os
import subprocess
from celery import Celery
from .core.config import settings
from .core.database import SessionLocal
from .models import Video, VideoVersion

celery_app = Celery(
    "worker",
    broker=settings.REDIS_URL, # Using Redis as broker for simplicity
    backend=settings.REDIS_URL
)

def transcode_video(video_id, source_url, resolution, bitrate):
    # In a real app, this would download from S3, transcode with ffmpeg, then upload back
    # For MVP, we'll simulate the process and create a mock URL
    print(f"Transcoding video {video_id} to {resolution}...")
    # Simulated ffmpeg command:
    # ffmpeg -i input.mp4 -s 1280x720 -b:v 2500k output_720p.mp4
    return f"https://cdn.bluelink.app/media/{video_id}/{resolution}.mp4"

@celery_app.task(name="transcode_video_task")
def process_video_task(video_id):
    db = SessionLocal()
    try:
        video = db.query(Video).filter(Video.id == video_id).first()
        if not video:
            return "Video not found"

        video.status = "PROCESSING"
        db.commit()

        resolutions = {
            "1080p": 5000000,
            "720p": 2500000,
            "480p": 1000000,
        }

        for res, br in resolutions.items():
            url = transcode_video(video_id, video.source_url, res, br)
            version = VideoVersion(video_id=video.id, resolution=res, url=url, bitrate=br)
            db.add(version)

        video.status = "READY"
        db.commit()
        return "Success"
    except Exception as e:
        video = db.query(Video).filter(Video.id == video_id).first()
        if video:
            video.status = "FAILED"
            db.commit()
        return str(e)
    finally:
        db.close()
