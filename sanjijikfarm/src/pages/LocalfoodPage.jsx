import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';

import FoundNearStoreButton from '@/components/feature/localfood/FoundNearStoreButton';
import LocalfoodModal from '@/components/feature/localfood/LocalfoodModal';
import LocalfoodMap from '@/components/feature/localfood/map/Map';
import SearchBar from '@/components/feature/localfood/SearchBar';

export default function LocalfoodPage() {
  const [filter, setFilter] = useState('거리순');

  const [openSheet, setOpenSheet] = useState(false);

  // 입력창에 보여줄 바로 반응하는 상태
  const [inputValue, setInputValue] = useState('');
  // 디바운싱 적용할 검색 트리거 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  // 디바운싱 적용
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchKeyword(value.trim());
    }, 500), // 500ms
    [],
  );
  // searchKeyword 변경 시마다 API 호출
  useEffect(() => {
    if (searchKeyword) {
      // TODO: API 호출 (filter마다 정렬 다르게)
      console.log('Searching for:', searchKeyword);
      setOpenSheet(true); // 검색되면 시트 열기
    }
  }, [searchKeyword]);

  // input 입력 시 호출됨
  const handleChange = (value) => {
    setInputValue(value); // 입력값은 즉시 반영
    debouncedSearch(value); // 검색 트리거는 디바운스 처리
  };

  // 엔터 누르면 바로 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      debouncedSearch.cancel(); // 디바운싱 취소
      setSearchKeyword(inputValue); // 즉시 검색
      setOpenSheet(true);
    }
  };

  // 검색 아이콘 클릭 시 검색 실행
  const handleSearch = () => {
    debouncedSearch.cancel();
    setSearchKeyword(inputValue);
    setOpenSheet(true);
  };

  // 필터 토글
  const toggleFilter = () => {
    setFilter((prev) => (prev === '거리순' ? '평점순' : '거리순'));
  };

  // 인근 매장 찾기 버튼 클릭
  const handleFindNearbyStores = () => {
    console.log('Finding nearby stores...');
    // TODO: 인근 매장 찾기 API 호출
  };

  const TEMP_LOCALFOOD_SHOP_LIST = [
    {
      id: 1,
      name: '김포로컬푸트 공동판매장',
      rating: 3.8,
      reviewCount: 37,
      address: '경기도 김포시',
      url: 'https://via.placeholder.com/',
    },
    {
      id: 2,
      name: '김포로컬푸트 공동판매장',
      rating: 3.8,
      reviewCount: 37,
      address: '경기도 김포시',
      url: 'https://via.placeholder.com/',
    },
    {
      id: 3,
      name: '김포로컬푸트 공동판매장',
      rating: 3.8,
      reviewCount: 37,
      address: '경기도 김포시',
      url: 'https://via.placeholder.com/',
    },
    {
      id: 4,
      name: '김포로컬푸트 공동판매장',
      rating: 3.8,
      reviewCount: 37,
      address: '경기도 김포시',
      url: 'https://via.placeholder.com/',
    },
    {
      id: 5,
      name: '김포로컬푸트 공동판매장',
      rating: 3.8,
      reviewCount: 37,
      address: '경기도 김포시',
      url: 'https://via.placeholder.com/',
    },
    {
      id: 6,
      name: '김포로컬푸트 공동판매장',
      rating: 3.8,
      reviewCount: 37,
      address: '경기도 김포시',
      url: 'https://via.placeholder.com/',
    },
    {
      id: 7,
      name: '김포로컬푸트 공동판매장',
      rating: 3.8,
      reviewCount: 37,
      address: '경기도 김포시',
      url: 'https://via.placeholder.com/',
    },
    {
      id: 8,
      name: '김포로컬푸트 공동판매장',
      rating: 3.8,
      reviewCount: 37,
      address: '경기도 김포시',
      url: 'https://via.placeholder.com/',
    },
    {
      id: 9,
      name: '김포로컬푸트 공동판매장',
      rating: 3.8,
      reviewCount: 37,
      address: '경기도 김포시',
      url: 'https://via.placeholder.com/',
    },
    {
      id: 10,
      name: '김포로컬푸트 공동판매장',
      rating: 3.8,
      reviewCount: 37,
      address: '경기도 김포시',
      url: 'https://via.placeholder.com/',
    },
  ];

  // TODO: 검색 결과로 API에서 받아온 데이터로 교체
  // (searchKeyword, filter 상태에 따라 API 호출)

  return (
    <div className="relative h-full w-full">
      <LocalfoodMap />
      <SearchBar
        keyword={inputValue}
        handleChange={handleChange}
        handleKeyDown={handleKeyDown}
        handleSearch={handleSearch}
      />
      <FoundNearStoreButton onClick={() => handleFindNearbyStores} />
      <LocalfoodModal
        open={openSheet}
        onClose={() => setOpenSheet(false)}
        shopList={TEMP_LOCALFOOD_SHOP_LIST}
        filter={filter}
        toggleFilter={toggleFilter}
      />
    </div>
  );
}
