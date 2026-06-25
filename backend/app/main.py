from fastapi import FastAPI, Depends, UploadFile, File, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from typing import List
from datetime import timedelta
import os
import uuid

from .config import ORIGIN, BASE_URL
from .auth import create_magic_token, verify_magic_token, verify_jwt_token, create_jwt_token, get_current_user
from .schemas import AuthRequest, MagicLinkResponse, AuthResponse, LocationResponse, EstimateResponse
from .storage import upload_file, delete_object
from .geo import reverse_geocode

app = FastAPI(title='CarDamageCalculator API')

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ORIGIN],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail='Rate limit exceeded')

@app.post('/auth/request', response_model=MagicLinkResponse)
@limiter.limit('30/minute')
async def auth_request(request: Request, payload: AuthRequest):
    magic_token = create_magic_token(payload.email)
    verify_url = f"{ORIGIN}/?token={magic_token}"
    # In a real app send email via SMTP. Here we log to console for MailDev compatibility.
    print(f"Magic link for {payload.email}: {verify_url}")
    return {
        'message': 'Magic link generated. Use the token to verify or follow the link.',
        'magic_link': verify_url,
        'magic_token': magic_token,
    }

@app.get('/auth/verify', response_model=AuthResponse)
async def auth_verify(token: str):
    try:
        email = verify_magic_token(token)
    except HTTPException:
        email = verify_jwt_token(token)
    access_token = create_jwt_token(email)
    return AuthResponse(access_token=access_token)

@app.get('/location', response_model=LocationResponse)
@limiter.limit('30/minute')
async def location(request: Request, lat: float = None, lon: float = None, user: str = Depends(get_current_user)):
    if lat is None or lon is None:
        raise HTTPException(status_code=400, detail='lat and lon are required')
    return reverse_geocode(lat, lon)

@app.post('/estimate', response_model=EstimateResponse)
@limiter.limit('30/minute')
async def estimate(request: Request, user: str = Depends(get_current_user), images: List[UploadFile] = File(...)):
    if not images:
        raise HTTPException(status_code=400, detail='At least one image is required')

    uploaded_keys = []
    try:
        for image in images:
            contents = await image.read()
            object_name = f"{uuid.uuid4().hex}_{image.filename}"
            upload_file(object_name, contents, image.content_type or 'application/octet-stream')
            uploaded_keys.append(object_name)
    except Exception as exc:
        for object_name in uploaded_keys:
            delete_object(object_name)
        raise HTTPException(status_code=500, detail=f'Failed to store uploaded file: {exc}')

    # Placeholder inference: simple mock damage/cost.
    damage = ['front bumper', 'left door']
    cost = '$1,200'

    for object_name in uploaded_keys:
        delete_object(object_name)

    return EstimateResponse(damage=damage, cost=cost)
