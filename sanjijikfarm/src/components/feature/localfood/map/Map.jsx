import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useNavigate } from 'react-router-dom';

export default function LocalfoodMap() {
  const navigate = useNavigate();

  const onMarkerClick = (id) => {
    navigate(`/localfood/${id}`);
  };

  const TEMP_SHOP_LIST = [
    {
      id: 1,
      title: '카카오',
      latlng: { lat: 33.450705, lng: 126.570677 },
    },
    {
      id: 2,
      title: '생태연못',
      latlng: { lat: 33.450936, lng: 126.569477 },
    },
    {
      id: 3,
      title: '텃밭',
      latlng: { lat: 33.450879, lng: 126.56994 },
    },
    {
      id: 4,
      title: '근린공원',
      latlng: { lat: 33.451393, lng: 126.570738 },
    },
  ];

  return (
    <Map // 지도를 표시할 Container
      center={{
        // 지도의 중심좌표
        lat: 33.450701,
        lng: 126.570667,
      }}
      style={{
        // 지도의 크기
        width: '100%',
        height: '100%',
      }}
      level={4} // 지도의 확대 레벨
    >
      {TEMP_SHOP_LIST.map((position) => (
        <MapMarker // 마커를 생성합니다
          key={`${position.title}-${position.latlng}`}
          position={position.latlng} // 마커를 표시할 위치
          image={{
            src: '/icons/map-marker.svg',
            size: {
              width: 33,
              height: 33,
            },
          }}
          onClick={() => onMarkerClick(position.id)}
        />
      ))}
    </Map>
  );
}
