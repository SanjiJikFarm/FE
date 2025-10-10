import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getShopProductList } from '@/api/localfood/ProductController';
import { getShopReviewList } from '@/api/localfood/ReviewController';
import { getShopDetail } from '@/api/localfood/ShopController';
import LocalfoodEmptyCard from '@/components/common/empty/LocalfoodEmptyCard';
import LikeLocalfoodCard from '@/components/common/like/LikeLocalfoodCard';
import ReviewCard from '@/components/common/review/ReviewCard';
import LocalfoodDetailToggle from '@/components/feature/localfood/localfood-detail/LocalfoodDetailToggle';
import UpperLocafoodInfo from '@/components/feature/localfood/localfood-detail/UpperLocafoodInfo';

export default function LocalfoodDetailPage() {
  // URL 파라미터에서 shopId 추출
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('menu');

  // 매장 상세 정보 쿼리
  const {
    data: shopDetail,
    isLoading: isShopDetailLoading,
    error: shopDetailError,
  } = useQuery({
    queryKey: ['shopDetail', id],
    queryFn: () => getShopDetail(id),
    enabled: !!id && id !== 'undefined', // id가 있을 때만 쿼리 실행
  });
  // 매장 상품 리스트 쿼리
  const {
    data: shopProducts = [],
    isLoading: isShopProductsLoading,
    error: shopProductsError,
  } = useQuery({
    queryKey: ['shopProducts', id],
    queryFn: () => getShopProductList(id),
    enabled: !!id && id !== 'undefined' && activeTab == 'menu', // id가 있을 때, menu 탭인 경우만 쿼리 실행
  });
  // 매장 리뷰 리스트 쿼리
  const {
    data: shopReviews,
    isLoading: isShopReviewsLoading,
    error: shopReviewsError,
  } = useQuery({
    queryKey: ['shopReviews', id],
    queryFn: () => getShopReviewList(id),
    enabled: !!id && id !== 'undefined' && activeTab == 'review', // id가 있을 때, review 탭인 경우만 쿼리 실행
  });

  if (isShopDetailLoading || isShopProductsLoading || isShopReviewsLoading) return <div>Loading...</div>;
  if (shopDetailError || shopProductsError || shopReviewsError) return <div>Error loading shop details.</div>;

  return (
    <div className="flex h-full w-full flex-col">
      <UpperLocafoodInfo shop={shopDetail} />
      <LocalfoodDetailToggle onSelect={setActiveTab} active={activeTab} />
      <div className="scrollbar-hide flex flex-grow flex-col overflow-scroll">
        {activeTab === 'menu' ? (
          shopProducts.length > 0 ? (
            shopProducts.map((localfood) => <LikeLocalfoodCard key={localfood.productId} localfood={localfood} />)
          ) : (
            <LocalfoodEmptyCard text="아직 등록된 메뉴가 없습니다." />
          )
        ) : shopReviews.content.length > 0 ? (
          shopReviews.content.map((review) => <ReviewCard key={review.id} review={review} />)
        ) : (
          <LocalfoodEmptyCard text="아직 등록된 리뷰가 없습니다." />
        )}
      </div>
    </div>
  );
}
