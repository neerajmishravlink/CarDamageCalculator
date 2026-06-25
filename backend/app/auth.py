from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from itsdangerous import URLSafeTimedSerializer
import jwt
from datetime import datetime, timedelta

from .config import SECRET_KEY, MAGIC_SALT, JWT_ALGORITHM, JWT_EXPIRE_MINUTES

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/verify')

serializer = URLSafeTimedSerializer(SECRET_KEY, salt=MAGIC_SALT)


def create_magic_token(email: str) -> str:
    return serializer.dumps(email)


def verify_magic_token(token: str, max_age: int = 3600) -> str:
    try:
        return serializer.loads(token, max_age=max_age)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid or expired token')


def create_jwt_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload = {'sub': email, 'exp': expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)


def verify_jwt_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload.get('sub')
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Token expired')
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token')


def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    return verify_jwt_token(token)
