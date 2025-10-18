import ReviewStarIcon from '@/assets/icons/review-star.svg';
import DateFormatter from '@/lib/utils/DateFormatter';

export default function ReviewCard({ review }) {
  return (
    <div className="border-gray-1 flex w-full flex-col gap-3 border-b p-4">
      <div className="flex flex-col gap-1">
        <span className="text-body-1 pl-0.5 font-bold">{review.productName}</span>
        <span className="text-gray-7 text-body-2-med pl-0.5 font-medium">{DateFormatter(review.createdAt)}</span>
        <div className="flex items-center pb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <ReviewStarIcon key={i} className={`${i < review.rating ? 'text-main-green' : 'text-gray-3'}`} />
          ))}
        </div>
        <span className="bg-pale-green text-body-1 scrollbar-hide max-h-25 overflow-scroll p-2.5 font-medium">
          {review.text}
        </span>
      </div>
      <div className="h-20 w-20 flex-shrink-0">
        <img className="bg-pale-green h-full w-full object-cover" src={review.imageUrl} alt={`review img`} />
      </div>
    </div>
  );
}
