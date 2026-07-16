import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { login } from "@/common/api";
import { tokenStorage } from "@/common/utils/tokenStorage";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    // 입력값 검사
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      // 로그인 API 호출
      const result = await login({
        email,
        password,
      });

      // JWT 저장
      tokenStorage.setAccessToken(result.accessToken);

      // 이전 페이지 또는 메인으로 이동
      navigate(from, { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "80px auto",
        padding: "32px",
        border: "1px solid #ddd",
        borderRadius: "12px",
      }}
    >
      <h1 style={{ marginBottom: "24px", textAlign: "center" }}>로그인</h1>

      {error && (
        <p
          style={{
            color: "red",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "8px",
            }}
          >
            이메일
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="이메일을 입력하세요"
            style={{
              width: "100%",
              padding: "12px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: "8px",
            }}
          >
            비밀번호
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호를 입력하세요"
            style={{
              width: "100%",
              padding: "12px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            cursor: "pointer",
          }}
        >
          로그인
        </button>
      </form>

      <button
        type="button"
        onClick={handleSignupClick}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "12px",
          cursor: "pointer",
        }}
      >
        회원가입 하러가기
      </button>
    </div>
  );
}
