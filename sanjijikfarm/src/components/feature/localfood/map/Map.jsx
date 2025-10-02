import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useQuery } from '@tanstack/react-query';

import { getShopList } from '@/api/localfood/ShopController';
import KakaoGeocoder from '@/lib/utils/KakaoGeocoder';

export default function LocalfoodMap({ handleMarkerClick, center, setCenter }) {
  const [fixedShopList, setfixedShopList] = useState([]);

  const {
    data: shopList = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['shopList'],
    queryFn: () => getShopList(),
  });

  const TEMPLIST = [
    {
      shopId: 1,
      shopName: '매장1',
      shopImage: '',
      address: '제주특별자치도 제주시 첨단로 242',
      averageRating: 4.5,
      reviewCount: 120,
    },
    {
      shopId: 2,
      shopName: '매장2',
      shopImage: '',
      address: '제주특별자치도 제주시 아라일동 1',
      averageRating: 4.2,
      reviewCount: 85,
    },
    {
      shopId: 3,
      shopName: '매장3',
      shopImage: '',
      address: '제주특별자치도 제주시 산천단동3길 2',
      averageRating: 4.8,
      reviewCount: 200,
    },
  ];

  useEffect(() => {
    if (TEMPLIST.length > 0) {
      Promise.all(
        TEMPLIST.map(async (shop) => {
          // 주소로 좌표 변환
          const coords = await KakaoGeocoder(shop.address);
          console.log(coords);
          return {
            shopId: shop.shopId,
            shopName: shop.shopName,
            shopImage: shop.shopImage,
            address: shop.address,
            latlng: coords,
            averageRating: shop.averageRating,
            reviewCount: shop.reviewCount,
          };
        }),
        // 모든 주소 변환이 완료되면 fixedShopList 상태 업데이트 (필요 없는 값은 필터링: null 방지)
      ).then((results) => setfixedShopList(results.filter(Boolean)));
    }
  }, [shopList]);

  // 유저 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCenter({ lat: latitude, lng: longitude }); // 현재 위치로 지도 중심 변경
        },
        (err) => {
          console.error('위치 가져오기 실패:', err);
          // 실패 시 기본 좌표 그대로 둠
        },
      );
    }
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading shop data.</div>;

  return (
    <Map // 지도를 표시할 Container
      center={center} // 유저 현재 위치 or 기본값
      style={{
        // 지도의 크기
        width: '100%',
        height: '100%',
      }}
      level={4} // 지도의 확대 레벨
    >
      {fixedShopList.map((shop) => (
        <MapMarker // 마커를 생성합니다
          key={`${shop.title}-${shop.latlng}`}
          position={shop.latlng} // 마커를 표시할 위치
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
