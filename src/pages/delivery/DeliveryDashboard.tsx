import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, TruckIcon, CheckCircleIcon, ClockIcon, XCircleIcon, CheckIcon, XIcon } from 'lucide-react';
export function DeliveryDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);
  // Mock order data
  const availableOrders = [{
    id: 'ORD-1232',
    restaurant: {
      name: 'Burger Palace',
      address: '123 Main St, New York, NY 10001',
      distance: '0.5 miles away'
    },
    customer: {
      name: 'Michael Brown',
      address: '789 Broadway, New York, NY 10003',
      distance: '1.2 miles away'
    },
    items: '2x Double Bacon Burger, 2x Fries, 2x Soda',
    total: '$50.44',
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    timeReady: 'Ready now',
    estimatedEarnings: '$8.50'
  }, {
    id: 'ORD-1229',
    restaurant: {
      name: 'Sushi Express',
      address: '456 Park Ave, New York, NY 10022',
      distance: '1.8 miles away'
    },
    customer: {
      name: 'Jennifer Lee',
      address: '321 E 42nd St, New York, NY 10017',
      distance: '2.5 miles away'
    },
    items: '1x California Roll, 1x Spicy Tuna Roll, 1x Miso Soup',
    total: '$32.97',
    paymentStatus: 'Paid',
    paymentMethod: 'Card',
    timeReady: 'Ready in 5 min',
    estimatedEarnings: '$9.75'
  }];
  const activeDeliveries = [{
    id: 'ORD-1231',
    restaurant: {
      name: 'Pizza Heaven',
      address: '789 5th Ave, New York, NY 10022'
    },
    customer: {
      name: 'Emily Davis',
      address: '321 5th Ave, New York, NY 10016',
      phone: '+1 (555) 789-0123'
    },
    items: '1x Veggie Burger, 1x Sweet Potato Fries',
    total: '$21.33',
    paymentStatus: 'Paid',
    paymentMethod: 'Card',
    status: 'Picked up',
    estimatedDelivery: '10 min',
    estimatedEarnings: '$7.25'
  }];
  const completedDeliveries = [{
    id: 'ORD-1228',
    restaurant: 'Taco Town',
    customer: 'David Wilson',
    total: '$18.45',
    paymentMethod: 'Card',
    completedAt: 'Today, 1:30 PM',
    earnings: '$6.50'
  }, {
    id: 'ORD-1227',
    restaurant: 'Noodle House',
    customer: 'Lisa Thompson',
    total: '$25.75',
    paymentMethod: 'Cash',
    completedAt: 'Today, 12:15 PM',
    earnings: '$8.25'
  }];
  const stats = [{
    name: "Today's Earnings",
    value: '$22.00',
    icon: DollarIcon
  }, {
    name: 'Completed Deliveries',
    value: '3',
    icon: CheckCircleIcon
  }, {
    name: 'Active Deliveries',
    value: activeDeliveries.length.toString(),
    icon: TruckIcon
  }, {
    name: 'Available Orders',
    value: availableOrders.length.toString(),
    icon: ClockIcon
  }];
  const handleToggleAvailability = () => {
    setIsAvailable(!isAvailable);
  };
  const handleAcceptOrder = (orderId: string) => {
    console.log(`Accepted order: ${orderId}`);
    // In a real application, this would update the backend
  };
  const handleDeclineOrder = (orderId: string) => {
    console.log(`Declined order: ${orderId}`);
    // In a real application, this would update the backend
  };
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
        <div className="flex items-center">
          <span className="mr-3 text-sm font-medium text-gray-900">
            Available for deliveries
          </span>
          <button onClick={handleToggleAvailability} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isAvailable ? 'bg-blue-600' : 'bg-gray-200'}`}>
            <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${isAvailable ? 'translate-x-5' : 'translate-x-0'}`}></span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>)}
      </div>
      {activeDeliveries.length > 0 && <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <TruckIcon className="h-5 w-5 mr-2 text-gray-400" />
              Active Delivery
            </h2>
          </div>
          {activeDeliveries.map(delivery => <div key={delivery.id} className="px-4 py-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Order #{delivery.id}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {delivery.items}
                  </p>
                </div>
                <Link to={`/orders/${delivery.id}`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  View Details
                </Link>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <MapPinIcon className="h-5 w-5 mr-1 text-gray-400" />
                      Restaurant
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {delivery.restaurant.name}
                      <br />
                      {delivery.restaurant.address}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <MapPinIcon className="h-5 w-5 mr-1 text-gray-400" />
                      Customer
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {delivery.customer.name}
                      <br />
                      {delivery.customer.address}
                      <br />
                      {delivery.customer.phone}
                    </dd>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-base font-medium text-gray-900">
                      {delivery.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Est. Delivery</p>
                    <p className="text-base font-medium text-gray-900">
                      {delivery.estimatedDelivery}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment</p>
                    <p className="text-base font-medium text-gray-900">
                      {delivery.paymentStatus} ({delivery.paymentMethod})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Earnings</p>
                    <p className="text-base font-medium text-gray-900">
                      {delivery.estimatedEarnings}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Mark as Delivered
                  </button>
                </div>
              </div>
            </div>)}
        </div>}
      {isAvailable && availableOrders.length > 0 && <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
              Available Orders
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {availableOrders.map(order => <div key={order.id} className="px-4 py-5 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {order.restaurant.name}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      {order.restaurant.distance} • {order.timeReady}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleDeclineOrder(order.id)} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <XIcon className="h-4 w-4 mr-1" />
                      Decline
                    </button>
                    <button onClick={() => handleAcceptOrder(order.id)} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Accept
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Pickup
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {order.restaurant.address}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Dropoff
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {order.customer.address}
                      <br />
                      {order.customer.distance}
                    </dd>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">Order:</span> {order.items}
                  </div>
                  <div>
                    <span className="font-medium">Est. Earnings:</span>{' '}
                    {order.estimatedEarnings}
                  </div>
                </div>
              </div>)}
          </div>
        </div>}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
            Completed Deliveries
          </h2>
          <span className="text-sm text-gray-500">Today</span>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {completedDeliveries.map(delivery => <li key={delivery.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {delivery.restaurant}
                    </p>
                    <p className="text-sm text-gray-500">
                      {delivery.customer} • {delivery.completedAt}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {delivery.earnings}
                    </p>
                    <p className="text-xs text-gray-500">
                      {delivery.total} • {delivery.paymentMethod}
                    </p>
                  </div>
                </div>
              </li>)}
          </ul>
        </div>
      </div>
    </div>;
}
// Custom Dollar icon since it's not in lucide-react
function DollarIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>;
}