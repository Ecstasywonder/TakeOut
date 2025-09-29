import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, SearchIcon, FilterIcon } from 'lucide-react';
export function RestaurantList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const restaurants = [{
    id: '1',
    name: 'Burger Palace',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    rating: 4.8,
    cuisine: 'American',
    deliveryTime: '15-25 min',
    minOrder: '$10'
  }, {
    id: '2',
    name: 'Pizza Heaven',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    rating: 4.6,
    cuisine: 'Italian',
    deliveryTime: '20-30 min',
    minOrder: '$15'
  }, {
    id: '3',
    name: 'Sushi Express',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    rating: 4.7,
    cuisine: 'Japanese',
    deliveryTime: '25-35 min',
    minOrder: '$20'
  }, {
    id: '4',
    name: 'Taco Town',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    rating: 4.5,
    cuisine: 'Mexican',
    deliveryTime: '20-30 min',
    minOrder: '$12'
  }, {
    id: '5',
    name: 'Curry House',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    rating: 4.9,
    cuisine: 'Indian',
    deliveryTime: '30-40 min',
    minOrder: '$18'
  }, {
    id: '6',
    name: 'Noodle House',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    rating: 4.6,
    cuisine: 'Chinese',
    deliveryTime: '25-35 min',
    minOrder: '$15'
  }];
  const cuisines = ['All', 'American', 'Italian', 'Japanese', 'Mexican', 'Indian', 'Chinese'];
  const filteredRestaurants = restaurants.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) && (selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine);
  });
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
        <div className="relative rounded-md shadow-sm w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input type="text" className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="Search restaurants" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>
      <div className="flex overflow-x-auto pb-2 space-x-2">
        {cuisines.map(cuisine => <button key={cuisine} className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${selectedCuisine === cuisine ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`} onClick={() => setSelectedCuisine(cuisine)}>
            {cuisine}
          </button>)}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRestaurants.map(restaurant => <Link to={`/restaurants/${restaurant.id}`} key={restaurant.id} className="block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="w-full h-48 overflow-hidden">
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">
                  {restaurant.name}
                </h3>
                <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                  {restaurant.rating}
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-1">{restaurant.cuisine}</p>
              <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
                <span>{restaurant.deliveryTime}</span>
                <span>Min. {restaurant.minOrder}</span>
              </div>
            </div>
          </Link>)}
      </div>
    </div>;
}