import { axiosInstance } from '../axios/axios';
import { withErrorBoundary } from '../axios/axios';

/** 한 매장의 상품 리스트를 반환하는 함수 */
export const getShopProductList = (shopId) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get(`/shops/${shopId}/productList`);
    return res.data;
  });
