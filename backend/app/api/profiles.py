from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .core.database import get_db
from .auth import get_current_user
from ..models import User, Profile
from ..schemas import ProfileCreate, ProfileOut

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.post("/", response_model=ProfileOut, status_code=status.HTTP_201_CREATED)
def create_profile(profile_in: ProfileCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing_profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists for this user")

    profile = Profile(**profile_in.dict(), user_id=current_user.id)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/{username}", response_model=ProfileOut)
def get_profile(username: str, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.username == username).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/me", response_model=ProfileOut)
def update_profile(profile_in: ProfileCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Please create one first.")

    for key, value in profile_in.dict().items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return profile
