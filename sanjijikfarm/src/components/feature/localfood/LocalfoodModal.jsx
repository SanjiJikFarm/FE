import FilterIcon from '@/assets/icons/filter.svg';
import LocalfoodEmptyCard from '@/components/common/empty/LocalfoodEmptyCard';
import BottomSheet from '@/components/common/util/BottomSheet';
import LocalfoodContent from '@/components/feature/localfood/LocalfoodContent';

export default function LocalfoodModal({ open, onClose, shopList, filter, toggleFilter }) {
  const hasShops = Array.isArray(shopList) && shopList.length > 0;

  return (
    <BottomSheet open={open} onClose={onClose} title="로컬푸드 판매처" snapPoints={[0.92, 0.6, 0]}>
      <div className="relative flex w-full flex-col pb-22">
        <div className="sticky top-[-8px] z-10 bg-white">
          <div className="flex items-center justify-end">
            <button
              className="text-body-2-med text-gray-7 flex cursor-pointer items-center gap-1 rounded-md px-3 py-1 font-medium"
              onClick={toggleFilter}
            >
              <span>{filter}</span>
              <FilterIcon />
            </button>
          </div>
        </div>
        {hasShops ? (
          shopList.map((shop, index) => <LocalfoodContent key={`shop-list-${index}`} shop={shop} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <LocalfoodEmptyCard text="검색 결과가 없습니다." />
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
