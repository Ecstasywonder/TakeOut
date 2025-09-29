import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircleIcon, ClockIcon, TruckIcon, PhoneIcon, MessageCircleIcon } from 'lucide-react';
export function OrderTracking() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [currentStep, setCurrentStep] = useState(2);
  const [estimatedTime, setEstimatedTime] = useState(25);
  useEffect(() => {
    // Simulate order progress
    const timer = setTimeout(() => {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        setEstimatedTime(Math.max(0, estimatedTime - 10));
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [currentStep, estimatedTime]);
  const steps = [{
    id: 1,
    name: 'Order Placed',
    description: 'Your order has been received by the restaurant',
    icon: CheckCircleIcon,
    status: currentStep >= 1
  }, {
    id: 2,
    name: 'Preparing',
    description: 'The restaurant is preparing your food',
    icon: ClockIcon,
    status: currentStep >= 2
  }, {
    id: 3,
    name: 'On the Way',
    description: 'Your order is on the way to you',
    icon: TruckIcon,
    status: currentStep >= 3
  }, {
    id: 4,
    name: 'Delivered',
    description: 'Your order has been delivered',
    icon: CheckCircleIcon,
    status: currentStep >= 4
  }];
  // Mock order details
  const order = {
    id: id,
    restaurant: 'Burger Palace',
    items: [{
      name: 'Classic Cheeseburger',
      quantity: 2,
      price: 12.99
    }, {
      name: 'Cheese Fries',
      quantity: 1,
      price: 5.99
    }],
    subtotal: 31.97,
    deliveryFee: 2.99,
    tax: 2.56,
    total: 37.52,
    address: '123 Main St, Apt 4B, New York, NY 10001',
    driver: {
      name: 'John Smith',
      phone: '+1 (555) 123-4567',
      photo: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  };
  return <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
        <p className="text-gray-600">Order #{order.id}</p>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Delivery Status
              </h2>
              {currentStep < 4 && <div className="text-sm text-gray-500">
                  Estimated delivery in {estimatedTime} mins
                </div>}
            </div>
            <ol className="relative border-l border-gray-200 ml-3">
              {steps.map((step, stepIdx) => <li key={step.id} className="mb-10 ml-6">
                  <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white ${step.status ? 'bg-green-500' : 'bg-gray-200'}`}>
                    <step.icon className={`w-4 h-4 ${step.status ? 'text-white' : 'text-gray-500'}`} />
                  </span>
                  <h3 className={`font-medium ${step.status ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.name}
                    {currentStep === step.id && <span className="ml-2 text-sm font-normal text-green-500">
                        (Current)
                      </span>}
                  </h3>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </li>)}
            </ol>
          </div>
          {currentStep >= 3 && currentStep < 4 && <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Your Delivery Agent
              </h3>
              <div className="flex items-center">
                <img className="h-12 w-12 rounded-full" src={order.driver.photo} alt={order.driver.name} />
                <div className="ml-4 flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {order.driver.name}
                  </h4>
                  <p className="text-sm text-gray-500">{order.driver.phone}</p>
                </div>
                <div className="flex space-x-2">
                  <a href={`tel:${order.driver.phone}`} className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <PhoneIcon className="h-5 w-5" />
                  </a>
                  <button className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <MessageCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>}
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Delivery Address
            </h3>
            <p className="text-gray-900">{order.address}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Order Summary
            </h3>
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
          </div>
          <div className="border-t border-gray-200 pt-4">
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
      <div className="flex justify-center">
        <Link to="/restaurants" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Order More Food
        </Link>
      </div>
    </div>;
}