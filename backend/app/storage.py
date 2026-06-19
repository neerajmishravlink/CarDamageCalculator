from pathlib import Path

from minio import Minio
from minio.error import S3Error

from .config import MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET, UPLOAD_FALLBACK_DIR

UPLOAD_DIR = Path(UPLOAD_FALLBACK_DIR).resolve()
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False,
)

_minio_available = None


def _check_minio_available() -> bool:
    global _minio_available
    if _minio_available is not None:
        return _minio_available

    try:
        if client is None:
            _minio_available = False
        else:
            client.bucket_exists(MINIO_BUCKET)
            _minio_available = True
    except Exception:
        _minio_available = False

    return _minio_available


def ensure_bucket():
    if _check_minio_available():
        if not client.bucket_exists(MINIO_BUCKET):
            client.make_bucket(MINIO_BUCKET)
    else:
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def upload_file(object_name: str, data: bytes, content_type: str):
    if _check_minio_available():
        try:
            ensure_bucket()
            client.put_object(
                MINIO_BUCKET,
                object_name,
                data,
                length=len(data),
                content_type=content_type,
            )
            return f"minio://{object_name}"
        except Exception:
            pass

    local_path = UPLOAD_DIR / object_name
    local_path.parent.mkdir(parents=True, exist_ok=True)
    with open(local_path, 'wb') as f:
        f.write(data)
    return str(local_path)


def delete_object(object_name: str):
    if _check_minio_available():
        try:
            client.remove_object(MINIO_BUCKET, object_name)
        except Exception:
            pass
    else:
        local_path = UPLOAD_DIR / object_name
        if local_path.exists():
            try:
                local_path.unlink()
            except Exception:
                pass
