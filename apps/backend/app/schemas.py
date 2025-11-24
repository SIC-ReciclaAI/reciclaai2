from datetime import datetime
from typing import Any, Dict

from pydantic import BaseModel, EmailStr


class ImageRequest(BaseModel):
    imageData: str


class UserBase(BaseModel):
    name: str | None = None
    email: EmailStr


class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


class RegisterRequest(UserBase):
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class PredictionResponse(BaseModel):
    id: str
    predictions: Dict[str, float]
    imageData: str
    createdAt: datetime


class HistoryListResponse(BaseModel):
    total: int
    items: list[PredictionResponse]


