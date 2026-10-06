from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# User Schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: UUID
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Profile Schemas
class ProfileBase(BaseModel):
    username: str
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class ProfileCreate(ProfileBase):
    pass

class ProfileOut(ProfileBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    class Config:
        from_attributes = True

# Video Schemas
class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_type: str # FLICK or FULL

class VideoCreate(VideoBase):
    pass

class VideoOut(VideoBase):
    id: UUID
    creator_id: UUID
    source_url: str
    thumbnail_url: Optional[str] = None
    duration: Optional[float] = None
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[UUID] = None
