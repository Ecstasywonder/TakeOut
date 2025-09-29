import React, { Component } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPinIcon, PhoneIcon, ClipboardListIcon, CreditCardIcon, CheckIcon, ArrowLeftIcon, MessageCircleIcon } from 'lucide-react';
export function DeliveryOrderDetails() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  // Mock order data
  const order = {
    id,
    restaurant: {
      name: 'Pizza Heaven',
      address: '789 5th Ave, New York, NY 10022',
      phone: '+1 (555) 456-7890',
      instructions: 'Enter through the side door. Ask for Mike.'
    },
    customer: {
      name: 'Emily Davis',
      address: '321 5th Ave, New York, NY 10016',
      phone: '+1 (555) 789-0123',
      instructions: 'Apartment 4B. Please call when you arrive.'
    },
    items: [{
      name: 'Veggie Burger',
      quantity: 1,
      price: 11.99
    }, {
      name: 'Sweet Potato Fries',
      quantity: 1,
      price: 4.99
    }],
    subtotal: 16.98,
    deliveryFee: 2.99,
    tax: 1.36,
    total: 21.33,
    paymentStatus: 'Paid',
    paymentMethod: 'Card',
    status: 'Picked up',
    estimatedDelivery: '10 min',
    estimatedEarnings: '$7.25',
    pickupTime: '3:45 PM',
    deliveryTime: '4:05 PM'
  };
  const handleMarkAsDelivered = () => {
    // In a real application, this would update the backend
    console.log(`Marking order ${id} as delivered`);
    navigate('/');
  };
  return <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 ml-4">Order #{id}</h1>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
            Pickup Details
          </h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">
            {order.restaurant.name}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {order.restaurant.address}
          </p>
          <div className="mt-4 flex items-center">
            <a href={`tel:${order.restaurant.phone}`} className="inline-flex items-center mr-4 text-blue-600 hover:text-blue-800">
              <PhoneIcon className="h-4 w-4 mr-1" />
              Call Restaurant
            </a>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.restaurant.address)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <MapPinIcon className="h-4 w-4 mr-1" />
              Directions
            </a>
          </div>
          {order.restaurant.instructions && <div className="mt-4 p-3 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Instructions:</strong> {order.restaurant.instructions}
              </p>
            </div>}
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
            Delivery Details
          </h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">
            {order.customer.name}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{order.customer.address}</p>
          <div className="mt-4 flex items-center">
            <a href={`tel:${order.customer.phone}`} className="inline-flex items-center mr-4 text-blue-600 hover:text-blue-800">
              <PhoneIcon className="h-4 w-4 mr-1" />
              Call Customer
            </a>
            <button className="inline-flex items-center mr-4 text-blue-600 hover:text-blue-800">
              <MessageCircleIcon className="h-4 w-4 mr-1" />
              Message
            </button>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.customer.address)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <MapPinIcon className="h-4 w-4 mr-1" />
              Directions
            </a>
          </div>
          {order.customer.instructions && <div className="mt-4 p-3 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Instructions:</strong> {order.customer.instructions}
              </p>
            </div>}
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <ClipboardListIcon className="h-5 w-5 mr-2 text-gray-400" />
            Order Details
          </h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <ul className="divide-y divide-gray-200">
            {order.items.map((item, index) => <li key={index} className="py-3 flex justify-between">
                <div>
                  <span className="text-gray-900">
                    {item.quantity} x {item.name}
                  </span>
                </div>
                <span className="text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>)}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900">
                ${order.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="text-gray-900">
                ${order.deliveryFee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500">Tax</span>
              <span className="text-gray-900">${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium mt-4 pt-4 border-t border-gray-200">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <CreditCardIcon className="h-5 w-5 mr-2 text-gray-400" />
            Payment & Earnings
          </h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between mb-4">
            <span className="text-gray-500">Payment Status</span>
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              {order.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-500">Payment Method</span>
            <span className="text-gray-900">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between mb-4 pt-4 border-t border-gray-200">
            <span className="text-gray-900 font-medium">Your Earnings</span>
            <span className="text-green-600 font-medium">
              {order.estimatedEarnings}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Delivery Timeline
          </h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between mb-4">
            <span className="text-gray-500">Pickup Time</span>
            <span className="text-gray-900">{order.pickupTime}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-500">Estimated Delivery</span>
            <span className="text-gray-900">{order.deliveryTime}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-500">Current Status</span>
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
              {order.status}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-8">
        <button onClick={handleMarkAsDelivered} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          <CheckIcon className="h-5 w-5 mr-2" />
          Mark as Delivered
        </button>
      </div>
    </div>;
}