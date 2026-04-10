import React from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { user } = useAuth();

  const addToCart = async () => {
    if (!user) {
      toast.error('Please login to add to cart');
      return;
    }
    try {
      await api.post('/cart/add', { productId: product.id, quantity: 1 });
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <p className="text-green-600 font-bold text-xl">₹{product.price}</p>
        <p className="text-gray-500 text-sm">Stock: {product.quantity}</p>
        {user?.role === 'BUYER' && (
          <button
            onClick={addToCart}
            className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;