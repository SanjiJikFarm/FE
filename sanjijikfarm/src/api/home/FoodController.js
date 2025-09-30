import { axiosInstance } from '../axios/axios';
import { withErrorBoundary } from '../axios/axios';

/** 이번 달을 인자로 전달하면 추천 식재료를 반환하는 함수 */
export const getRecommendedFoods = (month) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get(`/food/month/${month}`);
    return res.data;
  });
