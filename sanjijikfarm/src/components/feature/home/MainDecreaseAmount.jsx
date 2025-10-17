import { useQuery } from '@tanstack/react-query';

import { getMonthlyCarbonAmount } from '@/api/home/CarbonController';
import TreeIcon from '@/assets/icons/tree.svg';

export default function MainDecreaseAmount({ month }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['monthlyReducedAmount', month],
    queryFn: () => getMonthlyCarbonAmount(month),
    enabled: !!month,
    staleTime: 1000 * 60,
  });

  if (isLoading) {
    return (
      <div className="flex h-45 w-full p-4">
        <div className="border-main-green flex h-full w-full animate-pulse flex-col items-center justify-center gap-2 rounded-3xl border-2 bg-gray-100 p-7">
          <div className="flex items-center gap-3">
            <div className="bg-gray-3 h-6 w-40 rounded-md"></div>
            <div className="bg-gray-3 h-6 w-6 rounded-full"></div>
          </div>
          <div className="flex items-end gap-1">
            <div className="bg-gray-3 h-10 w-24 rounded-md"></div>
            <div className="bg-gray-3 h-8 w-12 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div>error</div>;

  return (
    <div className="flex h-45 w-full p-4">
      <div className="border-main-green flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 p-7">
        <div className="flex items-center gap-3">
          <span className="text-heading-1 font-bold">이번달 탄소 절감량</span>
          <TreeIcon />
        </div>
        <div className="flex items-end gap-1">
          <span className="text-title-0 text- text-main-green font-extrabold">{data.totalSavedKg}kg</span>
          <span className="text-heading-1 font-bold">CO2</span>
        </div>
      </div>
    </div>
  );
}
