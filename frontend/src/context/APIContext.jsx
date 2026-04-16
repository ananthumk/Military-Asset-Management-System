import React, { createContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import {
  authAPI,
  dashboardAPI,
  assetsAPI,
  purchasesAPI,
  transfersAPI,
  assignmentsAPI,
} from '../services/api';

export const APIContext = createContext();

export const APIProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(Cookies.get('token') || null);
  const [dashboardData, setDashboardData] = useState(null);
  const [assets, setAssets] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    if (token) {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser) {
        setUser(savedUser);
      }
    }
  }, [token]);

  const login = useCallback(async (email, password) => {
    try {
      console.log(' Login attempt:', email);
      setLoading(true);
      const response = await authAPI.login(email, password);
      const { token: newToken, user: userData } = response.data;
      console.log('Login successful, storing token and user:', userData.email);

      // Store token in cookies and localStorage
      Cookies.set('token', newToken, { expires: 7 });
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.log('Login error:', error.response?.data?.message || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  });

  const register = useCallback(async (name, email, password, role, base) => {
    try {
      console.log(' Register attempt:', { name, email, role, base });
      setLoading(true);
      const response = await authAPI.register(name, email, password, role, base);
      console.log('Registration successful, response:', response.data);
      
      // If registration returns token, log user in
      if (response.data.token) {
        const { token: newToken, user: userData } = response.data;
        console.log(' Token received, auto-logging in:', userData.email);
        Cookies.set('token', newToken, { expires: 7 });
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        return { success: true, hasToken: true };
      } else {
        // Otherwise, just show success message
        console.log(' No token in registration response');
        return { success: true, hasToken: false };
      }
    } catch (error) {
      console.log(' Registration error:', error.response?.data?.message || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    } finally {
      setLoading(false);
    }
  });

  const logout = useCallback(() => {
    Cookies.remove('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setDashboardData(null);
    setAssets([]);
    setPurchases([]);
    setTransfers([]);
    setAssignments([]);
  });

  const fetchDashboard = useCallback(async () => {
    try {
      console.log(' Fetching dashboard data');
      setLoading(true);
      const response = await dashboardAPI.get();
      console.log(' Dashboard data fetched:', response.data);
      setDashboardData(response.data);
      return { success: true };
    } catch (error) {
      console.log(' Dashboard fetch error:', error.response?.data?.message || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch dashboard',
      };
    } finally {
      setLoading(false);
    }
  });

  const fetchAssets = useCallback(async () => {
    try {
      console.log(' Fetching assets');
      setLoading(true);
      const response = await assetsAPI.getAll();
      console.log(' Assets fetched:', response.data.length, 'items');
      setAssets(response.data);
      return { success: true };
    } catch (error) {
      console.log(' Assets fetch error:', error.response?.data?.message || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch assets',
      };
    } finally {
      setLoading(false);
    }
  });

  const addAsset = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await assetsAPI.create(data);
      setAssets([...assets, response.data]);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add asset',
      };
    } finally {
      setLoading(false);
    }
  });

  const deleteAsset = useCallback(async (id) => {
    try {
      setLoading(true);
      await assetsAPI.delete(id);
      setAssets(assets.filter((asset) => asset._id !== id));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete asset',
      };
    } finally {
      setLoading(false);
    }
  });

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      const response = await purchasesAPI.getAll();
      setPurchases(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch purchases',
      };
    } finally {
      setLoading(false);
    }
  });

  const addPurchase = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await purchasesAPI.create(data);
      setPurchases([...purchases, response.data]);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add purchase',
      };
    } finally {
      setLoading(false);
    }
  });

  const fetchTransfers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await transfersAPI.getAll();
      setTransfers(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch transfers',
      };
    } finally {
      setLoading(false);
    }
  });

  const addTransfer = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await transfersAPI.create(data);
      setTransfers([...transfers, response.data]);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add transfer',
      };
    } finally {
      setLoading(false);
    }
  });

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await assignmentsAPI.getAll();
      setAssignments(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch assignments',
      };
    } finally {
      setLoading(false);
    }
  });

  const addAssignment = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await assignmentsAPI.create(data);
      setAssignments([...assignments, response.data]);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add assignment',
      };
    } finally {
      setLoading(false);
    }
  });

  const value = {
    user,
    token,
    dashboardData,
    assets,
    purchases,
    transfers,
    assignments,
    loading,
    login,
    register,
    logout,
    fetchDashboard,
    fetchAssets,
    addAsset,
    deleteAsset,
    fetchPurchases,
    addPurchase,
    fetchTransfers,
    addTransfer,
    fetchAssignments,
    addAssignment,
  };

  return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
};

export const useAPI = () => {
  const context = React.useContext(APIContext);
  if (!context) {
    throw new Error('useAPI must be used within APIProvider');
  }
  return context;
};
