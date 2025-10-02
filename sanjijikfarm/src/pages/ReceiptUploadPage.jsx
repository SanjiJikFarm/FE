import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/api/axios/store';
import { saveReceipt, uploadReceiptToOCR } from '@/api/receipt/receipt';

export default function ReceiptUploadPage() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!image) {
      alert('이미지를 먼저 선택해주세요!');
      return;
    }

    setLoading(true);
    try {
      const base64Image = image.split(',')[1];
      const { username } = useAuthStore.getState();

      // 서버리스 OCR 호출
      const parsed = await uploadReceiptToOCR(base64Image, username);

      // 백엔드에 저장
      const saved = await saveReceipt(parsed, username);

      // 로컬에 receiptId 저장
      const prev = JSON.parse(localStorage.getItem('receiptIds') || '[]');
      const updated = [...prev, saved.receiptId];
      localStorage.setItem('receiptIds', JSON.stringify(updated));

      alert('영수증이 성공적으로 저장되었습니다!');

      // 상세 페이지로 이동
      navigate(`/receipt/${saved.receiptId}`);
    } catch (err) {
      console.error('영수증 업로드/저장 실패:', err);
      alert(err.message || '영수증 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="text-title-3 mb-5 text-center font-bold">영수증 업로드</h1>

      {/* 이미지 업로드 박스 */}
      <div className="relative mx-auto mb-6 flex h-[400px] w-[230px] items-center justify-center overflow-hidden rounded-md border-2 border-dashed bg-gray-100">
        {image ? (
          <>
            <img src={image} alt="영수증 미리보기" className="h-full w-full object-contain" />
            <label className="text-body-2 absolute right-2 bottom-2 cursor-pointer rounded bg-white px-3 py-1 text-black transition hover:opacity-90">
              변경
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center text-sm text-gray-400">
            <span>사진 업로드</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>

      {/* 업로드 버튼 or 로딩 메시지 */}
      {loading ? (
        <p className="text-center text-gray-600">영수증을 분석 중입니다...</p>
      ) : (
        <button
          onClick={handleUpload}
          className="bg-main-green mx-auto block w-[80%] rounded-md py-2 text-white transition hover:bg-green-600"
        >
          업로드 하기
        </button>
      )}
    </div>
  );
}
