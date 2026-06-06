"""영수증 업로드 / OCR 라우터 (골격)."""
from fastapi import APIRouter, UploadFile, File

router = APIRouter()


@router.post("")
async def upload_receipt(image: UploadFile = File(...)):
    # TODO: ocr_service.extract() -> classify_service.classify() -> 결과 반환
    raise NotImplementedError
