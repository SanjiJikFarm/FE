import { axiosInstance } from '../axios/axios';
import { withErrorBoundary } from '../axios/axios';

/** 이번 달을 인자로 전달하면 탄소 절감량을 반환하는 함수 */
export const getRecommendedFoods = (month) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get('/carbon/monthly', {
      params: month,
    });
    return res.data;
  });
