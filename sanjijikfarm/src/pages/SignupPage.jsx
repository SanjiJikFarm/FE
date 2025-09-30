import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login, register } from '@/api/axios/auth';

export default function SignupPage() {
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(id, 'winterksy@example.com', password);
      await login(id, password);
      alert('회원가입 및 로그인에 성공하였습니다.');
      navigate('/home');
    } catch (err) {
      console.log(err.message || '회원가입/로그인 실패!');
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
      <span className="text-title-0 font-bold">회원가입하여 시작하세요</span>

      <form onSubmit={onSubmit} className="flex w-77.5 flex-col gap-2">
        {/* 아이디 */}
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="아이디를 입력하세요"
          required
          className="text-body-1 w-full rounded-md border border-gray-300 px-4 py-2 font-bold focus:ring-0 focus:outline-none"
        />

        {/* 비밀번호 */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          required
          className="text-body-1 w-full rounded-md border border-gray-300 px-4 py-2 font-bold focus:ring-0 focus:outline-none"
        />

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className="bg-main-green w-full rounded-md py-2 font-semibold text-white hover:bg-green-600"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}
