import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('MANUFACTURE');
  if (!token) {
    toast.error("You must be logged in as a manufacturer.");
    return;
  }

  try {
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
    };

  const res =   await axios.post(
      'http://localhost:8080/manufacture/medicine/create',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res);

    toast.success("Medicine created successfully");
  } catch (err) {
    console.error("Create medicine error:", err);
    toast.error(err.response?.data?.message || "Failed to create medicine");
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6  rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Medicine</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Medicine Name (e.g. Paracetamol)"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded-md"
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md"
        />
        <input
          type="number"
          name="price"
          placeholder="Price (in ₹)"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded-md"
          min="0"
          step="0.01"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={formData.stock}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded-md"
          min="0"
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded-md"
        >
          <option value="">Select Category</option>
          <option value="Painkiller">Painkiller</option>
          <option value="Antibiotic">Antibiotic</option>
          <option value="Antiviral">Antiviral</option>
          <option value="Vaccine">Vaccine</option>
          <option value="Supplement">Supplement</option>
        </select>
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Create Medicine
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
