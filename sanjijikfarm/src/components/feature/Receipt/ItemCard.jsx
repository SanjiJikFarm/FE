export default function ItemCard({ name, code, price, qty, total, rating, onClickReview }) {
  const hasRating = rating && rating > 0;

  return (
    <div className="mb-3 rounded-md bg-white p-4">
      {/* 상품명 */}
      <div className="text-body-1 mb-1 font-semibold">{name}</div>

      {/* 코드 + 가격 정보 */}
      <div className="text-body-2-med mb-2 flex justify-between text-gray-700">
        <span className="w-1/3">{price.toLocaleString()}원</span>
        <span className="w-1/3 text-center">{qty}개</span>
        <span className="w-1/3 text-right">{total.toLocaleString()}원</span>
      </div>

      {/* 별점 + 리뷰 버튼 */}
      <div className="mt-2 flex items-center justify-between">
        {hasRating ? <span className="text-main-brown text-body-2-med">★ {rating}</span> : <span />}

        <button
          onClick={onClickReview}
          className={`text-body-2 rounded px-3 py-1 font-semibold ${
            hasRating ? 'bg-pale-green text-black' : 'bg-main-green text-white hover:bg-green-600'
          }`}
        >
          {hasRating ? '리뷰 수정' : '리뷰 생성'}
        </button>
      </div>
    </div>
  );
}
