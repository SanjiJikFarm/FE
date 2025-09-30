import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { login, register } from '@/api/axios/auth';
import { SignupSchema } from '@/lib/utils/SignupSchema';

export default function SignupPage() {
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // 최종 유효성 검사
      SignupSchema.parse({ username: id, password });
      await register(id, 'winterksy@example.com', password);
      await login(id, password);
      alert('회원가입 및 로그인에 성공하였습니다.');
      navigate('/home');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = err.flatten().fieldErrors;
        setErrors({
          username: fieldErrors.username?.[0],
          password: fieldErrors.password?.[0],
        });
      } else {
        console.log(err.message || '회원가입/로그인 실패!');
      }
    }
  };

  const validateFields = (id, pw) => {
    try {
      SignupSchema.parse({ username: id, password: pw });
      setErrors({});
    } catch (e) {
      if (e instanceof z.ZodError) {
        const fieldErrors = e.flatten().fieldErrors;
        setErrors({
          username: fieldErrors.username?.[0],
          password: fieldErrors.password?.[0],
        });
      }
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
      <span className="text-title-0 font-bold">회원가입하여 시작하세요</span>

      <form onSubmit={onSubmit} className="flex w-77.5 flex-col gap-5">
        {/* 아이디 */}
        <div className="relative flex flex-col">
          <input
            type="text"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              validateFields(e.target.value, password);
            }}
            placeholder="아이디를 입력하세요"
            required
            className="text-body-1 w-full rounded-md border border-gray-300 px-4 py-2 font-bold focus:ring-0 focus:outline-none"
          />
          {errors.username && <span className="text-body-2-med absolute top-10 text-red-500">{errors.username}</span>}
        </div>

        {/* 비밀번호 */}
        <div className="relative flex flex-col">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validateFields(id, e.target.value);
            }}
            placeholder="비밀번호를 입력하세요"
            required
            className="text-body-1 w-full rounded-md border border-gray-300 px-4 py-2 font-bold focus:ring-0 focus:outline-none"
          />
          {errors.password && <span className="text-body-2-med absolute top-10 text-red-500">{errors.password}</span>}
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          disabled={!!errors.username || !!errors.password || !id || !password}
          className={`w-full rounded-md py-2 font-semibold text-white ${
            !!errors.username || !!errors.password || !id || !password
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-main-green hover:bg-green-600'
          }`}
        >
          회원가입
        </button>
      </form>
    </div>
  );
}
