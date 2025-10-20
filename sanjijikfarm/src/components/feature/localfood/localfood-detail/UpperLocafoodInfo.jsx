import StarIcon from '@/assets/icons/star.svg';

export default function UpperLocafoodInfo({ shop }) {
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="h-33 w-full">
        <img className="bg-pale-green h-full w-full object-cover" src={shop.shopImage} alt="localfood detail img" />
      </div>
      <div className="flex w-full flex-col gap-2 p-3">
        <span className="text-title-3 font-bold">{shop.shopName}</span>
        <div className="flex items-center gap-0.5">
          <StarIcon />
          <span className="text-main-brown text-body-2-med font-medium">{shop.avgRating?.toFixed(1)}</span>
        </div>
        <span className="text-body-2-med text-gray-7 font-medium">주소 | {shop.address}</span>
        {/* <span className="text-body-2-med text-gray-7 font-medium">전화 | {shop.phone}</span> */}
      </div>
    </div>
  );
}
