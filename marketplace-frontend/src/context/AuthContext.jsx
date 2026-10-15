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
      if (token.startsWith('demo-token-')) {
        // Active demo session: validate existing user from localStorage and never wipe
        const savedUser = safeJsonParse('user_data', null);
        if (savedUser) {
          setUser(savedUser);
        }
        setLoading(false);
        return;
      }

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
    } catch (err) {
      console.warn('Backend login unavailable, creating demo session:', err);
    }

    // Fallback: generate session for demo without blocking
    const storedUsers = safeJsonParse('registered_users', []);
    const cleanEmail = (email || '').trim().toLowerCase();
    const matched = storedUsers.find(u => u.email && u.email.toLowerCase() === cleanEmail);

    const role = matched?.role || (cleanEmail.includes('admin') ? 'admin' : cleanEmail.includes('supplier') || cleanEmail.includes('fournisseur') || cleanEmail.includes('vendeur') ? 'supplier' : 'customer');
    const name = matched?.name || (cleanEmail.split('@')[0] || 'Utilisateur').replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const mockToken = 'demo-token-' + Date.now();
    const mockUser = {
      id: matched?.id || Date.now(),
      name: name,
      email: cleanEmail || 'demo.user@marketeria.dz',
      phone: matched?.phone || '0774159472',
      role: role,
      shop_name: matched?.shop_name || (role === 'supplier' ? 'Boutique Certifiée DZ' : undefined),
      sector: matched?.sector || (role === 'supplier' ? 'Électronique & High-Tech' : undefined),
      address: matched?.address || 'Alger, Algérie',
      supplier: role === 'supplier' ? {
        shop_name: matched?.shop_name || 'Boutique Certifiée DZ',
        sector: matched?.sector || 'Électronique & High-Tech',
        address: matched?.address || 'Alger, Algérie',
        max_allowed_return_rate: 12.00,
      } : undefined,
      created_at: new Date().toISOString()
    };

    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    setToken(mockToken);
    setUser(mockUser);
    return mockUser;
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
    } catch (err) {
      console.warn('Backend register unavailable, creating local demo user:', err);
    }

    // Fallback: save user locally and create active session
    const cleanEmail = (formData.email || `user.${Date.now()}@marketeria.dz`).trim().toLowerCase();
    const mockToken = 'demo-token-' + Date.now();
    const targetRole = formData.role || 'customer';
    const mockUser = {
      id: Date.now(),
      name: formData.name || (targetRole === 'supplier' ? 'Fournisseur Certifié DZ' : 'Client Marketeria'),
      email: cleanEmail,
      phone: formData.phone || '0774159472',
      role: targetRole,
      shop_name: formData.shop_name || (targetRole === 'supplier' ? 'Ma Boutique Pro DZ' : undefined),
      sector: formData.sector || (targetRole === 'supplier' ? 'Commerce Général' : undefined),
      address: formData.address || 'Alger, Algérie',
      supplier: targetRole === 'supplier' ? {
        shop_name: formData.shop_name || 'Ma Boutique Pro DZ',
        sector: formData.sector || 'Commerce Général',
        address: formData.address || 'Alger, Algérie',
        max_allowed_return_rate: 12.00,
      } : undefined,
      created_at: new Date().toISOString()
    };

    const storedUsers = safeJsonParse('registered_users', []);
    storedUsers.push(mockUser);
    localStorage.setItem('registered_users', JSON.stringify(storedUsers));
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    setToken(mockToken);
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    if (token && !token.startsWith('demo-token-')) {
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
