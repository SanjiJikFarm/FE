import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/api/axios/store';
import { getReceiptList } from '@/api/receipt/receipt';
import { fetchReviewList } from '@/api/review/review';
import ItemCard from '@/components/feature/Receipt/ItemCard';
import ReviewModal from '@/components/feature/Receipt/ReviewModal';

function groupReceiptsByDate(receipts) {
  const grouped = {};

  receipts.forEach((receipt) => {
    const { date, storeName, itemList } = receipt;

    if (!grouped[date]) {
      grouped[date] = [];
    }

    const items = itemList.map((item) => ({
      name: storeName,
      price: parseInt(item.price),
      quantity: parseInt(item.qty),
      total: parseInt(item.total),
      rating: item.rating,
      reviewId: item.reviewId ?? null,
      reviewText: item.reviewText ?? '',
      imageUrl: item.imageUrl ?? null,
      productId: item.productId,
    }));

    grouped[date].push(...items);
  });

  return Object.entries(grouped)
    .map(([date, items]) => ({ date, items }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default function MyPurchases() {
  const { username } = useAuthStore.getState();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    data: receiptList,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['receiptListWithReviews', username],
    queryFn: async () => {
      const [receipts, reviews] = await Promise.all([getReceiptList(username), fetchReviewList()]);

      return receipts.map((receipt) => {
        const newItemList = receipt.itemList.map((item) => {
          const matched = reviews.find((r) => r.productId === item.productId);
          return {
            ...item,
            rating: matched?.rating ?? 0,
            reviewId: matched?.reviewId ?? null,
            reviewText: matched?.text ?? '',
            imageUrl: matched?.imageUrl ?? null,
          };
        });

        return {
          ...receipt,
          itemList: newItemList,
        };
      });
    },
  });

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsEditMode(!!item.reviewId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  if (isLoading) return <div className="py-10 text-center">로딩 중...</div>;
  if (isError || !receiptList) return <div className="py-10 text-center">오류 발생</div>;

  const groupedData = groupReceiptsByDate(receiptList);

  return (
    <div className="relative h-screen bg-white">
      {isModalOpen && selectedItem && (
        <ReviewModal
          item={selectedItem}
          isEditMode={isEditMode}
          onClose={async () => {
            await refetch();
            handleCloseModal();
          }}
        />
      )}

      <div className="scrollbar-hide overflow-y-auto px-5 pt-6 pb-6" style={{ height: 'calc(100vh - 120px)' }}>
        {groupedData.map((group, groupIdx) => (
          <div key={groupIdx} className={`pt-6 ${groupIdx > 0 ? 'mt-4 border-t border-gray-200' : ''}`}>
            <h2 className="text-title-3 mb-4 ml-2 font-bold">{group.date}</h2>
            <div className="space-y-4">
              {group.items.map((item, idx) => (
                <ItemCard
                  key={idx}
                  name={item.name}
                  price={item.price}
                  qty={item.quantity}
                  total={item.total}
                  rating={item.rating}
                  onClickReview={() => handleOpenModal(item)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
