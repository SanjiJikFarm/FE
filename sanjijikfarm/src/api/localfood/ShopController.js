import { axiosInstance } from '../axios/axios';
import { withErrorBoundary } from '../axios/axios';

/** lat, lng를 전달하면 전체 매장 리스트를 조회하는 함수 */
export const getShopList = (lat, lng, params = {}) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get('/shops/map', { lat, lng, ...params });
    return res.data;
  });

/** 매장 하나를 상세조회하는 함수 */
export const getShopDetail = (shopId) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get(`/shops/${shopId}`);
    return res.data;
  });

/** lat, lng와 전달한 키워드로 매장을 검색하는 함수 */
export const searchShops = (keyword, lat, lng, params = {}) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get('/shops', {
      params: { keyword, lat, lng, ...params },
    });
    return res.data;
  });

/** lat, lng를 전달하면 가까운 매장 리스트를 반환하는 함수 */
export const getNearbyShops = (lat, lng, params = {}) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get('/shops/map/nearby', {
      params: { lat, lng, ...params },
    });
    return res.data;
  });
