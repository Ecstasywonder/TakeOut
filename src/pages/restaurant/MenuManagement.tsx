import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XIcon } from 'lucide-react';
export function MenuManagement() {
  const [categories, setCategories] = useState([{
    id: 'appetizers',
    name: 'Appetizers',
    items: [{
      id: 'app1',
      name: 'Cheese Fries',
      description: 'A delicious starter to share',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      available: true
    }, {
      id: 'app2',
      name: 'Onion Rings',
      description: 'Classic appetizer, perfectly prepared',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1639024471283-03bce9a7ba64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      available: true
    }]
  }, {
    id: 'mains',
    name: 'Main Courses',
    items: [{
      id: 'main1',
      name: 'Classic Cheeseburger',
      description: 'Our signature dish, made with the finest ingredients',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      available: true
    }, {
      id: 'main2',
      name: 'Double Bacon Burger',
      description: 'A customer favorite, guaranteed to satisfy',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      available: true
    }]
  }, {
    id: 'desserts',
    name: 'Desserts',
    items: [{
      id: 'dessert1',
      name: 'Chocolate Milkshake',
      description: 'The perfect sweet ending to your meal',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      available: true
    }]
  }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'category' | 'item'>('item');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    available: true
  });
  const handleOpenModal = (type: 'category' | 'item', categoryId?: string, itemId?: string) => {
    setModalType(type);
    setIsModalOpen(true);
    if (type === 'category') {
      if (categoryId) {
        const category = categories.find(c => c.id === categoryId);
        setEditingCategory(categoryId);
        setFormData({
          name: category?.name || '',
          description: '',
          price: '',
          image: '',
          available: true
        });
      } else {
        setEditingCategory(null);
        setFormData({
          name: '',
          description: '',
          price: '',
          image: '',
          available: true
        });
      }
    } else {
      if (categoryId && itemId) {
        const category = categories.find(c => c.id === categoryId);
        const item = category?.items.find(i => i.id === itemId);
        setEditingCategory(categoryId);
        setEditingItem(itemId);
        if (item) {
          setFormData({
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            image: item.image,
            available: item.available
          });
        }
      } else if (categoryId) {
        setEditingCategory(categoryId);
        setEditingItem(null);
        setFormData({
          name: '',
          description: '',
          price: '',
          image: '',
          available: true
        });
      }
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      available: true
    });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'category') {
      if (editingCategory) {
        // Update existing category
        setCategories(categories.map(category => category.id === editingCategory ? {
          ...category,
          name: formData.name
        } : category));
      } else {
        // Add new category
        const newCategory = {
          id: `category-${Date.now()}`,
          name: formData.name,
          items: []
        };
        setCategories([...categories, newCategory]);
      }
    } else {
      // Item form
      if (editingCategory && editingItem) {
        // Update existing item
        setCategories(categories.map(category => category.id === editingCategory ? {
          ...category,
          items: category.items.map(item => item.id === editingItem ? {
            ...item,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            image: formData.image,
            available: formData.available
          } : item)
        } : category));
      } else if (editingCategory) {
        // Add new item to category
        const newItem = {
          id: `item-${Date.now()}`,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          image: formData.image,
          available: formData.available
        };
        setCategories(categories.map(category => category.id === editingCategory ? {
          ...category,
          items: [...category.items, newItem]
        } : category));
      }
    }
    handleCloseModal();
  };
  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category and all its items?')) {
      setCategories(categories.filter(category => category.id !== categoryId));
    }
  };
  const handleDeleteItem = (categoryId: string, itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setCategories(categories.map(category => category.id === categoryId ? {
        ...category,
        items: category.items.filter(item => item.id !== itemId)
      } : category));
    }
  };
  const handleToggleItemAvailability = (categoryId: string, itemId: string) => {
    setCategories(categories.map(category => category.id === categoryId ? {
      ...category,
      items: category.items.map(item => item.id === itemId ? {
        ...item,
        available: !item.available
      } : item)
    } : category));
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <button onClick={() => handleOpenModal('category')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Category
        </button>
      </div>
      <div className="space-y-8">
        {categories.map(category => <div key={category.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                {category.name}
              </h2>
              <div className="flex space-x-2">
                <button onClick={() => handleOpenModal('item', category.id)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Item
                </button>
                <button onClick={() => handleOpenModal('category', category.id)} className="inline-flex items-center px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button onClick={() => handleDeleteCategory(category.id)} className="inline-flex items-center px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200">
              {category.items.length === 0 ? <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                  No items in this category. Add some items to get started.
                </div> : <ul className="divide-y divide-gray-200">
                  {category.items.map(item => <li key={item.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          <img className="h-16 w-16 rounded-md object-cover" src={item.image} alt={item.name} />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.description}
                              </p>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              ${item.price.toFixed(2)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 mr-2">
                                Available:
                              </span>
                              <button onClick={() => handleToggleItemAvailability(category.id, item.id)} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${item.available ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${item.available ? 'translate-x-5' : 'translate-x-0'}`}></span>
                              </button>
                            </div>
                            <div className="flex space-x-2">
                              <button onClick={() => handleOpenModal('item', category.id, item.id)} className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <PencilIcon className="h-3 w-3" />
                              </button>
                              <button onClick={() => handleDeleteItem(category.id, item.id)} className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                <TrashIcon className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>)}
                </ul>}
            </div>
          </div>)}
      </div>
      {/* Modal */}
      {isModalOpen && <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button type="button" className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={handleCloseModal}>
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {modalType === 'category' ? editingCategory ? 'Edit Category' : 'Add Category' : editingItem ? 'Edit Item' : 'Add Item'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required />
                        </div>
                        {modalType === 'item' && <>
                            <div>
                              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                              </label>
                              <textarea name="description" id="description" rows={2} value={formData.description} onChange={handleInputChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
                            </div>
                            <div>
                              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Price ($)
                              </label>
                              <input type="number" name="price" id="price" min="0" step="0.01" value={formData.price} onChange={handleInputChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required />
                            </div>
                            <div>
                              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Image URL
                              </label>
                              <input type="text" name="image" id="image" value={formData.image} onChange={handleInputChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required />
                            </div>
                            <div className="flex items-center">
                              <input id="available" name="available" type="checkbox" checked={formData.available} onChange={handleInputChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                              <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                                Available
                              </label>
                            </div>
                          </>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                    {editingCategory || editingItem ? 'Update' : 'Add'}
                  </button>
                  <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleCloseModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>}
    </div>;
}