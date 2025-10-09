import axios from 'axios';

import { axiosInstance, withErrorBoundary } from '../axios/axios';

// 서버리스 OCR API 연동
export const uploadReceiptToOCR = (imageBase64, username) =>
  withErrorBoundary(async () => {
    const res = await axios.post(
      'https://tqs0vow7qk.apigw.ntruss.com/custom/v1/ocr',
      { imageBase64, username },
      { headers: { 'Content-Type': 'application/json' } },
    );
    return res.data;
  });

// OCR 파싱 결과 post
export const saveReceipt = (parsedData, username) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.post(
      `/receipt?username=${username}`,
      {
        storeName: parsedData.storeName,
        date: parsedData.date,
        totalAmount: parsedData.totalAmount,
        itemList: parsedData.items,
        items: parsedData.items,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return res.data;
  });

// 영수증 요약 가져오기
export const getReceiptSummary = (receiptId) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get(`/receipt/${receiptId}/summary`);
    return res.data;
  });

// 개별 영수증 상세 정보 불러오기
export const getReceiptDetail = (username, receiptId) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get(`/receipt/receiptList?username=${username}`);
    const list = res.data;
    return list.find((r) => r.receiptId === Number(receiptId));
  });

// 영수증 전체 목록 조회
export const getReceiptList = (username) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get(`/receipt/receiptList?username=${username}`);
    return res.data;
  });
