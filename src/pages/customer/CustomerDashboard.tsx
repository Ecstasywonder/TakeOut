import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsIcon, ClockIcon, TruckIcon, StarIcon } from 'lucide-react';
export function CustomerDashboard() {
  const recentOrders = [{
    id: '1',
    restaurant: 'Burger Palace',
    items: 'Cheeseburger, Fries, Soda',
    status: 'Delivered',
    date: 'Today, 12:30 PM'
  }, {
    id: '2',
    restaurant: 'Pizza Heaven',
    items: 'Large Pepperoni Pizza, Garlic Knots',
    status: 'In Transit',
    date: 'Yesterday, 7:15 PM'
  }, {
    id: '3',
    restaurant: 'Sushi Express',
    items: 'California Roll, Miso Soup',
    status: 'Ready',
    date: '2 days ago, 1:45 PM'
  }];
  const favoriteRestaurants = [{
    id: '1',
    name: 'Burger Palace',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    rating: 4.8,
    cuisine: 'American'
  }, {
    id: '2',
    name: 'Pizza Heaven',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    rating: 4.6,
    cuisine: 'Italian'
  }, {
    id: '3',
    name: 'Sushi Express',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    rating: 4.7,
    cuisine: 'Japanese'
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <Link to="/restaurants" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Order Now
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UtensilsIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Orders
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">12</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Orders
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">1</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TruckIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Delivered Orders
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">11</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Recent Orders
          </h2>
          <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View All
          </Link>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {recentOrders.map(order => <li key={order.id}>
                <Link to={`/orders/${order.id}/tracking`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {order.restaurant}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : order.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                          {order.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {order.items}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>{order.date}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>)}
          </ul>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Your Favorite Restaurants
          </h2>
          <Link to="/restaurants" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Browse All
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteRestaurants.map(restaurant => <div key={restaurant.id} className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
              <div className="flex-shrink-0">
                <img className="h-12 w-12 rounded-full object-cover" src={restaurant.image} alt={restaurant.name} />
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/restaurants/${restaurant.id}`} className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">
                    {restaurant.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {restaurant.cuisine}
                  </p>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">
                      {restaurant.rating}
                    </span>
                  </div>
                </Link>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
}