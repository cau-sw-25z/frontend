import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { tokenStorage } from '@/utils/tokenStorage'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError('')

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    if (email !== 'test@test.com' || password !== '1234') {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      return
    }

    tokenStorage.setAccessToken('test-token')
    navigate(from, { replace: true })
  }

  const handleSignupClick = () => {
    navigate('/signup')
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
      <h1 style={{ marginBottom: '24px', textAlign: 'center' }}>로그인</h1>

      {error && (
        <p style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>
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

        <div style={{ marginBottom: '24px' }}>
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

        <button type="submit" style={{ width: '100%', padding: '12px', cursor: 'pointer' }}>
          로그인
        </button>
      </form>

      <button
        type="button"
        onClick={handleSignupClick}
        style={{
          width: '100%',
          padding: '12px',
          marginTop: '12px',
          cursor: 'pointer',
        }}
      >
        회원가입 하러가기
      </button>
    </div>
  )
}