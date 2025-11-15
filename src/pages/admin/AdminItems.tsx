import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash, X } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getItems, addItem, updateItem, deleteItem } from "../../api/userApi";
import Header from "../../component/user/Header";

type ItemType = "events" | "locations" | "amenities" | "vendorTypes";
type Item = { _id: string; name: string };

const AdminItemsManagement: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ItemType>("events");
  const [items, setItems] = useState<Record<ItemType, Item[]>>({
    events: [],
    locations: [],
    amenities: [],
    vendorTypes: [],
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ItemType>("events");
  const [newItemName, setNewItemName] = useState("");
  const [editingItem, setEditingItem] = useState<{
    type: ItemType;
    oldName: string;
    name: string;
  } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const stringArrayToItems = (arr: string[]): Item[] => {
    return arr.map((name, index) => ({
      _id: `temp-${index}-${Date.now()}`,
      name,
    }));
  };

  const fetchAllItems = async () => {
    try {
      const response = await getItems("all");
      const backendItems = response.data.items || {};

      const transformed = {
        events: backendItems.events ? stringArrayToItems(backendItems.events) : [],
        locations: backendItems.locations ? stringArrayToItems(backendItems.locations) : [],
        amenities: backendItems.amenities ? stringArrayToItems(backendItems.amenities) : [],
        vendorTypes: backendItems.vendorTypes ? stringArrayToItems(backendItems.vendorTypes) : [],
      };

      setItems(transformed);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch items");
    }
  };

  useEffect(() => {
    fetchAllItems();
  }, []);

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      toast.error("Item name is required");
      return;
    }

    try {
      const response = await addItem(selectedType, newItemName);
      const { success, message, data } = response.data;

      if (success && data && data[selectedType]) {
        const newItems = stringArrayToItems(data[selectedType]);
        setItems((prev) => ({
          ...prev,
          [selectedType]: newItems,
        }));

        setNewItemName("");
        setIsAddModalOpen(false);
        toast.success(message || `${selectedType} added successfully`);
      } else {
        toast.error("Failed to add item");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add item");
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !editingItem.name.trim()) {
      toast.error("Item name is required");
      return;
    }

    try {
      const response = await updateItem(
        editingItem.type,
        editingItem.oldName,
        editingItem.name
      );

      if (response.data.success && response.data.data) {
        const updatedArray: string[] = response.data.data[editingItem.type] || [];
        const updatedItems = stringArrayToItems(updatedArray);

        setItems((prev) => ({
          ...prev,
          [editingItem.type]: updatedItems,
        }));

        setIsEditModalOpen(false);
        setEditingItem(null);
        toast.success(`${editingItem.type} updated successfully`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update item");
    }
  };

  const handleDeleteItem = async (type: ItemType, itemName: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete this ${type.replace(/s$/, "")}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await deleteItem(type, itemName);
      if (response.data.success && response.data.data) {
        const updatedArray: string[] = response.data.data[type] || [];
        const updatedItems = stringArrayToItems(updatedArray);

        setItems((prev) => ({
          ...prev,
          [type]: updatedItems,
        }));

        Swal.fire("Deleted!", `${type.replace(/s$/, "")} deleted successfully`, "success");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete item");
    }
  };

  const openEditModal = (type: ItemType, item: Item) => {
    setEditingItem({ type, oldName: item.name, name: item.name });
    setIsEditModalOpen(true);
  };

  const tabLabels: Record<ItemType, string> = {
    events: "Events",
    locations: "Locations",
    amenities: "Amenities",
    vendorTypes: "Vendor Types",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2 sm:px-4 py-4">
      <Header />
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl overflow-hidden">
        <div className="p-4 sm:p-6">
          <h2 className="text-2xl font-bold text-[#78533F] mb-4 text-center">
            Manage Items
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {(["events", "locations", "amenities", "vendorTypes"] as ItemType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={`px-4 py-2 rounded-full font-semibold text-sm capitalize whitespace-nowrap ${
                  currentTab === tab
                    ? "bg-[#78533F] text-white"
                    : "bg-white text-[#78533F] border border-[#b09d94] hover:bg-gray-50"
                }`}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>

          {/* Add Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setSelectedType(currentTab);
                setIsAddModalOpen(true);
              }}
              className="flex items-center px-4 py-2 bg-[#ED695A] text-white rounded-full font-semibold hover:bg-[#c8564b] transition"
            >
              <Plus size={16} className="mr-2" />
              Add {tabLabels[currentTab]}
            </button>
          </div>

          {/* Item List */}
          <div className="space-y-3">
            {items[currentTab].length === 0 ? (
              <p className="text-center text-gray-600">
                No {tabLabels[currentTab].toLowerCase()} added yet.
              </p>
            ) : (
              items[currentTab].map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-[#b09d94]"
                >
                  <span className="text-[#78533F] font-medium">{item.name}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(currentTab, item)}
                      className="p-1 text-[#78533F] hover:text-[#ED695A] transition"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(currentTab, item.name)}
                      className="p-1 text-red-600 hover:text-red-700 transition"
                      title="Delete"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#78533F]">Add New Item</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ItemType)}
              className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm mb-3 focus:ring-2 focus:ring-[#ED695A] focus:outline-none"
            >
              <option value="events">Events</option>
              <option value="locations">Locations</option>
              <option value="amenities">Amenities</option>
              <option value="vendorTypes">Vendor Types</option>
            </select>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddItem()}
              placeholder={`Enter ${tabLabels[selectedType].toLowerCase()} name`}
              className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm mb-3 focus:ring-2 focus:ring-[#ED695A] focus:outline-none"
            />
            <button
              onClick={handleAddItem}
              className="w-full bg-[#78533F] text-white py-2 rounded-full font-semibold hover:bg-[#634331] transition"
            >
              Add {tabLabels[selectedType]}
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#78533F]">
                Edit {tabLabels[editingItem.type]}
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              value={editingItem.name}
              onChange={(e) =>
                setEditingItem({ ...editingItem, name: e.target.value })
              }
              onKeyPress={(e) => e.key === "Enter" && handleUpdateItem()}
              placeholder={`Enter new name`}
              className="w-full px-3 py-2 border border-[#b09d94] rounded-full text-sm mb-3 focus:ring-2 focus:ring-[#ED695A] focus:outline-none"
            />
            <button
              onClick={handleUpdateItem}
              className="w-full bg-[#78533F] text-white py-2 rounded-full font-semibold hover:bg-[#634331] transition"
            >
              Update {tabLabels[editingItem.type]}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminItemsManagement;