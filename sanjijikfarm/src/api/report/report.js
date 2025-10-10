import { axiosInstance, withErrorBoundary } from '../axios/axios';

// 주별 탄소 절감량
export const fetchWeeklyCarbon = (month) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get(`/carbon/weekly`, {
      params: { month },
    });
    return res.data;
  });

// 상품별 탄소 절감량
export const fetchProductCarbon = (month) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get(`/carbon/product`, {
      params: { month },
    });
    return res.data;
  });

// 월별 탄소 절감량
export const fetchMonthlyCarbon = (month) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get(`/carbon/monthly`, {
      params: { month },
    });
    return res.data;
  });
