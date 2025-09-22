import { useEffect } from 'react';

export default function Map() {
  useEffect(() => {
    if (!window.kakao) {
      console.error('카카오 SDK 로드 실패');
      return;
    }

    window.kakao.maps.load(() => {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };
      new window.kakao.maps.Map(container, options);
    });
  }, []);

  return <div id="map" className="h-full w-full" />;
}
