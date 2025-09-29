import React, { useState } from 'react';
import { BarChartIcon, LineChartIcon, PieChartIcon, CalendarIcon, TrendingUpIcon, TrendingDownIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
export function Analytics() {
  const [timeRange, setTimeRange] = useState('week');
  const revenueStats = [{
    name: 'Total Revenue',
    value: '$48,275',
    change: 12,
    changeType: 'increase'
  }, {
    name: 'Orders',
    value: '2,874',
    change: 8,
    changeType: 'increase'
  }, {
    name: 'Avg. Order Value',
    value: '$23.45',
    change: 2,
    changeType: 'decrease'
  }, {
    name: 'Active Customers',
    value: '1,543',
    change: 15,
    changeType: 'increase'
  }];
  const topRestaurants = [{
    id: 1,
    name: 'Burger Palace',
    orders: 342,
    revenue: '$7,895',
    growth: 12
  }, {
    id: 2,
    name: 'Pizza Heaven',
    orders: 289,
    revenue: '$6,432',
    growth: 8
  }, {
    id: 3,
    name: 'Sushi Express',
    orders: 245,
    revenue: '$5,876',
    growth: 15
  }, {
    id: 4,
    name: 'Taco Town',
    orders: 198,
    revenue: '$4,321',
    growth: -3
  }, {
    id: 5,
    name: 'Curry House',
    orders: 176,
    revenue: '$3,987',
    growth: 5
  }];
  const topItems = [{
    id: 1,
    name: 'Classic Cheeseburger',
    restaurant: 'Burger Palace',
    orders: 245,
    revenue: '$3,182'
  }, {
    id: 2,
    name: 'Pepperoni Pizza',
    restaurant: 'Pizza Heaven',
    orders: 198,
    revenue: '$2,871'
  }, {
    id: 3,
    name: 'California Roll',
    restaurant: 'Sushi Express',
    orders: 167,
    revenue: '$2,338'
  }, {
    id: 4,
    name: 'Chicken Tacos',
    restaurant: 'Taco Town',
    orders: 154,
    revenue: '$1,848'
  }, {
    id: 5,
    name: 'Butter Chicken',
    restaurant: 'Curry House',
    orders: 132,
    revenue: '$1,716'
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={timeRange} onChange={e => setTimeRange(e.target.value)}>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Custom Range
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {revenueStats.map(stat => <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="w-0 flex-1">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <LineChartIcon className="h-5 w-5 mr-2 text-gray-400" />
              Revenue Over Time
            </h2>
            <div className="flex space-x-2">
              <button className="px-2 py-1 text-xs font-medium rounded-md bg-blue-600 text-white">
                Revenue
              </button>
              <button className="px-2 py-1 text-xs font-medium rounded-md bg-gray-200 text-gray-700">
                Orders
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
            <div className="text-center">
              <LineChartIcon className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Revenue trend chart would appear here
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2 text-gray-400" />
              Order Distribution
            </h2>
            <div className="flex space-x-2">
              <button className="px-2 py-1 text-xs font-medium rounded-md bg-blue-600 text-white">
                By Category
              </button>
              <button className="px-2 py-1 text-xs font-medium rounded-md bg-gray-200 text-gray-700">
                By Location
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
            <div className="text-center">
              <PieChartIcon className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Order distribution chart would appear here
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <BarChartIcon className="h-5 w-5 mr-2 text-gray-400" />
              Top Performing Restaurants
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Restaurant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topRestaurants.map(restaurant => <tr key={restaurant.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {restaurant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {restaurant.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {restaurant.revenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {restaurant.growth > 0 ? <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" /> : <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />}
                        <span className={restaurant.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                          {restaurant.growth > 0 ? '+' : ''}
                          {restaurant.growth}%
                        </span>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <BarChartIcon className="h-5 w-5 mr-2 text-gray-400" />
              Top Selling Items
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Restaurant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topItems.map(item => <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.restaurant}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.revenue}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <BarChartIcon className="h-5 w-5 mr-2 text-gray-400" />
            Order Activity by Hour
          </h2>
          <div className="flex space-x-2">
            <button className="px-2 py-1 text-xs font-medium rounded-md bg-blue-600 text-white">
              Weekday
            </button>
            <button className="px-2 py-1 text-xs font-medium rounded-md bg-gray-200 text-gray-700">
              Weekend
            </button>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
          <div className="text-center">
            <BarChartIcon className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Hourly order activity chart would appear here
            </p>
          </div>
        </div>
      </div>
    </div>;
}