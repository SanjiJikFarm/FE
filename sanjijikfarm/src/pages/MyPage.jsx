import { useNavigate } from 'react-router-dom';

import ArrowIcon from '@/assets/icons/right-arrow.svg';

export default function MyPage() {
  const navigate = useNavigate();

  const menuList = [
    { label: '나의 구매내역', path: '/mypage/purchases' },
    { label: '나의 리뷰', path: '/mypage/reviews' },
    { label: '찜한 로컬푸드', path: '/mypage/likes' },
  ];

  return (
    <div className="flex flex-col items-center px-5 pt-10">
      {/* 프로필 영역 */}
      <div className="flex w-full flex-col items-center border-b border-gray-200 pb-10">
        {/* 프로필 이미지 (placeholder) */}
        <div className="mb-6 h-16 w-16 rounded-full bg-gray-300" />

        {/* 사용자명 + 화살표 */}
        <button
          type="button"
          onClick={() => navigate('/mypage/profile')}
          className="text-title-2 flex items-center font-semibold"
        >
          김회원
        </button>
      </div>

      {/* 메뉴 리스트 */}
      <div className="mt-12 w-full space-y-7">
        {menuList.map((menu, idx) => (
          <button
            key={idx}
            onClick={() => navigate(menu.path)}
            className="text-title-2 flex w-full items-center justify-between font-bold"
          >
            {menu.label}
            <ArrowIcon className="h-3 w-3" alt="프로필 이동" />
          </button>
        ))}
      </div>
    </div>
  );
}
