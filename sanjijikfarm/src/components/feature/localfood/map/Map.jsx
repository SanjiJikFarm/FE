import { useEffect, useRef, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useQuery } from '@tanstack/react-query';

import { getShopList } from '@/api/localfood/ShopController';

export default function LocalfoodMap({ handleMarkerClick, center, setCenter }) {
  const [fixedShopList, setfixedShopList] = useState([]);

  // 위치 요청을 단 한 번만 실행하기 위한 ref
  const didFetchLocation = useRef(false);
  const [userCenter, setUserCenter] = useState(null);

  const {
    data: shopList = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['shopList', userCenter],
    queryFn: async () => {
      const DEFAULT_CENTER = { lat: 37.2982, lng: 126.8373 };
      const target = userCenter ?? DEFAULT_CENTER;
      const res = await getShopList(target.lat, target.lng);
      return res;
    },
    enabled: !!userCenter,
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });

  // 서버 응답 좌표로 바로 사용
  useEffect(() => {
    if (shopList.length > 0) {
      // lat/lng가 없는 경우만 제외
      const valid = shopList.filter((shop) => shop.latitude && shop.longitude);
      setfixedShopList(valid);
    }
  }, [shopList]);

  // 유저 현재 위치 가져오기 (최초 실행시 1회만)
  useEffect(() => {
    if (didFetchLocation.current) return;
    didFetchLocation.current = true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const position = { lat: latitude, lng: longitude };
          setUserCenter(position);
          // 최초 한 번만 부모에 전달
          if (!center || (center.lat === 33.450701 && center.lng === 126.570667)) {
            setCenter(position);
          }
        },
        (err) => console.error('위치 가져오기 실패:', err),
      );
    }
  }, []);

  const mapCenter = center || userCenter || { lat: 37.2982, lng: 126.8373 };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading shop data.</div>;

  return (
    <Map // 지도를 표시할 Container
      center={mapCenter} // 유저 현재 위치 or 기본값
      style={{
        // 지도의 크기
        width: '100%',
        height: '100%',
      }}
      level={4} // 지도의 확대 레벨
      // 지도 드래그 시 center 갱신
      onCenterChanged={(map) => {
        const newCenter = map.getCenter();
        const lat = newCenter.getLat();
        const lng = newCenter.getLng();
        setCenter({ lat, lng }); // 부모에도 반영
      }}
    >
      {fixedShopList.map((shop) => (
        <MapMarker // 마커를 생성합니다
          key={`${shop.shopName}-${shop.latlng}`}
          position={{ lat: shop.latitude, lng: shop.longitude }} // 마커를 표시할 위치
          image={{
            src: '/icons/map-marker.svg',
            size: {
              width: 33,
              height: 33,
            },
          }}
          onClick={() => handleMarkerClick(shop)}
        />
      ))}
    </Map>
  );
}
