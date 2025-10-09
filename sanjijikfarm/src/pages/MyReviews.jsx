import { useEffect, useState } from 'react';

import { fetchReviewList } from '@/api/review/review';
import ReviewCard from '@/components/common/review/ReviewCard';

export default function MyReviews() {
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviewList();
        const formatted = data.map((review) => ({
          name: review.productName,
          date: formatDate(review.createdAt),
          rating: review.rating,
          content: review.text,
          reviewImages: review.imageUrl ? [review.imageUrl] : [],
        }));
        setMyReviews(formatted);
      } catch (err) {
        console.error('❌ 리뷰 목록 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  if (loading) return <div className="p-4">리뷰 불러오는 중...</div>;

  return (
    <div className="h-screen overflow-y-auto p-4">
      {myReviews.length === 0 ? (
        <div className="text-center text-gray-500">작성한 리뷰가 없습니다</div>
      ) : (
        myReviews.map((review, idx) => <ReviewCard key={idx} review={review} />)
      )}
    </div>
  );
}
