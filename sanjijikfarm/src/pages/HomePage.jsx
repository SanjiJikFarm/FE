import FoodSlider from '@/components/feature/home/FoodSlider';
import MainDecreaseAmount from '@/components/feature/home/MainDecreaseAmount';
import MainSlider from '@/components/feature/home/MainSlider';

export default function HomePage() {
  const TEMP_MAIN_IMAGES = [
    { url: 'https://via.placeholder.com/600x300', main: 'Main Title', sub: 'Sub Title goes here' },
    { url: 'https://via.placeholder.com/600x300', main: 'Main Title', sub: 'Sub Title goes here' },
    { url: 'https://via.placeholder.com/600x300', main: 'Main Title', sub: 'Sub Title goes here' },
  ];

  const month = new Date().getMonth();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <MainSlider images={TEMP_MAIN_IMAGES} />
      </div>
      <div className="flex flex-col items-center gap-4">
        <span className="text-heading-1 font-bold">{month + 1}월의 식재료 추천</span>
        <FoodSlider month={month + 1} />
      </div>
      <MainDecreaseAmount month={month + 1} />
    </div>
  );
}
