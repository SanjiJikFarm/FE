import { useState } from 'react';

import { getShopList, searchShops } from '@/api/localfood/ShopController';
import FoundNearStoreButton from '@/components/feature/localfood/FoundNearStoreButton';
import LocalfoodModal from '@/components/feature/localfood/LocalfoodModal';
import LocalfoodMap from '@/components/feature/localfood/map/Map';
import SearchBar from '@/components/feature/localfood/SearchBar';
import getCoordsByAddress from '@/lib/utils/KakaoGeocoder';

export default function LocalfoodPage() {
  const [filter, setFilter] = useState('거리순');

  // 모달에 표시할 리스트
  const [shopList, setShopList] = useState([]);

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

  // 검색 아이콘 클릭 시 검색 실행
  const handleSearch = async () => {
    const keyword = inputValue.trim();

    try {
      const results = keyword === '' ? await getShopList() : await searchShops(keyword);

      // 센터 좌표 변경을 위해 좌표 변환
      const geocodedResults = await Promise.all(
        results.map(async (shop) => {
          try {
            const coords = await getCoordsByAddress(shop.address);
            return {
              ...shop,
              latlng: coords,
            };
          } catch (e) {
            console.warn('주소 변환 실패:', shop.address, e);
            return null; // 실패한 경우 제외
          }
        }),
      );
      // 변환 성공한 매장만 필터링
      const validShops = geocodedResults.filter(Boolean);

      setShopList(results || []); // 검색 결과가 없으면 빈 배열
      setOpenSheet(true);

      // 첫 번째 성공 매장으로 지도 중심 이동
      if (validShops.length > 0 && validShops[0].latlng) {
        setCenter(validShops[0].latlng);
      }
    } catch (e) {
      console.error(e, '매장 검색 실패');
    }
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
    setOpenSheet(true); // 모달 열기
  };

  // TODO: 검색 결과로 API에서 받아온 데이터로 교체
  // (searchKeyword, filter 상태에 따라 API 호출)

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
        shopList={selectedShop ? [selectedShop] : shopList.length > 0 ? shopList : []}
        filter={filter}
        toggleFilter={toggleFilter}
      />
    </div>
  );
}
