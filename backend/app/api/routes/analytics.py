"""분석 & 통계 라우터 (골격)."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/summary")
def monthly_summary(month: str | None = None):
    # TODO: 월별 추이/요일별/전월 비교/예산 관리 집계
    raise NotImplementedError
