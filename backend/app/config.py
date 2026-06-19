from pathlib import Path
from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.getenv('SECRET_KEY', 'change-me')
MAGIC_SALT = os.getenv('MAGIC_SALT', 'magic-salt')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
JWT_EXPIRE_MINUTES = int(os.getenv('JWT_EXPIRE_MINUTES', '60'))
MINIO_ENDPOINT = os.getenv('MINIO_ENDPOINT', 'localhost:9000')
MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY', 'minioadmin')
MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY', 'minioadmin')
MINIO_BUCKET = os.getenv('MINIO_BUCKET', 'uploads')
UPLOAD_FALLBACK_DIR = os.getenv('UPLOAD_FALLBACK_DIR', str(BASE_DIR / 'uploads'))
MAILDEV_HOST = os.getenv('MAILDEV_HOST', 'maildev')
MAILDEV_PORT = int(os.getenv('MAILDEV_PORT', '1025'))
ORIGIN = os.getenv('ORIGIN', 'http://localhost:3000')
BASE_URL = os.getenv('BASE_URL', 'http://localhost:8000')
