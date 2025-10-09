import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/api/axios/store';
import { getReceiptDetail } from '@/api/receipt/receipt';
import { fetchReviewList } from '@/api/review/review';

import ItemCard from '../components/feature/Receipt/ItemCard';
import ReviewModal from '../components/feature/Receipt/ReviewModal';

export default function ReceiptDetail() {
  const { id: receiptId } = useParams();
  const { username } = useAuthStore.getState();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    data: receipt,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['receiptDetail', receiptId],
    queryFn: async () => {
      const [receiptData, reviews] = await Promise.all([getReceiptDetail(username, receiptId), fetchReviewList()]);

      const itemListWithReviews = receiptData.itemList.map((item) => {
        const matched = reviews.find((r) => r.productId === item.productId);
        return {
          ...item,
          reviewId: matched?.reviewId ?? null,
          rating: matched?.rating ?? null,
          reviewText: matched?.text ?? '',
          imageUrl: matched?.imageUrl ?? null,
        };
      });

      return {
        ...receiptData,
        itemList: itemListWithReviews,
      };
    },
  });

  const handleOpenModal = (item) => {
    const updatedItem = receipt.itemList.find((i) => Number(i.productId) === Number(item.productId));
    setSelectedItem(updatedItem ?? item);
    setIsEditMode(!!updatedItem?.reviewId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  if (isLoading) return <p className="py-10 text-center">로딩 중...</p>;
  if (isError || !receipt) return <p className="py-10 text-center">영수증을 불러오지 못했습니다.</p>;

  return (
    <div className="h-screen overflow-hidden bg-white">
      {isModalOpen && (
        <ReviewModal
          item={selectedItem}
          onClose={async () => {
            await refetch();
            handleCloseModal();
          }}
          isEditMode={isEditMode}
        />
      )}

      <div className="scrollbar-hide max-h-[calc(100vh-120px)] overflow-y-auto px-4 py-3">
        <div className="mb-6 border-b border-gray-300 py-3 text-sm text-gray-800">
          <p className="text-body-2-med text-center text-gray-600">{receipt.date}</p>
          <div className="pb-4">
            <p className="text-title-3 text-center font-bold">{receipt.storeName}</p>
          </div>
        </div>

        <div className="mb-8 space-y-3">
          {receipt.itemList.map((item, i) => (
            <ItemCard
              key={i}
              {...item}
              onClickReview={() =>
                handleOpenModal({
                  ...item,
                  reviewText: item.reviewText || '',
                })
              }
            />
          ))}
        </div>

        <div className="mt-6 border-t border-gray-300">
          <SummaryRow label="총구매액" value={receipt.totalAmount} />
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="text-body-2-med flex items-center justify-end gap-2 px-2 py-4 text-gray-700">
      <span>{label}</span>
      <div className="h-[14px] w-[1px] bg-gray-300" />
      <span>{Number(value).toLocaleString()}원</span>
    </div>
  );
}
