import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { likeProduct, unlikeProduct } from '@/api/like/LikeController';

/** 상품의 id, 현재 liked 여부를 전달하면 찜 토글을 관리하는 훅 */
export const useToggleLike = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const toggleLike = useMutation({
    // liked 여부에 따라 조건부 실행 함수
    mutationFn: async ({ productId, isLiked }) => {
      if (isLiked) {
        await unlikeProduct(productId);
      } else {
        await likeProduct(productId);
      }
    },
    // 요청 직전에 캐시를 즉시 수정하는 낙관적 UI 업데이트 (UX 개선 위해)
    onMutate: async ({ productId, isLiked }) => {
      // 수정할 data의 query key
      const allQueryKeys = [['shopProducts'], ['likedProducts']];
      // rollback 저장용 배열
      const previousSnapshots = [];

      allQueryKeys.forEach((queryKey) => {
        const queryDataList = queryClient.getQueriesData({ queryKey });

        queryDataList.forEach(([key, oldData]) => {
          if (!oldData) return;
          previousSnapshots.push([key, oldData]); // rollback용 저장

          // shopProducts: 배열형
          if (Array.isArray(oldData)) {
            const newData = oldData.map((item) =>
              item.productId === productId
                ? {
                    ...item,
                    liked: !isLiked,
                    productLike: item.productLike + (isLiked ? -1 : 1),
                  }
                : item,
            );
            queryClient.setQueryData(key, newData);
          }

          // likedProducts: infiniteQuery형
          else if (oldData.pages) {
            const newPages = oldData.pages.map((page) => ({
              ...page,
              content: page.content.map((item) =>
                item.productId === productId
                  ? {
                      ...item,
                      liked: !isLiked,
                      productLike: item.productLike + (isLiked ? -1 : 1),
                    }
                  : item,
              ),
            }));
            queryClient.setQueryData(key, { ...oldData, pages: newPages });
          }
        });
      });

      return { previousSnapshots };
    },
    // 성공 시 별도 처리 없음 (낙관적 UI로 기반영됨)
    onSuccess: () => {},
    // 실패 시 캐시를 이전 상태로 복구
    // error 객체, mutationFn에 전달한 변수, onMutate에서 반환한 값
    onError: (error, _variables, context) => {
      console.error('찜 토글 중 오류 발생:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }

      // 실패 시 이전 데이터로 되돌리기
      if (context?.previousDataList) {
        context.previousDataList.forEach(([key, oldData]) => {
          queryClient.setQueryData(key, oldData);
        });
      }
    },
    // 성공/실패 후 항상 호출해 관련 캐시 무효화
    // 혹시 모르는 상황 방지 위해 서버 데이터 재동기화 하는 역할
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['shopProducts'] });
      queryClient.invalidateQueries({ queryKey: ['likedProducts'] });
    },
  });

  return { mutate: toggleLike.mutate, isToggling: toggleLike.isLoading };
};
