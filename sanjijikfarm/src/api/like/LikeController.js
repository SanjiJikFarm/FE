import { axiosInstance } from '../axios/axios';
import { withErrorBoundary } from '../axios/axios';

/** 상품 아이디를 전달하면 찜 리스트에 추가하는 함수 */
export function likeProduct(productId) {
  return withErrorBoundary(async () => {
    const res = await axiosInstance.get(`/products/${productId}/like`);
    return res.data;
  });
}

/** 상품 아이디를 전달하면 찜 리스트에서 제거하는 함수 */
export function unlikeProduct(productId) {
  return withErrorBoundary(async () => {
    const res = await axiosInstance.delete(`/products/${productId}/like`);
    return res.data;
  });
}

/** 찜한 상품 리스트를 조회하는 함수 */
export function getLikedProducts(page = 0, size = 20, sort = 'productId,desc') {
  return withErrorBoundary(async () => {
    const res = await axiosInstance.get('/users/likes', {
      params: { page, size, sort },
    });
    return res.data;
  });
}
