// API 공통 응답 형식
// 백엔드의 모든 API는 이 형식으로 응답함
// 참고: BE 레포의 docs/api-convention.md
export interface ApiResponse<T> {
  // 요청 성공 여부
  success: boolean

  // 실제 응답 데이터 (실패 시 null)
  data: T | null

  // 응답 메시지 (사용자에게 보여줄 수 있음)
  message: string

  // 응답 코드 (예: "SUCCESS", "COMMON_400", "COMMON_401" 등)
  code: string
}