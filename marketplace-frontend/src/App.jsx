import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingAiChatbot } from './components/FloatingAiChatbot';
import { ErrorBoundary } from './components/ErrorBoundary';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ProductsPage } from './pages/public/ProductsPage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { SuppliersPage } from './pages/public/SuppliersPage';
import { DeliveryPartnersPage } from './pages/public/DeliveryPartnersPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { CustomerOrders } from './pages/customer/CustomerOrders';
import { OrderChatPage } from './pages/customer/OrderChatPage';
import { ReturnTrackingPage } from './pages/customer/ReturnTrackingPage';

// Supplier Pages
import { SupplierDashboard } from './pages/supplier/SupplierDashboard';
import { SupplierProducts } from './pages/supplier/SupplierProducts';
import { SupplierOrders } from './pages/supplier/SupplierOrders';
import { ReturnPreventionCenter } from './pages/supplier/ReturnPreventionCenter';
import { ShopProfilePage } from './pages/supplier/ShopProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminSuppliersValidation } from './pages/admin/AdminSuppliersValidation';

// Protected Route Guard with role normalization
const normalizeRole = (r) => {
  if (!r) return 'customer';
  const lower = String(r).toLowerCase().trim();
  if (lower === 'client' || lower === 'customer' || lower === 'buyer') return 'customer';
  if (lower === 'supplier' || lower === 'fournisseur' || lower === 'vendeur') return 'supplier';
  if (lower === 'admin') return 'admin';
  return lower;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Vérification de la session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  const userRole = normalizeRole(user.role);
  if (allowedRoles) {
    const normalizedAllowed = allowedRoles.map(normalizeRole);
    if (!normalizedAllowed.includes(userRole)) {
      return <Navigate to={userRole === 'supplier' ? '/supplier/dashboard' : '/customer/dashboard'} replace />;
    }
  }
  return children;
};

export const AppContent = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/suppliers/:id" element={<ProductsPage />} />
            <Route path="/delivery-partners" element={<DeliveryPartnersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/returns" element={<ReturnTrackingPage />} />
            <Route path="/suivi-retours" element={<ReturnTrackingPage />} />

            {/* Customer Routes */}
            <Route path="/checkout" element={<ProtectedRoute allowedRoles={['customer']}><CheckoutPage /></ProtectedRoute>} />
            <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/customer/orders" element={<ProtectedRoute allowedRoles={['customer']}><CustomerOrders /></ProtectedRoute>} />
            <Route path="/customer/returns" element={<ProtectedRoute allowedRoles={['customer']}><ReturnTrackingPage /></ProtectedRoute>} />
            <Route path="/customer/chat/:orderId" element={<ProtectedRoute allowedRoles={['customer', 'supplier', 'admin']}><OrderChatPage /></ProtectedRoute>} />

            {/* Supplier Routes */}
            <Route path="/supplier/dashboard" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierDashboard /></ProtectedRoute>} />
            <Route path="/supplier/products" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierProducts /></ProtectedRoute>} />
            <Route path="/supplier/orders" element={<ProtectedRoute allowedRoles={['supplier']}><SupplierOrders /></ProtectedRoute>} />
            <Route path="/supplier/return-prevention" element={<ProtectedRoute allowedRoles={['supplier']}><ReturnPreventionCenter /></ProtectedRoute>} />
            <Route path="/supplier/profile" element={<ProtectedRoute allowedRoles={['supplier']}><ShopProfilePage /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/suppliers/pending" element={<ProtectedRoute allowedRoles={['admin']}><AdminSuppliersValidation /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
      <FloatingAiChatbot />
    </div>
  );
};

export function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
