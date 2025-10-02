import { axiosInstance } from '../axios/axios';
import { withErrorBoundary } from '../axios/axios';

/** 전체 매장 리스트를 조회하는 함수 */
export const getShopLists = () =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get('/shops');
    return res.data;
  });

/** 매장 하나를 상세조회하는 함수 */
export const getShopDetail = (shopId) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get(`/shops/${shopId}`);
    return res.data;
  });
