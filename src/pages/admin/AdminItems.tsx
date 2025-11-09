import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

// Assume API imports - adjust based on your actual API structure
import { getItems, addItem, updateItem, deleteItem } from '../../api/userApi'; 
import Header from '../../component/user/Header';

type ItemType = 'events' | 'locations' | 'amenities';
type Item = { _id: string; name: string };

const AdminItemsManagement: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ItemType>('events');
  const [items, setItems] = useState<Record<ItemType, Item[]>>({
    events: [],
    locations: [],
    amenities: [],
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<ItemType>('events');
  const [newItemName, setNewItemName] = useState<string>('');
  const [editingItem, setEditingItem] = useState<{ type: ItemType; id: string; name: string } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const dispatch = useDispatch(); // If needed for auth or other, else remove

  const fetchItems = async (type: ItemType) => {
    try {
      const response = await getItems(type);
      if (response.data.items) {
        setItems((prev) => ({ ...prev, [type]: response.data.items }));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to fetch ${type}`);
    }
  };

  useEffect(() => {
    // Fetch all on mount
    fetchItems('events');
    fetchItems('locations');
    fetchItems('amenities');
  }, []);

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      toast.error('Item name is required');
      return;
    }
    try {
      const response = await addItem(selectedType, newItemName);
      if (response.data.item) {
        setItems((prev) => ({
          ...prev,
          [selectedType]: [...prev[selectedType], response.data.item],
        }));
        setNewItemName('');
        toast.success(`${selectedType} added successfully`);
        // Modal stays open for adding multiple
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add item');
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !editingItem.name.trim()) {
      toast.error('Item name is required');
      return;
    }
    try {
      const response = await updateItem(editingItem.type, editingItem.id, editingItem.name);
      if (response.data.item) {
        setItems((prev) => ({
          ...prev,
          [editingItem.type]: prev[editingItem.type].map((item) =>
            item._id === editingItem.id ? response.data.item : item
          ),
        }));
        setIsEditModalOpen(false);
        setEditingItem(null);
        toast.success(`${editingItem.type} updated successfully`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update item');
    }
  };

  const handleDeleteItem = async (type: ItemType, id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await deleteItem(type, id);
      if (response.data.success) {
        setItems((prev) => ({
          ...prev,
          [type]: prev[type].filter((item) => item._id !== id),
        }));
        toast.success(`${type} deleted successfully`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete item');
    }
  };

  const openEditModal = (type: ItemType, item: Item) => {
    setEditingItem({ type, id: item._id, name: item.name });
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2 sm:px-4 py-4">
        <Header/>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl overflow-hidden">
        <div className="p-4 sm:p-6">
          <h2 className="text-2xl font-bold text-[#78533F] mb-4 text-center">Manage Items</h2>

          {/* Top tabs */}
          <div className="flex justify-center space-x-2 mb-6">
            {(['events', 'locations', 'amenities'] as ItemType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={`px-4 py-2 rounded-full font-semibold text-sm capitalize ${
                  currentTab === tab
                    ? 'bg-[#78533F] text-white'
                    : 'bg-white text-[#78533F] border border-[#b09d94] hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Add button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center px-4 py-2 bg-[#ED695A] text-white rounded-full font-semibold hover:bg-[#c8564b] transition"
            >
              <Plus size={16} className="mr-2" />
              Add
            </button>
          </div>

          {/* Items list */}
          <div className="space-y-3">
            {items[currentTab].length === 0 ? (
              <p className="text-center text-gray-600">No {currentTab} added yet.</p>
            ) : (
              items[currentTab].map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-[#b09d94]"
                >
                  <span className="text-[#78533F]">{item.name}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(currentTab, item)}
                      className="p-1 text-[#78533F] hover:text-[#ED695A]"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(currentTab, item._id)}
                      className="p-1 text-[#78533F] hover:text-[#ED695A]"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#78533F]">Add New Item</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ItemType)}
              className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm mb-3 focus:ring-2 focus:ring-[#ED695A]"
            >
              <option value="events">Events</option>
              <option value="locations">Locations</option>
              <option value="amenities">Amenities</option>
            </select>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Enter item name"
              className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm mb-3 focus:ring-2 focus:ring-[#ED695A]"
            />
            <button
              onClick={handleAddItem}
              className="w-full bg-[#78533F] text-white py-2 rounded-full font-semibold hover:bg-[#634331] transition"
            >
              Add Item
            </button>
            <p className="text-xs text-gray-600 mt-2 text-center">You can add multiple items one by one.</p>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#78533F]">Edit Item</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              value={editingItem.name}
              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              placeholder="Enter item name"
              className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm mb-3 focus:ring-2 focus:ring-[#ED695A]"
            />
            <button
              onClick={handleUpdateItem}
              className="w-full bg-[#78533F] text-white py-2 rounded-full font-semibold hover:bg-[#634331] transition"
            >
              Update Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminItemsManagement;