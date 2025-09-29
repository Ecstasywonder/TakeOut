import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, MapPinIcon, CreditCardIcon, TruckIcon } from 'lucide-react';
export function OrderConfirmation() {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const handlePlaceOrder = () => {
    if (selectedPaymentMethod) {
      setOrderPlaced(true);
    }
  };
  if (orderPlaced) {
    return <div className="max-w-lg mx-auto text-center py-12">
        <div className="rounded-full bg-green-100 p-3 mx-auto w-16 h-16 flex items-center justify-center">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          Order Placed Successfully!
        </h2>
        <p className="mt-2 text-gray-600">
          Your order has been placed and is being prepared. You can track your
          order status below.
        </p>
        <div className="mt-8 space-y-4">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
            <div className="flex justify-between">
              <span className="font-medium">Order #:</span>
              <span>ORD-12345</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-medium">Estimated Delivery:</span>
              <span>30-40 minutes</span>
            </div>
          </div>
          <Link to="/orders/12345/tracking" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Track Order
          </Link>
          <Link to="/restaurants" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Continue Shopping
          </Link>
        </div>
      </div>;
  }
  return <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
            Delivery Address
          </h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input type="text" name="address" id="address" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
                Apt, Suite, etc.
              </label>
              <input type="text" name="apartment" id="apartment" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input type="text" name="city" id="city" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input type="text" name="postal-code" id="postal-code" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div className="col-span-6">
              <label htmlFor="delivery-instructions" className="block text-sm font-medium text-gray-700">
                Delivery Instructions (optional)
              </label>
              <textarea id="delivery-instructions" name="delivery-instructions" rows={3} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder="E.g., Gate code, landmarks, etc."></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <CreditCardIcon className="h-5 w-5 mr-2 text-gray-400" />
            Payment Method
          </h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div className={`border rounded-md p-4 cursor-pointer ${selectedPaymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`} onClick={() => setSelectedPaymentMethod('card')}>
              <div className="flex items-center">
                <input id="card" name="payment-method" type="radio" checked={selectedPaymentMethod === 'card'} onChange={() => setSelectedPaymentMethod('card')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                  Credit / Debit Card
                </label>
              </div>
              {selectedPaymentMethod === 'card' && <div className="mt-4 grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input type="text" name="card-number" id="card-number" placeholder="1234 5678 9012 3456" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="expiration" className="block text-sm font-medium text-gray-700">
                      Expiration (MM/YY)
                    </label>
                    <input type="text" name="expiration" id="expiration" placeholder="MM/YY" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                      CVC
                    </label>
                    <input type="text" name="cvc" id="cvc" placeholder="123" className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                  </div>
                </div>}
            </div>
            <div className={`border rounded-md p-4 cursor-pointer ${selectedPaymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`} onClick={() => setSelectedPaymentMethod('cash')}>
              <div className="flex items-center">
                <input id="cash" name="payment-method" type="radio" checked={selectedPaymentMethod === 'cash'} onChange={() => setSelectedPaymentMethod('cash')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                <label htmlFor="cash" className="ml-3 block text-sm font-medium text-gray-700">
                  Cash on Delivery
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <TruckIcon className="h-5 w-5 mr-2 text-gray-400" />
            Order Summary
          </h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900">$31.97</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="text-gray-900">$2.99</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax</span>
              <span className="text-gray-900">$2.56</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-medium">
              <span>Total</span>
              <span>$37.52</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <Link to="/cart" className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Back to Cart
        </Link>
        <button onClick={handlePlaceOrder} disabled={!selectedPaymentMethod} className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${selectedPaymentMethod ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' : 'bg-gray-300 cursor-not-allowed'}`}>
          Place Order
        </button>
      </div>
    </div>;
}