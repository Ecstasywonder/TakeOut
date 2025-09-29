import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StarIcon, ClockIcon, DollarSignIcon, PlusIcon, MinusIcon, ShoppingCartIcon } from 'lucide-react';
export function RestaurantMenu() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [cart, setCart] = useState<{
    id: string;
    quantity: number;
  }[]>([]);
  // Mock restaurant data
  const restaurant = {
    id,
    name: id === '1' ? 'Burger Palace' : id === '2' ? 'Pizza Heaven' : 'Sushi Express',
    image: id === '1' ? 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' : id === '2' ? 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' : 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    rating: 4.8,
    cuisine: id === '1' ? 'American' : id === '2' ? 'Italian' : 'Japanese',
    deliveryTime: '15-25 min',
    minOrder: '$10',
    description: 'Delicious food delivered to your doorstep. We specialize in fresh ingredients and amazing flavors.'
  };
  // Mock menu categories and items
  const menuCategories = [{
    id: 'appetizers',
    name: 'Appetizers',
    items: [{
      id: 'app1',
      name: id === '1' ? 'Cheese Fries' : id === '2' ? 'Garlic Bread' : 'Edamame',
      description: 'A delicious starter to share',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
    }, {
      id: 'app2',
      name: id === '1' ? 'Onion Rings' : id === '2' ? 'Mozzarella Sticks' : 'Miso Soup',
      description: 'Classic appetizer, perfectly prepared',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1639024471283-03bce9a7ba64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
    }]
  }, {
    id: 'mains',
    name: 'Main Courses',
    items: [{
      id: 'main1',
      name: id === '1' ? 'Classic Cheeseburger' : id === '2' ? 'Margherita Pizza' : 'California Roll',
      description: 'Our signature dish, made with the finest ingredients',
      price: 12.99,
      image: id === '1' ? 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80' : id === '2' ? 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80' : 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
    }, {
      id: 'main2',
      name: id === '1' ? 'Double Bacon Burger' : id === '2' ? 'Pepperoni Pizza' : 'Dragon Roll',
      description: 'A customer favorite, guaranteed to satisfy',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
    }]
  }, {
    id: 'desserts',
    name: 'Desserts',
    items: [{
      id: 'dessert1',
      name: id === '1' ? 'Chocolate Milkshake' : id === '2' ? 'Tiramisu' : 'Green Tea Ice Cream',
      description: 'The perfect sweet ending to your meal',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
    }]
  }];
  const handleAddToCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      if (existingItem) {
        return prevCart.map(item => item.id === itemId ? {
          ...item,
          quantity: item.quantity + 1
        } : item);
      } else {
        return [...prevCart, {
          id: itemId,
          quantity: 1
        }];
      }
    });
  };
  const handleRemoveFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item => item.id === itemId ? {
          ...item,
          quantity: item.quantity - 1
        } : item);
      } else {
        return prevCart.filter(item => item.id !== itemId);
      }
    });
  };
  const getItemQuantity = (itemId: string) => {
    const item = cart.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  return <div className="space-y-6">
      <div className="relative h-64 overflow-hidden rounded-lg">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="p-6 text-white w-full">
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <div className="flex items-center mt-2">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1">{restaurant.rating}</span>
              <span className="mx-2">•</span>
              <span>{restaurant.cuisine}</span>
            </div>
            <div className="flex items-center mt-2">
              <ClockIcon className="h-5 w-5" />
              <span className="ml-1">{restaurant.deliveryTime}</span>
              <span className="mx-2">•</span>
              <DollarSignIcon className="h-5 w-5" />
              <span className="ml-1">Min. {restaurant.minOrder}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="sticky top-0 z-10 bg-white shadow-md p-4 rounded-md flex justify-between items-center">
        <div className="flex space-x-4">
          {menuCategories.map(category => <a key={category.id} href={`#${category.id}`} className="text-gray-600 hover:text-blue-600 font-medium">
              {category.name}
            </a>)}
        </div>
        <Link to="/cart" className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          Cart
          {totalItems > 0 && <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {totalItems}
            </span>}
        </Link>
      </div>
      <div className="space-y-8">
        {menuCategories.map(category => <div key={category.id} id={category.id} className="scroll-mt-20">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.items.map(item => <div key={item.id} className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover" />
                  <div className="flex flex-1 justify-between p-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.description}
                      </p>
                      <p className="text-blue-600 font-medium mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {getItemQuantity(item.id) > 0 ? <div className="flex items-center">
                          <button onClick={() => handleRemoveFromCart(item.id)} className="text-gray-500 focus:outline-none focus:text-gray-600 p-1">
                            <MinusIcon className="h-5 w-5" />
                          </button>
                          <span className="text-gray-700 mx-2">
                            {getItemQuantity(item.id)}
                          </span>
                          <button onClick={() => handleAddToCart(item.id)} className="text-gray-500 focus:outline-none focus:text-gray-600 p-1">
                            <PlusIcon className="h-5 w-5" />
                          </button>
                        </div> : <button onClick={() => handleAddToCart(item.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add
                        </button>}
                    </div>
                  </div>
                </div>)}
            </div>
          </div>)}
      </div>
    </div>;
}