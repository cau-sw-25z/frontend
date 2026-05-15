export const surveyQuestions = [
  {
    id: 1,
    question: "투자할 때 가장 중요하게 생각하는 것은?",
    options: ["안정성", "수익성", "분산 투자", "단기 성과"],
  },
  {
    id: 2,
    question: "주가가 하락하면 어떻게 행동하나요?",
    options: [
      "바로 매도한다",
      "조금 지켜본다",
      "추가 매수한다",
      "상황을 분석한다",
    ],
  },
  {
    id: 3,
    question: "선호하는 투자 기간은?",
    options: ["1개월 이내", "6개월 이내", "1년 이상", "장기 보유"],
  },
];

export const mockSurveyResult = {
  type: "균형형 투자자",
  description:
    "수익성과 안정성을 함께 고려하며, 무리한 투자보다 꾸준한 성장을 선호하는 유형입니다.",
  color: "#4F46E5",
};
