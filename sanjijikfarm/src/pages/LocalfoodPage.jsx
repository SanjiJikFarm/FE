import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getShopList, searchShops } from '@/api/localfood/ShopController';
import FoundNearStoreButton from '@/components/feature/localfood/FoundNearStoreButton';
import LocalfoodModal from '@/components/feature/localfood/LocalfoodModal';
import LocalfoodMap from '@/components/feature/localfood/map/Map';
import SearchBar from '@/components/feature/localfood/SearchBar';
import getCoordsByAddress from '@/lib/utils/KakaoGeocoder';

export default function LocalfoodPage() {
  // 필터 토글 관리
  const [filter, setFilter] = useState('거리순');

  // 마커 클릭 시 선택된 매장
  const [selectedShop, setSelectedShop] = useState(null);

  // 지도 센터 좌표
  const [center, setCenter] = useState({ lat: 33.450701, lng: 126.570667 }); // 기본값: 제주 좌표

  const [openSheet, setOpenSheet] = useState(false);

  // 입력창에 보여줄 바로 반응하는 상태
  const [inputValue, setInputValue] = useState('');

  // input 입력 시 호출됨
  const handleChange = (value) => {
    setInputValue(value); // 입력값은 즉시 반영
  };

  // 매장 검색/검색어 비어있을시 전체매장 받을 공통 쿼리 훅
  const {
    data: searchedShopList = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['shops', inputValue], // 검색 keyword에 따라 캐시 분리
    queryFn: async () => {
      const results = inputValue.trim() === '' ? await getShopList() : await searchShops(inputValue);

      console.log(results);
      // 좌표 변환 처리
      const geocoded = await Promise.all(
        results.map(async (shop) => {
          try {
            const coords = await getCoordsByAddress(shop.address);
            return { ...shop, latlng: coords };
          } catch {
            return null;
          }
        }),
      );

      // 유효한 매장만 필터링
      const valid = geocoded.filter(Boolean);
      if (valid.length > 0 && valid[0].latlng) {
        setCenter(valid[0].latlng);
      }
      return results;
    },
    enabled: false, // 검색 버튼 클릭 시 실행
    retry: false,
  });

  // 검색 아이콘 클릭 시 검색 실행
  const handleSearch = () => {
    refetch(); // 데이터 새로 호출
    setOpenSheet(true);
  };

  // 엔터 누르면 바로 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 필터 토글
  const toggleFilter = () => {
    setFilter((prev) => (prev === '거리순' ? '평점순' : '거리순'));
  };

  // 인근 매장 찾기 버튼 클릭
  const handleFindNearbyStores = () => {
    /*
    try {
     const response = await getNearbyShopsAPI(); // TODO: 실제 API
     setShopList(response);

    if (response.length > 0) {
      setCenter({ lat: response[0].lat, lng: response[0].lng }); // 지도 중심 이동
    }
  } catch (e) {
    console.error(e);
  }*/
  };

  // 마커 클릭 이벤트
  const handleMarkerClick = (shop) => {
    setSelectedShop(shop); // 선택한 매장 정보 저장
    console.log(shop);
    setOpenSheet(true); // 모달 열기
  };

  if (isLoading || isError) return null;

  return (
    <div className="relative h-full w-full">
      <LocalfoodMap handleMarkerClick={handleMarkerClick} center={center} setCenter={setCenter} />
      <SearchBar
        keyword={inputValue}
        handleChange={handleChange}
        handleKeyDown={handleKeyDown}
        handleSearch={handleSearch}
      />
      <FoundNearStoreButton onClick={() => handleFindNearbyStores} />
      <LocalfoodModal
        open={openSheet}
        onClose={() => {
          setOpenSheet(false);
          setSelectedShop(null);
        }}
        shopList={selectedShop ? [selectedShop] : searchedShopList.length > 0 ? searchedShopList : []}
        filter={filter}
        toggleFilter={toggleFilter}
      />
    </div>
  );
}
