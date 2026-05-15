import { useNavigate } from "react-router-dom";
import { mockSurveyResult } from "../mocks/survey";

export default function SurveyResultPage() {
  const navigate = useNavigate();

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px" }}>
      <p>투자 성향 결과</p>

      <h1 style={{ color: mockSurveyResult.color }}>{mockSurveyResult.type}</h1>

      <p style={{ marginTop: 16, lineHeight: 1.6 }}>
        {mockSurveyResult.description}
      </p>

      <button
        type="button"
        onClick={() => navigate("/stocks")}
        style={{ marginTop: 32 }}
      >
        포트폴리오 구성하러 가기
      </button>
    </main>
  );
}
