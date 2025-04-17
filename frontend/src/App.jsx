import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import OrdersPage from "./pages/OrdersPage";
import CartPage from "./pages/CartPage";
import HousePage from "./pages/HousePage"


function App() {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  return (
    <Routes>
      <Route path="/" element={<HousePage onAddToCart={handleAddToCart} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/home" element={<HousePage onAddToCart={handleAddToCart} />} />
      <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
    </Routes>
  );
}

export default App;
