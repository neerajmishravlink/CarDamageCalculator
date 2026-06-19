from pydantic import BaseModel
from typing import List, Optional

class AuthRequest(BaseModel):
    email: str

class MagicLinkResponse(BaseModel):
    message: str
    magic_link: str
    magic_token: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'

class LocationResponse(BaseModel):
    city: Optional[str]
    region: Optional[str]
    lat: Optional[float]
    lon: Optional[float]

class EstimateResponse(BaseModel):
    damage: List[str]
    cost: str
