import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, ClockIcon, CheckCircleIcon, TrendingUpIcon, CalendarIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
export function RestaurantDashboard() {
  const stats = [{
    name: 'New Orders',
    value: 5,
    change: 2,
    changeType: 'increase',
    icon: ShoppingBagIcon
  }, {
    name: 'In Progress',
    value: 8,
    change: 3,
    changeType: 'increase',
    icon: ClockIcon
  }, {
    name: 'Completed Today',
    value: 24,
    change: 5,
    changeType: 'increase',
    icon: CheckCircleIcon
  }, {
    name: "Today's Revenue",
    value: '$1,452',
    change: 12,
    changeType: 'increase',
    icon: TrendingUpIcon
  }];
  const recentOrders = [{
    id: 'ORD-1234',
    customer: 'John Smith',
    items: '2x Cheeseburger, 1x Fries',
    total: '$31.97',
    status: 'New',
    time: '5 mins ago'
  }, {
    id: 'ORD-1233',
    customer: 'Sarah Johnson',
    items: '1x Chicken Sandwich, 1x Onion Rings',
    total: '$18.99',
    status: 'Preparing',
    time: '12 mins ago'
  }, {
    id: 'ORD-1232',
    customer: 'Michael Brown',
    items: '2x Double Bacon Burger, 2x Fries, 2x Soda',
    total: '$45.96',
    status: 'Ready',
    time: '20 mins ago'
  }, {
    id: 'ORD-1231',
    customer: 'Emily Davis',
    items: '1x Veggie Burger, 1x Sweet Potato Fries',
    total: '$16.98',
    status: 'Delivered',
    time: '35 mins ago'
  }, {
    id: 'ORD-1230',
    customer: 'Robert Wilson',
    items: '1x Fish Sandwich, 1x Coleslaw, 1x Lemonade',
    total: '$22.47',
    status: 'Delivered',
    time: '45 mins ago'
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Restaurant Dashboard
        </h1>
        <div className="flex items-center text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-1" />
          Today, {new Date().toLocaleDateString()}
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
                      <div className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.changeType === 'increase' ? <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" aria-hidden="true" /> : <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" aria-hidden="true" />}
                          <span className="ml-1">{stat.change}%</span>
                        </div>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>)}
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Recent Orders
          </h2>
          <Link to="/orders" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map(order => <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {order.items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'New' ? 'bg-yellow-100 text-yellow-800' : order.status === 'Preparing' ? 'bg-blue-100 text-blue-800' : order.status === 'Ready' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-blue-600 hover:text-blue-900">
                      View
                    </a>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}