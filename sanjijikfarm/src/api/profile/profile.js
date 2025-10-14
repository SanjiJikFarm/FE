import { axiosInstance, withErrorBoundary } from '../axios/axios';

// presigned URL 발급 요청
export const getPresignedUrl = (filename, contentType) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.get('/profile/upload-url', {
      params: { filename, contentType },
    });
    return res.data;
  });

// S3에 프로필 이미지 업로드
export const uploadImageToS3 = (presignedUrl, file) =>
  withErrorBoundary(async () => {
    await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
  });

// 프로필 이미지 최초등록
export const saveUserProfileImage = (key) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.post('/profile/save', null, {
      params: { key },
    });
    return res.data;
  });

// 프로필 이미지 수정
export const updateUserProfileImage = (newKey) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.post('/profile/update', null, {
      params: { newKey },
    });
    return res.data;
  });

