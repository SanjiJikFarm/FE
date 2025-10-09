import { axiosInstance, withErrorBoundary } from '../axios/axios';

// 리뷰 작성
export const createReview = (productId, content, rating, photoUrl) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.post(`/products/${productId}/reviews`, {
      productId,
      content,
      rating,
      photoUrl,
    });
    return res.data;
  });

// 리뷰 수정
export const updateReview = (reviewId, productId, content, rating, photoUrl) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.patch(`/reviews/${reviewId}`, {
      productId,
      content,
      rating,
      photoUrl,
    });
    return res.data;
  });

// 내 리뷰 불러오기
export const fetchReviewList = async (page = 0, size = 50) => {
  const res = await axiosInstance.get('/me/reviews', {
    params: { page, size },
  });
  return res.data.content;
};
