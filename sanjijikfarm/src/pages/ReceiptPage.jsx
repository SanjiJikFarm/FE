import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/api/axios/store';
import { getReceiptList } from '@/api/receipt/receipt';

import ReceiptCard from '../components/feature/Receipt/ReceiptCard';

export default function ReceiptPage() {
  const navigate = useNavigate();
  const { username } = useAuthStore();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReceipts = async () => {
      try {
        const data = await getReceiptList(username);
        const mapped = data.map((r) => ({
          id: r.receiptId,
          storeName: r.storeName,
          price: r.totalAmount,
          date: r.date,
          rating: 0, // 추후 별점 추가
        }));

        setReceipts(mapped);
      } catch (err) {
        console.error('영수증 목록 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReceipts();
  }, [username]);

  return (
    <div className="relative mx-auto w-full max-w-md px-4 py-8">
      {loading ? (
        <p className="text-center text-gray-500">로딩 중...</p>
      ) : receipts.length === 0 ? (
        <p className="text-center text-gray-500">저장된 영수증이 없습니다.</p>
      ) : (
        receipts.map((r) => <ReceiptCard key={r.id} {...r} />)
      )}

      <button
        onClick={() => navigate('/receipt/upload')}
        className="bg-gray-1 text-gray-7 absolute top-125 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full text-3xl"
      >
        +
      </button>
    </div>
  );
}
