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

export const surveyResults = [
  {
    level: 1,
    type: "안정형 투자자",
    description: "원금 보존과 안정성을 가장 중요하게 생각하는 유형입니다.",
    color: "#22C55E",
  },
  {
    level: 2,
    type: "안정추구형 투자자",
    description: "안정성을 우선하면서도 적당한 수익을 기대하는 유형입니다.",
    color: "#84CC16",
  },
  {
    level: 3,
    type: "균형형 투자자",
    description:
      "수익성과 안정성을 함께 고려하며, 무리한 투자보다 꾸준한 성장을 선호하는 유형입니다.",
    color: "#3B82F6",
  },
  {
    level: 4,
    type: "적극투자형 투자자",
    description:
      "어느 정도의 위험을 감수하며 더 높은 수익을 추구하는 유형입니다.",
    color: "#F97316",
  },
  {
    level: 5,
    type: "공격형 투자자",
    description:
      "높은 변동성을 감수하더라도 큰 수익 가능성을 추구하는 유형입니다.",
    color: "#EF4444",
  },
];

export const mockSurveyResult = surveyResults[2];
