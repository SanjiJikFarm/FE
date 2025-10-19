import 'swiper/css';
import 'swiper/css/pagination';

import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import SLIDES from '@/lib/mock/HomeSliderMockData.json';

export default function MainSlider() {
  return (
    <Swiper
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      modules={[Pagination, Autoplay]}
    >
      {SLIDES.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="bg-pale-green relative h-52 w-full">
            {/* 이미지 */}
            <img src={slide.url} className="h-full w-full object-cover" alt={`Main Slide ${index + 1}`} />

            {/* 아래 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* 텍스트 (왼쪽 아래) */}
            <div className="absolute bottom-3 left-4 text-white">
              <h2 className="text-lg font-bold">{slide.title}</h2>
              <p className="text-sm opacity-80">{slide.subtitle}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
