import { useEffect, useState } from 'react';
import axios from 'axios';

import { createReview, updateReview } from '@/api/review/review';

import EmptyStar from '../../../assets/icons/emptystar.svg';
import GreenStar from '../../../assets/icons/greenstar.svg';
import PicUpload from '../../../assets/icons/picupload.svg';

export default function ReviewModal({ item, onClose, isEditMode }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!item) return;

    setRating(item.rating || 0);
    setReviewText(item.reviewText || '');
    if (item.imageUrl) {
      setImages([{ preview: item.imageUrl }]);
    } else {
      setImages([]);
    }
  }, [item]);

  // presigned URL 발급 함수
  const getPresignedUrl = async (file) => {
    const res = await fetch('https://relz6skmy6.execute-api.ap-northeast-2.amazonaws.com/dev/presigned-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        filetype: file.type,
      }),
    });

    if (!res.ok) throw new Error('Failed to get presigned URL');

    const data = await res.json();
    return data;
  };

  // 이미지 선택
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  // 이미지 제거
  const handleImageRemove = (index) => {
    setImages((prev) => {
      const newImages = [...prev];
      if (newImages[index].preview) URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // 리뷰 등록 / 수정
  const handleSubmit = async () => {
    try {
      let photoUrl = '';

      // 이미지가 있다면 S3 업로드 먼저
      if (images.length > 0 && images[0].file) {
        const file = images[0].file;
        const presignedData = await getPresignedUrl(file);
        const url = presignedData.url;

        // S3 업로드
        await axios.put(url, file, {
          headers: { 'Content-Type': file.type },
        });

        // 업로드된 실제 이미지 URL
        photoUrl = url.split('?')[0];
      }

      if (isEditMode && item.reviewId !== undefined) {
        await updateReview(item.reviewId, item.productId, reviewText, rating, photoUrl);
        alert('리뷰가 수정되었습니다.');
      } else {
        await createReview(item.productId, reviewText, rating, photoUrl);
        alert('리뷰가 등록되었습니다.');
      }

      onClose();
    } catch (error) {
      console.error('리뷰 저장 실패:', error);
      alert('리뷰 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div
      className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-[20rem] overflow-y-auto rounded-xl bg-white p-[1.5rem] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-[1rem] right-[1rem] text-[1.25rem] text-gray-400 hover:text-black"
        >
          ×
        </button>

        {/* 상품명 */}
        <div className="mb-[0.5rem]">
          <p className="text-[1rem] leading-tight font-bold text-black">{item?.name}</p>
          <p className="text-body-2-med mt-[0.3rem] text-gray-700">{item?.code}</p>
        </div>

        {/* 별점 */}
        <div className="mt-[0.5rem] mb-[0.5rem] flex justify-center space-x-[0.25rem]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHovered(i + 1)}
              onMouseLeave={() => setHovered(null)}
              className="h-[1.5rem] w-[1.5rem] cursor-pointer"
            >
              {i < (hovered ?? rating) ? (
                <GreenStar className="h-full w-full" />
              ) : (
                <EmptyStar className="h-full w-full" />
              )}
            </div>
          ))}
        </div>

        {/* 리뷰 텍스트 */}
        <textarea
          placeholder="구체적인 상세 리뷰를 작성해주세요."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="text-body-2-med bg-pale-green h-[6rem] w-full resize-none rounded-[0.5rem] p-[0.75rem] leading-relaxed text-gray-800 placeholder:text-gray-400"
        />

        {/* 이미지 업로드 */}
        <div className="mt-[0.75rem] space-y-[0.5rem]">
          <div className="flex justify-start">
            <label className="relative flex h-[1rem] w-[1.2rem] cursor-pointer items-center justify-center rounded-md border border-gray-300">
              <PicUpload className="h-[0.5rem] w-[0.5rem] text-gray-500" />
              <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          {images.length > 0 && (
            <div className="flex gap-[0.5rem] overflow-x-auto">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative h-[3.5rem] w-[3.5rem] min-w-[3.5rem] shrink-0 overflow-hidden rounded-md bg-gray-200"
                >
                  <img src={img.preview} alt={`uploaded-${index}`} className="h-full w-full object-cover" />

                  <button
                    className="bg-opacity-50 absolute top-[0.2rem] right-[0.2rem] flex h-[1rem] w-[1rem] items-center justify-center rounded-full bg-black text-[0.75rem] text-white"
                    onClick={() => handleImageRemove(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 작성/수정 완료 버튼 */}
        <button
          className="text-body-2-med mx-auto mt-[0.75rem] block w-[5rem] rounded-md bg-gray-200 py-[0.3rem] text-[0.87rem] transition hover:bg-gray-400"
          onClick={handleSubmit}
          disabled={rating === 0 || reviewText.trim() === ''}
        >
          {isEditMode ? '수정 완료' : '작성 완료'}
        </button>
      </div>
    </div>
  );
}
