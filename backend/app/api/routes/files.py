"""나만의 파일 / Excel·CSV 내보내기 라우터 (골격)."""
from fastapi import APIRouter

router = APIRouter()


@router.post("")
def create_file():
    # TODO: 선택한 내역으로 파일(가계부) 생성
    raise NotImplementedError


@router.get("/{file_id}/export")
def export_file(file_id: str):
    # TODO: export_service 로 Excel 생성 후 StreamingResponse 반환
    raise NotImplementedError
