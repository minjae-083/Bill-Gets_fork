"""Bill-Gets 백엔드 진입점 (FastAPI)."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, receipts, transactions, analytics, files

app = FastAPI(title="Bill-Gets API", version="0.1.0")

# CORS - 프론트엔드(Vite dev 서버) 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # TODO: 배포 도메인 추가
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 기능별 라우터 등록
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(receipts.router, prefix="/receipts", tags=["receipts"])
app.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(files.router, prefix="/files", tags=["files"])


@app.get("/")
def health_check():
    return {"status": "ok", "service": "Bill-Gets API"}
