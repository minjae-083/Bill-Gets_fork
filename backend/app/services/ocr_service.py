"""OCR 파이프라인: OpenCV 전처리 -> EasyOCR 추출 -> Regex 1차 파싱 (골격)."""
# import cv2
# import easyocr
# import re


def preprocess(image_bytes: bytes):
    # TODO: OpenCV 로 그레이스케일/이진화/노이즈 제거 등 전처리
    raise NotImplementedError


def extract_text(image_bytes: bytes) -> str:
    # TODO: EasyOCR(reader.readtext)로 텍스트 추출
    raise NotImplementedError


def parse_fields(text: str) -> dict:
    # TODO: Regex 로 날짜/가게명 등 규칙적 필드 1차 파싱
    # 반환 예: {"store": ..., "date": ..., "amount": ..., "items": [...]}
    raise NotImplementedError
