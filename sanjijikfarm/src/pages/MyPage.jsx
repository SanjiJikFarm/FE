import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/api/axios/store';
import { getPresignedUrl, saveUserProfileImage, updateUserProfileImage, uploadImageToS3 } from '@/api/profile/profile';
import ArrowIcon from '@/assets/icons/right-arrow.svg';

export default function MyPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const username = useAuthStore((state) => state.username);
  const profileImageKey = useAuthStore((state) => state.profileImageKey);
  const setProfileImageKey = useAuthStore((state) => state.setProfileImageKey);

  const profileImageUrl = useMemo(() => {
    return profileImageKey ? `https://sanjijikfarm-image.s3.ap-northeast-2.amazonaws.com/${profileImageKey}` : null;
  }, [profileImageKey]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { presignedUrl, key: newKey } = await getPresignedUrl(file.name, file.type);
      await uploadImageToS3(presignedUrl, file);

      if (profileImageKey) {
        await updateUserProfileImage(newKey);
      } else {
        await saveUserProfileImage(newKey);
      }

      if (profileImageKey !== newKey) {
        setProfileImageKey(newKey);
      }

      alert('프로필 사진이 변경되었습니다!');
    } catch (err) {
      console.error(err);
      alert('업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const menuList = [
    { label: '나의 구매내역', path: '/mypage/purchases' },
    { label: '나의 리뷰', path: '/mypage/reviews' },
    { label: '찜한 로컬푸드', path: '/mypage/likes' },
  ];

  return (
    <div className="flex flex-col items-center px-5 pt-10">
      <div className="flex w-full flex-col items-center border-b border-gray-200 pb-10">
        <div className="relative mb-3 h-16 w-16">
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="프로필 이미지" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-300" />
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute right-0 bottom-0 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-bold text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            +
          </button>

          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
        </div>

        <button
          type="button"
          onClick={() => navigate('/mypage/profile')}
          className="text-title-2 flex items-center font-semibold"
        >
          {username ?? '김회원'}
        </button>
      </div>

      <div className="mt-12 w-full space-y-7">
        {menuList.map((menu, idx) => (
          <button
            key={idx}
            onClick={() => navigate(menu.path)}
            className="text-title-2 flex w-full items-center justify-between font-bold"
          >
            {menu.label}
            <ArrowIcon className="h-3 w-3" alt="화살표 아이콘" />
          </button>
        ))}
      </div>
    </div>
  );
}
