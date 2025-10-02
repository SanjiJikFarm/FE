import { NavLink } from 'react-router-dom';

import StarIcon from '@/assets/icons/star.svg';

export default function LocalfoodContent({ shop }) {
  return (
    <NavLink to={'/localfood/' + shop.shopId}>
      <div className="border-gray-1 flex w-full cursor-pointer justify-between border-b bg-white p-3">
        {/* Left Section */}
        <div className="flex flex-col gap-2">
          <span className="text-body-1 font-bold">{shop.shopName}</span>
          <div className="text-body-2 flex items-center justify-center gap-3.5">
            <span className="text-main-brown flex items-center gap-1">
              <StarIcon /> {shop.averageRating?.toFixed(1)}
            </span>
            <span className="text-gray-7">리뷰 {shop.reviewCount}</span>
            <span className="text-gray-7 truncate">{shop.address}</span>
          </div>
        </div>
        {/* Right Section - Image */}
        <div className="bg-pale-green h-20 w-20">
          <img src={shop.shopImage} className="h-full w-full object-cover" alt="shop list img" />
        </div>
      </div>
    </NavLink>
  );
}
