// src/utils/kakaoGeocoder.js
// Kakao 지도 API를 사용하여 주소를 좌표로 변환하는 유틸리티 함수

export default function getCoordsByAddress(address) {
  return new Promise((resolve, reject) => {
    if (!window.kakao || !window.kakao.maps) {
      reject(new Error('Kakao 지도 SDK가 로드되지 않았습니다.'));
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        resolve({
          lat: parseFloat(result[0].y),
          lng: parseFloat(result[0].x),
        });
      } else {
        reject(new Error('주소 변환 실패: ' + address));
      }
    });
  });
}
