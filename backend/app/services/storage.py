import boto3
from botocore.client import Config
from .core.config import settings

class StorageService:
    def __init__(self):
        self.s3 = boto3.client(
            "s3",
            endpoint_url=settings.S3_ENDPOINT,
            aws_access_key_id=settings.S3_ACCESS_KEY,
            aws_secret_access_key=settings.S3_SECRET_KEY,
            config=Config(signature_version="s3v4"),
        )
        self._ensure_bucket()

    def _ensure_bucket(self):
        try:
            self.s3.head_bucket(Bucket=settings.S3_BUCKET_NAME)
        except:
            self.s3.create_bucket(Bucket=settings.S3_BUCKET_NAME)

    def upload_file(self, file_content, object_name):
        self.s3.put_object(Bucket=settings.S3_BUCKET_NAME, Key=object_name, Body=file_content)
        return f"{settings.S3_ENDPOINT}/{settings.S3_BUCKET_NAME}/{object_name}"

    def get_presigned_url(self, object_name, expires_in=3600):
        return self.s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.S3_BUCKET_NAME, "Key": object_name},
            ExpiresIn=expires_in,
        )

storage_service = StorageService()
