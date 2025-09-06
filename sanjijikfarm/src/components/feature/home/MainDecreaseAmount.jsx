import TreeIcon from '@/assets/icons/Tree.svg';

export default function MainDecreaseAmount({ amount }) {
  return (
    <div className="flex h-45 w-full p-4">
      <div className="border-main-green flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 p-7">
        <div className="flex items-center gap-3">
          <span className="text-heading-1 font-bold">이번주 탄소 절감량</span>
          <TreeIcon />
        </div>
        <div className="flex items-end gap-1">
          <span className="text-title-0 text- text-main-green font-extrabold">{amount}kg</span>
          <span className="text-heading-1 font-bold">CO2</span>
        </div>
      </div>
    </div>
  );
}
