import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon, PlusIcon, MinusIcon, ArrowLeftIcon } from 'lucide-react';
export function Cart() {
  const navigate = useNavigate();
  // Mock cart items
  const [cartItems, setCartItems] = useState([{
    id: '1',
    name: 'Classic Cheeseburger',
    price: 12.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    restaurant: 'Burger Palace'
  }, {
    id: '2',
    name: 'Cheese Fries',
    price: 5.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    restaurant: 'Burger Palace'
  }]);
  const handleUpdateQuantity = (id: string, change: number) => {
    setCartItems(cartItems.map(item => item.id === id ? {
      ...item,
      quantity: Math.max(1, item.quantity + change)
    } : item));
  };
  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 2.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;
  return <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 ml-4">Your Cart</h1>
      </div>
      {cartItems.length === 0 ? <div className="text-center py-12">
          <div className="text-gray-500 mb-4">Your cart is empty</div>
          <Link to="/restaurants" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Browse Restaurants
          </Link>
        </div> : <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul role="list" className="divide-y divide-gray-200">
                {cartItems.map(item => <li key={item.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16">
                        <img className="h-16 w-16 rounded-md object-cover" src={item.image} alt={item.name} />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {item.restaurant}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded-md">
                            <button onClick={() => handleUpdateQuantity(item.id, -1)} className="p-1 text-gray-500 focus:outline-none focus:text-gray-600">
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="px-2 text-gray-700">
                              {item.quantity}
                            </span>
                            <button onClick={() => handleUpdateQuantity(item.id, 1)} className="p-1 text-gray-500 focus:outline-none focus:text-gray-600">
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>
                          <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>)}
              </ul>
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="text-gray-900">
                    ${deliveryFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6">
                <Link to="/order-confirmation" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Proceed to Checkout
                </Link>
              </div>
              <div className="mt-4">
                <Link to="/restaurants" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>}
    </div>;
}