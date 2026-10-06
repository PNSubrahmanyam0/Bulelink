from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "BlueLink"
    SECRET_KEY: str = "super-secret-key-for-jwt-tokens-change-in-prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    # Database
    DATABASE_URL: str = "postgresql://bluelink_user:bluelink_password@db:5432/bluelink_db"

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    # MinIO / S3
    S3_ENDPOINT: str = "http://minio:9000"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin"
    S3_BUCKET_NAME: str = "bluelink-media"

    class Config:
        env_file = ".env"

settings = Settings()
