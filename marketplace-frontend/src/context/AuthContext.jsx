import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const safeJsonParse = (key, fallback = null) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    return JSON.parse(saved);
  } catch (e) {
    console.warn(`Safe JSON parse error for key "${key}":`, e);
    return fallback;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => safeJsonParse('user_data', null));
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null);
  const [loading, setLoading] = useState(false);

  // Cart state
  const [cart, setCart] = useState(() => safeJsonParse('app_cart', []));

  useEffect(() => {
    localStorage.setItem('app_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (token) {
      api.get('/me')
        .then((res) => {
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('user_data', JSON.stringify(res.data.user));
          }
        })
        .catch((err) => {
          if (err?.response && err.response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            setToken(null);
            setUser(null);
          } else {
            const savedUser = safeJsonParse('user_data', null);
            if (savedUser) {
              setUser(savedUser);
            }
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/login', { email, password });
      const { token: authToken, user: userData } = res.data;
      if (authToken && userData) {
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setToken(authToken);
        setUser(userData);
        return userData;
      }
      throw new Error(res.data?.message || 'Identifiants incorrects.');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Identifiants incorrects (Email ou mot de passe invalide).';
      throw new Error(message);
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/register', formData);
      const { token: authToken, user: userData } = res.data;
      if (authToken && userData) {
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setToken(authToken);
        setUser(userData);
        return userData;
      }
      throw new Error(res.data?.message || 'Erreur lors de l\'inscription.');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Erreur lors de l\'inscription.';
      throw new Error(message);
    }
  };

  const logout = () => {
    if (token) {
      api.post('/logout').catch(() => {});
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setToken(null);
    setUser(null);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
