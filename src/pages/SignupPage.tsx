import { useState } from 'react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')

    if (!email || !password || !passwordConfirm) {
      setError('모든 항목을 입력해주세요.')
      return
    }

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    console.log({
      email,
      password,
      passwordConfirm,
    })
  }

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '80px auto',
        padding: '32px',
        border: '1px solid #ddd',
        borderRadius: '12px',
      }}
    >
      <h1
        style={{
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        회원가입
      </h1>

      {error && (
        <p
          style={{
            color: 'red',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '8px' }}>
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="이메일을 입력하세요"
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '8px' }}>
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호를 입력하세요"
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label
            htmlFor="passwordConfirm"
            style={{ display: 'block', marginBottom: '8px' }}
          >
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type="password"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            placeholder="비밀번호를 다시 입력하세요"
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', cursor: 'pointer' }}>
          회원가입
        </button>
      </form>
    </div>
  )
}