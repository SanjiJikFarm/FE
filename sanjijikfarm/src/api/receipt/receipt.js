import { axiosInstance, withErrorBoundary } from '../axios/axios';

// 서버리스 OCR API 연동
export const uploadReceiptToOCR = (imageBase64, username) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.post(
      'https://tqs0vow7qk.apigw.ntruss.com/custom/v1/ocr',
      { imageBase64, username },
      { headers: { 'Content-Type': 'application/json' } },
    );
    return res.data;
  });
