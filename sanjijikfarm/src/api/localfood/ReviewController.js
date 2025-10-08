import { axiosInstance } from '../axios/axios';
import { withErrorBoundary } from '../axios/axios';

/** shop id를 넘기면 매장의 리뷰 목록을 반환하는 함수 */
export const getShopReviewList = (shopId) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get(`/reviews`, {
      params: { shopId: shopId },
    });
    return res.data;
  });
