import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuthStore } from '@/api/axios/store';
import { getReceiptDetail } from '@/api/receipt/receipt';

import ItemCard from '../components/feature/Receipt/ItemCard';
import ReviewModal from '../components/feature/Receipt/ReviewModal';

export default function ReceiptDetail() {
  const { id } = useParams();
  const { username } = useAuthStore.getState();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const data = await getReceiptDetail(username, id);

        setReceipt(data);
      } catch (err) {
        console.error('상세 영수증 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id, username]);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsEditMode(!!item.rating);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  if (loading) return <p className="py-10 text-center">로딩 중...</p>;
  if (!receipt) return <p className="py-10 text-center">영수증을 불러오지 못했습니다.</p>;

  return (
    <div className="h-screen overflow-hidden bg-white">
      {isModalOpen && <ReviewModal item={selectedItem} onClose={handleCloseModal} isEditMode={isEditMode} />}

      <div className="scrollbar-hide max-h-[calc(100vh-120px)] overflow-y-auto px-4 py-3">
        <div className="mb-6 border-b border-gray-300 py-3 text-sm text-gray-800">
          <p className="text-body-2-med text-center text-gray-600">{receipt.date}</p>
          <div className="pb-4">
            <p className="text-title-3 text-center font-bold">{receipt.storeName}</p>
          </div>

          {/* 기타 정보는 필요시 추가 */}
        </div>

        <div className="mb-8 space-y-3">
          {receipt.itemList.map((item, i) => (
            <ItemCard
              key={i}
              {...item}
              onClickReview={() =>
                handleOpenModal({
                  ...item,
                  reviewText: item.rating ? '좋았어요! 신선하고 맛있었습니다.' : '',
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
