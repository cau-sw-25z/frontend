# Frontend

주식 앱 프론트엔드 프로젝트

## 실행 방법

pnpm install
pnpm dev

## 기술 스택

- React + TypeScript + Vite
- Zustand (상태관리)
- TailwindCSS (스타일링)
- TradingView Lightweight Charts (차트)
- Axios (HTTP)

## 환경

- Node: 24.14.1
- 패키지매니저: pnpm

# 폴더 구조

```txt
src
├─ api
│  └─ API 요청 함수 및 Axios 관련 로직

├─ assets
│  └─ 이미지, 아이콘, 정적 리소스

├─ components
│  └─ 재사용 가능한 공통 UI 컴포넌트

├─ constants
│  └─ 상수 및 설정값 관리

├─ hooks
│  └─ 커스텀 React Hook

├─ layouts
│  └─ 공통 레이아웃 컴포넌트

├─ pages
│  └─ 페이지 단위 컴포넌트

├─ routes
│  └─ React Router 설정 및 라우팅 관리

├─ store
│  └─ Zustand 전역 상태 관리

├─ types
│  └─ TypeScript 타입 및 인터페이스 정의

├─ utils
│  └─ 공통 유틸리티 함수

├─ App.tsx
│  └─ 앱 루트 컴포넌트

├─ main.tsx
│  └─ 앱 진입점

└─ index.css
   └─ 전역 스타일 및 TailwindCSS import
```

---

# 컨벤션

## 브랜치 네이밍

```txt
feat/기능명
fix/버그명
refactor/리팩토링명
```