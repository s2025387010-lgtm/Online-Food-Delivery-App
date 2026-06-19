import { useCart } from '../context/CartContext'

export default function FoodCard({ food }) {
  const { addItem, items, updateQuantity } = useCart()
  const cartItem = items.find(i => i.id === food.id)

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {food.image ? (
        <img
          src={`http://localhost:5000${food.image}`}
          alt={food.name}
          className="w-full h-44 object-cover"
        />
      ) : (
        <div className="w-full h-44 bg-orange-50 flex items-center justify-center text-6xl select-none">
          🍽️
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="font-semibold text-gray-800 leading-snug">{food.name}</h3>
          <span className="text-orange-500 font-bold whitespace-nowrap">${food.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-400 mb-4 flex-1 leading-relaxed">{food.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full font-medium">
            {food.category}
          </span>

          {cartItem ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(food.id, cartItem.quantity - 1)}
                className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-lg hover:bg-orange-200 transition flex items-center justify-center"
              >
                −
              </button>
              <span className="w-6 text-center font-bold text-gray-800">{cartItem.quantity}</span>
              <button
                onClick={() => addItem(food)}
                className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-lg hover:bg-orange-600 transition flex items-center justify-center"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addItem(food)}
              className="bg-orange-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-orange-600 transition font-semibold"
            >
              + Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
