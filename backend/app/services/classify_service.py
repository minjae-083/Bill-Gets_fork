"""카테고리 분류: Claude/Kakao + DB 캐싱 + Fallback (골격).

제안서 3.4 위험 대책 반영:
- 캐싱: 같은 가게명은 DB에서 먼저 조회하여 API 호출 비용 절감.
- Fallback: 외부 API 실패 시 대체 로직으로 시스템 중단 방지.
"""
# from app.core.config import settings


def classify(store: str, items: list[str]) -> str:
    # TODO 1) DB 캐시 조회 (가게명 기준)
    # TODO 2) 미스 시 Claude API / Kakao Local API 호출로 카테고리 결정
    # TODO 3) 결과를 DB 캐시에 저장
    # TODO 4) 실패 시 Fallback (예: '기타' 카테고리)
    raise NotImplementedError
