import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { surveyQuestions } from "../mocks/survey";

export default function SurveyPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const currentQuestion = surveyQuestions[currentIndex];
  const selectedAnswer = answers[currentQuestion.id];

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === surveyQuestions.length - 1;

  const handleSelect = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    if (isLast) {
      navigate("/survey/result");
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "80px 20px" }}>
      <p>
        {currentIndex + 1} / {surveyQuestions.length}
      </p>

      <h1
        style={{
          fontSize: 28,
          lineHeight: 1.4,
          textAlign: "center",
          margin: "24px 0",
        }}
      >
        {currentQuestion.question}
      </h1>

      <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
            style={{
              padding: "16px",
              borderRadius: 12,
              border:
                selectedAnswer === option
                  ? "2px solid black"
                  : "1px solid #ddd",
              background: selectedAnswer === option ? "#f3f4f6" : "white",
              cursor: "pointer",
              textAlign: "left",
              fontSize: 16,
            }}
          >
            {option}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 32,
        }}
      >
        {!isFirst ? (
          <button type="button" onClick={handlePrev}>
            이전
          </button>
        ) : (
          <div />
        )}

        <button type="button" onClick={handleNext} disabled={!selectedAnswer}>
          {isLast ? "제출하기" : "다음"}
        </button>
      </div>
    </main>
  );
}
