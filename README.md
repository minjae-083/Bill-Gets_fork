# 자동 가계부 생성기
 영수증 사진에서 물품, 날짜, 금액을 자동 추출하고, 카테고리 별로 분류하여 대시보드로 시각화하는 웹 애플리케이션입니다.

## 팀 소개
변민재, 김민승, 김현영, 배준성

## 개요
 ### 문제 인식
  자금 관리의 핵심이라고 할 수 있는 가계부를 작성하지 않는 대다수의 경우, 소비 내역을 일일이 작성하는 것의 번거로움 때문이라고 판단하였습니다.

 ### 해결 방안
  번거로움이라는 핵심적인 문제에 대한 해결 방안으로 "소비 내역을 작성하는 과정을 단순화한다면 더 많은 사람이 가계부를 작성할 것"이라는 판단 하에 영수증 이미지를 통한 가계부 작성 프로그램을 기획하였습니다.

## 프로젝트 구조
```
Bill-Gets/
├── frontend/        # React (Vite + JS) - 화면/UI
│   └── src/
│       ├── pages/       # 메인, 영수증 등록, 지출 내역, 분석&통계, 나만의 파일, 로그인
│       ├── components/  # 재사용 컴포넌트
│       ├── api/         # 백엔드 호출 클라이언트
│       └── contexts/    # 로그인 상태 등 전역 상태
└── backend/         # FastAPI (Python) - API/로직
    └── app/
        ├── api/routes/  # auth, receipts, transactions, analytics, files
        ├── services/    # OCR, 카테고리 분류, 챗봇, 내보내기
        ├── core/        # 설정, JWT 인증, Supabase 연결
        └── models/      # Pydantic 스키마
```

### 실행 방법
```bash
# 프론트엔드
cd frontend && npm install && npm run dev

# 백엔드
cd backend && pip install -r requirements.txt && uvicorn main:app --reload
```
환경 변수는 각 폴더의 `.env.example`을 `.env`로 복사해 값을 채운다.

## 사용자 가이드

## 개발자 가이드

## Reference
