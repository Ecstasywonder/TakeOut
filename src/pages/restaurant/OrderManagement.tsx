import React, { useState } from 'react';
import { FilterIcon, CheckIcon, ClockIcon, TruckIcon, XIcon, MoreHorizontalIcon } from 'lucide-react';
export function OrderManagement() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  // Mock order data
  const orders = [{
    id: 'ORD-1234',
    customer: {
      name: 'John Smith',
      address: '123 Main St, Apt 4B, New York, NY 10001',
      phone: '+1 (555) 123-4567'
    },
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
    status: 'New',
    time: '5 mins ago',
    paymentStatus: 'Pending',
    paymentMethod: 'Card'
  }, {
    id: 'ORD-1233',
    customer: {
      name: 'Sarah Johnson',
      address: '456 Park Ave, New York, NY 10022',
      phone: '+1 (555) 987-6543'
    },
    items: [{
      name: 'Chicken Sandwich',
      quantity: 1,
      price: 10.99
    }, {
      name: 'Onion Rings',
      quantity: 1,
      price: 4.99
    }, {
      name: 'Soda',
      quantity: 1,
      price: 2.99
    }],
    subtotal: 18.97,
    deliveryFee: 2.99,
    tax: 1.52,
    total: 23.48,
    status: 'Preparing',
    time: '12 mins ago',
    paymentStatus: 'Paid',
    paymentMethod: 'Card'
  }, {
    id: 'ORD-1232',
    customer: {
      name: 'Michael Brown',
      address: '789 Broadway, New York, NY 10003',
      phone: '+1 (555) 456-7890'
    },
    items: [{
      name: 'Double Bacon Burger',
      quantity: 2,
      price: 14.99
    }, {
      name: 'Fries',
      quantity: 2,
      price: 3.99
    }, {
      name: 'Soda',
      quantity: 2,
      price: 2.99
    }],
    subtotal: 43.94,
    deliveryFee: 2.99,
    tax: 3.51,
    total: 50.44,
    status: 'Ready',
    time: '20 mins ago',
    paymentStatus: 'Paid',
    paymentMethod: 'Cash'
  }, {
    id: 'ORD-1231',
    customer: {
      name: 'Emily Davis',
      address: '321 5th Ave, New York, NY 10016',
      phone: '+1 (555) 789-0123'
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
    status: 'In Transit',
    time: '35 mins ago',
    paymentStatus: 'Paid',
    paymentMethod: 'Card'
  }, {
    id: 'ORD-1230',
    customer: {
      name: 'Robert Wilson',
      address: '654 Lexington Ave, New York, NY 10022',
      phone: '+1 (555) 234-5678'
    },
    items: [{
      name: 'Fish Sandwich',
      quantity: 1,
      price: 13.99
    }, {
      name: 'Coleslaw',
      quantity: 1,
      price: 3.99
    }, {
      name: 'Lemonade',
      quantity: 1,
      price: 2.99
    }],
    subtotal: 20.97,
    deliveryFee: 2.99,
    tax: 1.68,
    total: 25.64,
    status: 'Delivered',
    time: '45 mins ago',
    paymentStatus: 'Paid',
    paymentMethod: 'Cash'
  }];
  const filteredOrders = filterStatus ? orders.filter(order => order.status === filterStatus) : orders;
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New':
        return <FilterIcon className="h-5 w-5" />;
      case 'Preparing':
        return <ClockIcon className="h-5 w-5" />;
      case 'Ready':
        return <CheckIcon className="h-5 w-5" />;
      case 'In Transit':
        return <TruckIcon className="h-5 w-5" />;
      case 'Delivered':
        return <CheckIcon className="h-5 w-5" />;
      default:
        return <MoreHorizontalIcon className="h-5 w-5" />;
    }
  };
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-yellow-100 text-yellow-800';
      case 'Preparing':
        return 'bg-blue-100 text-blue-800';
      case 'Ready':
        return 'bg-purple-100 text-purple-800';
      case 'In Transit':
        return 'bg-indigo-100 text-indigo-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getPaymentStatusClass = (status: string) => {
    return status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };
  const handleStatusChange = (orderId: string, newStatus: string) => {
    // In a real application, this would update the backend
    console.log(`Changing order ${orderId} status to ${newStatus}`);
    // For now, we'll just close the order details
    setSelectedOrder(null);
  };
  const selectedOrderData = orders.find(order => order.id === selectedOrder);
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <div className="flex space-x-2">
          <button onClick={() => setFilterStatus(null)} className={`px-3 py-1 text-sm font-medium rounded-md ${filterStatus === null ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
            All
          </button>
          <button onClick={() => setFilterStatus('New')} className={`px-3 py-1 text-sm font-medium rounded-md ${filterStatus === 'New' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
            New
          </button>
          <button onClick={() => setFilterStatus('Preparing')} className={`px-3 py-1 text-sm font-medium rounded-md ${filterStatus === 'Preparing' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
            Preparing
          </button>
          <button onClick={() => setFilterStatus('Ready')} className={`px-3 py-1 text-sm font-medium rounded-md ${filterStatus === 'Ready' ? 'bg-purple-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
            Ready
          </button>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
                  Payment
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
              {filteredOrders.map(order => <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusClass(order.paymentStatus)}`}>
                      {order.paymentStatus} ({order.paymentMethod})
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => setSelectedOrder(order.id)} className="text-blue-600 hover:text-blue-900">
                      View
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {/* Order Details Modal */}
      {selectedOrder && selectedOrderData && <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button type="button" className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={() => setSelectedOrder(null)}>
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                      Order Details
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(selectedOrderData.status)}`}>
                        {selectedOrderData.status}
                      </span>
                    </h3>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        <strong>Order ID:</strong> {selectedOrderData.id}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        <strong>Time:</strong> {selectedOrderData.time}
                      </p>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">
                          Customer Information
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          <strong>Name:</strong>{' '}
                          {selectedOrderData.customer.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          <strong>Address:</strong>{' '}
                          {selectedOrderData.customer.address}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          <strong>Phone:</strong>{' '}
                          {selectedOrderData.customer.phone}
                        </p>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">
                          Items
                        </h4>
                        <ul className="divide-y divide-gray-200">
                          {selectedOrderData.items.map((item, index) => <li key={index} className="py-2 flex justify-between">
                              <span className="text-sm text-gray-500">
                                {item.quantity} x {item.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </li>)}
                        </ul>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Subtotal</span>
                          <span className="text-gray-900">
                            ${selectedOrderData.subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-500">Delivery Fee</span>
                          <span className="text-gray-900">
                            ${selectedOrderData.deliveryFee.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-500">Tax</span>
                          <span className="text-gray-900">
                            ${selectedOrderData.tax.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-200">
                          <span>Total</span>
                          <span>${selectedOrderData.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">
                          Payment
                        </h4>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusClass(selectedOrderData.paymentStatus)}`}>
                            {selectedOrderData.paymentStatus}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            Method: {selectedOrderData.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedOrderData.status === 'New' && <button type="button" onClick={() => handleStatusChange(selectedOrderData.id, 'Preparing')} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Start Preparing
                  </button>}
                {selectedOrderData.status === 'Preparing' && <button type="button" onClick={() => handleStatusChange(selectedOrderData.id, 'Ready')} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Mark as Ready
                  </button>}
                <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setSelectedOrder(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
}