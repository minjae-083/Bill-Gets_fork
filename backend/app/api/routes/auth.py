"""회원가입 / 로그인 라우터 (골격)."""
from fastapi import APIRouter

router = APIRouter()


@router.post("/signup")
def signup():
    # TODO: 이메일/비밀번호 회원가입 (security.hash_password + Supabase 저장)
    raise NotImplementedError


@router.post("/login")
def login():
    # TODO: 인증 후 JWT 발급 (security.create_access_token)
    raise NotImplementedError
