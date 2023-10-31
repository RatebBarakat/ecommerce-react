import React, { createContext, useContext, useEffect, useState } from "react";
import createAxiosInstance from "../axios";

const CartContext = createContext({});

const CartProvider = ({ children }) => {
  const [carts, setCarts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const axios = createAxiosInstance();

  const addToCart = async (productId) => {
    await axios.post("/api/cart", {
      product_id: productId,
      quantity: 1,
    });
  };

  const fetchCart = async () => {
    !isLoading && setIsLoading(true);

    axios
      .get("/api/cart")
      .then((response) => {
        setCarts(response.data.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isInCart = (id) => {
    if (carts.length === 0) return true;
    return carts.some((cart) => cart.product.id === id);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const value = {
    carts,
    isLoading,
    fetchCart,
    isInCart,
    addToCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartProvider, CartContext };
