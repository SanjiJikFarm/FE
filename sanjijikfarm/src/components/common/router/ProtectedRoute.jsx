// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/api/axios/store';

export default function ProtectedRoute() {
  const location = useLocation();
  // Zustand에서 accessToken 가져오기
  const { accessToken } = useAuthStore();

  // accessToken 없으면 splash 페이지로 리다이렉트
  if (!accessToken) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // 로그인 되어있으면 자식 라우트 렌더링
  return <Outlet />;
}
