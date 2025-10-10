import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const titles = {
  '/home': '홈',
  '/receipt': '영수증',
  '/receipt/upload': '영수증',
  '/receipt/:id': '영수증',
  '/localfood': '로컬푸드',
  '/localfood/:id': '로컬푸드',
  '/report': '소비리포트',
  '/mypage': '마이페이지',
  '/mypage/purchases': '나의 구매내역',
  '/mypage/reviews': '나의 리뷰',
  '/mypage/likes': '찜한 로컬푸드',
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const matchedTitle =
    Object.entries(titles).find(([path]) => matchPath({ path, end: true }, location.pathname))?.[1] || '';

  // 경로를 / 기준으로 쪼개서 길이 확인
  // 이전 버튼 추가용
  const pathDepth = location.pathname.split('/').filter(Boolean).length;

  // url depth가 2단계 이상인 경우 back btn
  const showBackButton = pathDepth > 1;

  return (
    <div className="absolute top-0 z-10 flex h-16 w-full items-center justify-center bg-white shadow-sm">
      {/* 뒤로가기 버튼 */}
      {showBackButton && (
        <button
          onClick={() => navigate(-1)}
          className="hover:bg-gray-1 absolute left-4 flex cursor-pointer items-center justify-center rounded-full p-2 transition"
        >
          <ArrowLeft className="text-gray-7 h-5 w-5" />
        </button>
      )}
      <span className="text-heading-1 font-bold">{matchedTitle}</span>
    </div>
  );
}
