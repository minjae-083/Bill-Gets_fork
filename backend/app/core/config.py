"""환경 변수 로드 및 설정."""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
    KAKAO_API_KEY = os.getenv("KAKAO_API_KEY", "")

    JWT_SECRET = os.getenv("JWT_SECRET", "change-me")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))


settings = Settings()
