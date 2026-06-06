"""JWT 발급/검증 및 비밀번호 해싱 (골격)."""
# from datetime import datetime, timedelta
# from jose import jwt
# from passlib.context import CryptContext
# from app.core.config import settings


def hash_password(plain: str) -> str:
    # TODO: passlib 으로 해싱
    raise NotImplementedError


def verify_password(plain: str, hashed: str) -> bool:
    # TODO: passlib 으로 검증
    raise NotImplementedError


def create_access_token(user_id: str) -> str:
    # TODO: jose.jwt 로 토큰 발급 (settings.JWT_SECRET 사용)
    raise NotImplementedError


def decode_access_token(token: str) -> dict:
    # TODO: 토큰 디코드/검증 후 payload 반환
    raise NotImplementedError
