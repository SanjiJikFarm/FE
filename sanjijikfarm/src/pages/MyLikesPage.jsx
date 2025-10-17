import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getLikedProducts } from '@/api/like/LikeController';
import LocalfoodEmptyCard from '@/components/common/empty/LocalfoodEmptyCard';
import LikeLocalfoodCard from '@/components/common/like/LikeLocalfoodCard';

export default function MyLikesPage() {
  // 다음 페이지 감지용 inview
  const { ref, inView } = useInView();

  // 무한 스크롤용 React Infinite Query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, isLoading } = useInfiniteQuery({
    queryKey: ['likedProducts'],
    queryFn: ({ pageParam = 0 }) => getLikedProducts(pageParam),
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
  });

  // inView 감지 시 다음 페이지 자동 호출
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading || isError) return;

  const allProducts = data?.pages.flatMap((page) => page.contents) ?? [];

  return (
    <div className="flex h-full w-full">
      <div className="scrollbar-hide flex flex-grow flex-col overflow-scroll">
        {allProducts.length > 0 ? (
          allProducts.map((localfood) => <LikeLocalfoodCard key={localfood.id} localfood={localfood} />)
        ) : (
          <LocalfoodEmptyCard text="아직 찜한 메뉴가 없습니다." />
        )}

        {/* 감지용 div */}
        <div ref={ref} className="flex h-10 items-center justify-center">
          {isFetchingNextPage && <p>불러오는 중...</p>}
        </div>
      </div>
    </div>
  );
}
