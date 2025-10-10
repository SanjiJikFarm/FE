export default function PurchaseHistory({ history }) {
  return (
    <div className="mt-3 px-4">
      {history.map(({ date, items }, idx) => (
        <div key={idx} className="mb-6">
          <p className="text-body-2-med">{date}</p>
          {items.map((item, i) => (
            <div
              key={i}
              className="mb-2 flex items-center justify-between px-3 py-3"
            >
              <div>
                <p className="text-body-2-med">{item.store}</p>
                <p className="text-title-3 font-bold">{item.name}</p>
              </div>
              <p className="text-main-green text-title-3 font-bold">
                {item.carbonSaved?.toFixed(3)}kg
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
