import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("MANUFACTURE");
      if (!token) {
        setError("You must be logged in as a manufacturer.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:8080/manufacture/medicine/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.response?.data?.message || "Failed to load products");
        toast.error(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40 text-gray-600 text-lg">
        Loading medicines...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-semibold my-6">
        {error}
      </div>
    );

  if (products.length === 0)
    return (
      <div className="text-center text-gray-700 mt-6 font-medium">
        No medicines/products found for your account.
      </div>
    );

  return (
    <div className="p-8 max-w-5xl mx-auto rounded-lg shadow-lg">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-800">
        My Medicines / Products
      </h2>
      <ul className="space-y-6">
        {products.map((product) => (
          <li
            key={product.id}
            className="border border-gray-300 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 "
          >
            <h3 className="text-3xl font-semibold mb-3 text-gray-900">
              {product.name}
            </h3>
            <p className="mb-4 text-gray-700 italic">
              {product.description || "No description provided"}
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Price
                </label>
                <p className="text-lg font-semibold text-green-700">
                  ₹{product.price.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Stock
                </label>
                <p className="text-lg font-semibold text-gray-800">
                  {product.stock}
                </p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Category
                </label>
                <p className="text-lg font-semibold text-indigo-700">
                  {product.category}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllProducts;
