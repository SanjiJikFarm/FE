import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getNearbyShops, getShopList, searchShops } from '@/api/localfood/ShopController';
import FoundNearStoreButton from '@/components/feature/localfood/FoundNearStoreButton';
import LocalfoodModal from '@/components/feature/localfood/LocalfoodModal';
import LocalfoodMap from '@/components/feature/localfood/map/Map';
import SearchBar from '@/components/feature/localfood/SearchBar';

export default function LocalfoodPage() {
  // 필터 토글 관리
  const [filter, setFilter] = useState('평점순');

  // 마커 클릭 시 선택된 매장
  const [selectedShop, setSelectedShop] = useState(null);
  // api 실행 결과 list
  const [shopList, setShopList] = useState([]);

  // 지도 센터 좌표
  const DEFAULT_CENTER = { lat: 33.450701, lng: 126.570667 };
  const [center, setCenter] = useState(DEFAULT_CENTER); // 기본값: 제주 좌표

  const [openSheet, setOpenSheet] = useState(false);

  // 입력창에 보여줄 바로 반응하는 상태
  const [inputValue, setInputValue] = useState('');

  // input 입력 시 호출됨
  const handleChange = (value) => {
    setInputValue(value); // 입력값은 즉시 반영
  };

  // 공통 필터 및 좌표값 세팅 (파라미터용)
  const sortParam = filter === '거리순' ? 'distance' : 'rating';
  const lat = center?.lat ?? DEFAULT_CENTER.lat;
  const lng = center?.lng ?? DEFAULT_CENTER.lng;

  // 매장 검색/검색어 비어있을시 전체매장 받을 공통 쿼리 훅
  const {
    data: searchedShopList = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['shops', inputValue, lat, lng, sortParam], // 검색 keyword에 따라 캐시 분리
    queryFn: async () => {
      // 백엔드에 sort, lat, lng 파라미터 전달
      const results =
        inputValue.trim() === ''
          ? await getShopList(lat, lng, { sort: sortParam })
          : await searchShops(inputValue, lat, lng, { sort: sortParam });

      // 좌표 변환 처리 필요 없음
      // 유효한 매장만 필터링 (좌표값 없는 경우 제외)
      const valid = results.filter((shop) => shop.latitude && shop.longitude);

      return valid;
    },
    enabled: false, // 검색 버튼 클릭 시 실행
    retry: false,
  });

  // 인근 매장 찾기 쿼리 훅
  const {
    data: nearbyShopList = [],
    isLoading: isNearbyLoading,
    isError: isNearbyError,
    refetch: refetchNearby,
  } = useQuery({
    queryKey: ['nearbyShops', lat, lng, sortParam],
    queryFn: async () => {
      // 백엔드에 sort, lat, lng 파라미터 전달
      const results = await getNearbyShops(lat, lng, { sort: sortParam });

      // 유효한 매장만 필터링 (좌표값 없는 경우 제외)
      const valid = results.filter((shop) => shop.latitude && shop.longitude);

      return valid;
    },
    enabled: false, // 버튼 클릭 시 실행
    retry: false,
  });

  // 검색 아이콘 클릭 시 검색 실행
  const handleSearch = async () => {
    const { data } = await refetch();

    if (data && data.length > 0) {
      setShopList(data);
      setOpenSheet(true);
      setCenter({ lat: data[0].latitude, lng: data[0].longitude });
    }
  };

  // 엔터 누르면 바로 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 필터 토글
  const toggleFilter = async () => {
    setFilter((prev) => (prev === '거리순' ? '평점순' : '거리순'));

    if (openSheet) {
      if (nearbyShopList.length > 0) {
        const { data } = await refetchNearby();
        if (data) {
          setSelectedShop(null);
        }
      } else if (searchedShopList.length > 0) {
        const { data } = await refetch();
        if (data) {
          setSelectedShop(null);
        }
      }
    }
  };

  // 인근 매장 찾기 버튼 클릭
  const handleFindNearbyStores = async () => {
    const { data } = await refetchNearby();

    if (data && data.length > 0) {
      setShopList(data);
      setOpenSheet(true);
      setCenter({ lat: data[0].latitude, lng: data[0].longitude });
    }
  };

  // 마커 클릭 이벤트
  const handleMarkerClick = (shop) => {
    setSelectedShop(shop); // 선택한 매장 정보 저장
    setOpenSheet(true); // 모달 열기
  };

  if (isLoading || isNearbyLoading || isNearbyError || isError) return null;

  return (
    <div className="relative h-full w-full">
      <LocalfoodMap handleMarkerClick={handleMarkerClick} center={center} setCenter={setCenter} />
      <SearchBar
        keyword={inputValue}
        handleChange={handleChange}
        handleKeyDown={handleKeyDown}
        handleSearch={handleSearch}
      />
      <FoundNearStoreButton onClick={() => handleFindNearbyStores()} />
      <LocalfoodModal
        open={openSheet}
        onClose={() => {
          setOpenSheet(false);
          setFilter('평점순');
          setSelectedShop(null);
          setShopList([]);
        }}
        shopList={selectedShop ? [selectedShop] : shopList}
        filter={filter}
        toggleFilter={toggleFilter}
      />
    </div>
  );
}
