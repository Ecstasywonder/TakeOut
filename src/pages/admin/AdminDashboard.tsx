import React from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, UtensilsIcon, TruckIcon, ShoppingBagIcon, DollarSignIcon, ArrowUpIcon, ArrowDownIcon, BarChartIcon, PieChartIcon, LineChartIcon } from 'lucide-react';
export function AdminDashboard() {
  const stats = [{
    name: 'Total Users',
    value: '2,543',
    change: 12,
    changeType: 'increase',
    icon: UsersIcon
  }, {
    name: 'Restaurants',
    value: '45',
    change: 5,
    changeType: 'increase',
    icon: UtensilsIcon
  }, {
    name: 'Delivery Agents',
    value: '126',
    change: 8,
    changeType: 'increase',
    icon: TruckIcon
  }, {
    name: 'Daily Orders',
    value: '432',
    change: 4,
    changeType: 'increase',
    icon: ShoppingBagIcon
  }];
  const revenueStats = [{
    name: "Today's Revenue",
    value: '$8,492',
    change: 7,
    changeType: 'increase',
    icon: DollarSignIcon
  }, {
    name: 'Weekly Revenue',
    value: '$48,275',
    change: 12,
    changeType: 'increase',
    icon: DollarSignIcon
  }, {
    name: 'Monthly Revenue',
    value: '$195,432',
    change: 9,
    changeType: 'increase',
    icon: DollarSignIcon
  }, {
    name: 'Average Order Value',
    value: '$23.45',
    change: 2,
    changeType: 'decrease',
    icon: DollarSignIcon
  }];
  const recentActivities = [{
    id: 1,
    type: 'user',
    name: 'John Smith',
    action: 'registered as a new customer',
    time: '5 minutes ago'
  }, {
    id: 2,
    type: 'restaurant',
    name: 'Thai Delight',
    action: 'applied for restaurant registration',
    time: '15 minutes ago'
  }, {
    id: 3,
    type: 'order',
    name: 'Order #12345',
    action: 'was marked as delivered',
    time: '30 minutes ago'
  }, {
    id: 4,
    type: 'restaurant',
    name: 'Pizza Palace',
    action: 'updated their menu',
    time: '1 hour ago'
  }, {
    id: 5,
    type: 'agent',
    name: 'David Wilson',
    action: 'registered as a new delivery agent',
    time: '2 hours ago'
  }];
  const pendingApprovals = [{
    id: 1,
    type: 'restaurant',
    name: 'Sushi Master',
    details: 'Japanese cuisine, 4 menu items',
    time: 'Applied 2 days ago'
  }, {
    id: 2,
    type: 'restaurant',
    name: 'Pasta Paradise',
    details: 'Italian cuisine, 12 menu items',
    time: 'Applied 3 days ago'
  }, {
    id: 3,
    type: 'agent',
    name: 'Michael Brown',
    details: 'New delivery agent application',
    time: 'Applied 1 day ago'
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" defaultValue="today">
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <LineChartIcon className="h-5 w-5 mr-2 text-gray-400" />
              Order Trends
            </h2>
            <Link to="/analytics" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View All
            </Link>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
            <div className="text-center">
              <BarChartIcon className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Order trend chart would appear here
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2 text-gray-400" />
              Revenue Distribution
            </h2>
            <Link to="/analytics" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View All
            </Link>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
            <div className="text-center">
              <PieChartIcon className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Revenue distribution chart would appear here
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {revenueStats.map(stat => <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Recent Activities
            </h2>
            <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View All
            </Link>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {recentActivities.map(activity => <li key={activity.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {activity.name}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {activity.type}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {activity.action}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>{activity.time}</p>
                      </div>
                    </div>
                  </div>
                </li>)}
            </ul>
          </div>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Pending Approvals
            </h2>
            <Link to="/users" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View All
            </Link>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {pendingApprovals.map(approval => <li key={approval.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {approval.name}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {approval.type}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {approval.details}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>{approval.time}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex space-x-2 justify-end">
                      <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Reject
                      </button>
                      <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Approve
                      </button>
                    </div>
                  </div>
                </li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>;
}