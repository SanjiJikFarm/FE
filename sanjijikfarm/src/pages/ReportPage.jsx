import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import PurchaseHistory from '../components/feature/Report/PurchaseHistory';
import ReportSummary from '../components/feature/Report/ReportSummary';
import WeeklyBarChart from '../components/feature/Report/WeekyBarChart';

import {
  fetchWeeklyCarbon,
  fetchMonthlyCarbon,
  fetchProductCarbon,
} from '@/api/report/report';

export default function ReportPage() {
  const [targetDate, setTargetDate] = useState(dayjs()); 

  const month = targetDate.month() + 1 + ''; 
  const year = targetDate.year() + '';      


  const handlePrevMonth = () => {
    setTargetDate((prev) => prev.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    const next = targetDate.add(1, 'month');
    if (next.isAfter(dayjs(), 'month')) return; 
    setTargetDate(next);
  };  


  const {
    data: weeklyData = [],
    isLoading: isLoadingWeekly,
    isError: isErrorWeekly,
  } = useQuery({
    queryKey: ['weeklyCarbon', year, month],
    queryFn: () => fetchWeeklyCarbon(month),
    staleTime: 1000 * 60 * 5,
  });


  const {
    data: monthlyData = {},
    isLoading: isLoadingMonthly,
    isError: isErrorMonthly,
  } = useQuery({
    queryKey: ['monthlyCarbon', year, month],
    queryFn: () => fetchMonthlyCarbon(month),
    staleTime: 1000 * 60 * 5,
  });


  const {
    data: productData = [],
    isLoading: isLoadingProduct,
    isError: isErrorProduct,
  } = useQuery({
    queryKey: ['productCarbon', year, month],
    queryFn: () => fetchProductCarbon(month),
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = isLoadingWeekly || isLoadingMonthly || isLoadingProduct;
  const isError = isErrorWeekly || isErrorMonthly || isErrorProduct;

  const weeklyReduction = useMemo(() => {
    const weekMap = ['첫째주', '둘째주', '셋째주', '넷째주'];
    return weeklyData.map(({ week, savedKg }) => ({
      week: weekMap[week - 1] ?? `${week}주차`,
      value: savedKg,
    }));
  }, [weeklyData]);
  
  const purchaseHistory = useMemo(() => {
    const grouped = productData.reduce((acc, cur) => {
      const formattedDate = dayjs(cur.date).format('YYYY.MM.DD');
      const item = {
        name: cur.product,
        quantity: cur.quantity,
        carbonSaved: cur.savedKg,
        store: cur.store,
      };
      const existing = acc.find((entry) => entry.date === formattedDate);
      if (existing) {
        existing.items.push(item);
      } else {
        acc.push({ date: formattedDate, items: [item] });
      }
      return acc;
    }, []);
    return grouped;
  }, [productData]);

  if (isLoading)
    return <div className="text-center mt-10">로딩 중...</div>;
  if (isError)
    return <div className="text-center mt-10 text-red-500">데이터를 불러오지 못했습니다.</div>;

  return (
    <div className="scrollbar-hide h-screen max-h-[82vh] overflow-y-auto pt-[1.7rem]">
      <div className="flex justify-center items-center gap-4 mb-2">
        <button onClick={handlePrevMonth} className="text-xl px-2">
          {'<'}
        </button>
        <h2 className="text-title-3 font-bold">{`${year}년 ${month}월`}</h2>
        <button onClick={handleNextMonth} className="text-xl px-2">
          {'>'}
        </button>
      </div>

      <ReportSummary
  totalPurchases={monthlyData.purchaseCount || 0}
  totalReducedCO2={monthlyData.totalSavedKg || 0}
/>

      <WeeklyBarChart data={weeklyReduction} />

      <div className="mt-2 border-t border-gray-200">
        <PurchaseHistory history={purchaseHistory} />
      </div>
    </div>
  );
}
