import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Loader } from '../components';
import { useAPI } from '../context/APIContext';
import { LogIn, UserPlus, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('LOGISTICS');
  const [base, setBase] = useState('');
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, register, loading } = useAPI();

  const validateLogin = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (email && !email.includes('@')) newErrors.email = 'Invalid email format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (!base) newErrors.base = 'Base is required';
    if (email && !email.includes('@')) newErrors.email = 'Invalid email format';
    if (password && password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    const result = await login(email, password);

    if (result.success) {
      setAlert({ type: 'success', message: 'Login successful! Redirecting...' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setAlert(null);
    const result = await register(name, email, password, role, base);

    if (result.success) {
      if (result.hasToken) {
        // Token received, redirect to dashboard
        setAlert({ type: 'success', message: 'Registration successful! Redirecting...' });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        // No token, ask to login
        setAlert({ type: 'success', message: 'Registration successful! Please login.' });
        setTimeout(() => {
          setIsLogin(true);
          setEmail('');
          setPassword('');
          setName('');
          setBase('');
          setRole('LOGISTICS');
          setErrors({});
          setAlert(null);
        }, 2000);
      }
    } else {
      setAlert({ type: 'error', message: result.error });
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setName('');
    setBase('');
    setRole('LOGISTICS');
    setErrors({});
    setAlert(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {isLogin ? (
              <LogIn className="text-blue-600" size={36} />
            ) : (
              <UserPlus className="text-blue-600" size={36} />
            )}
            <h1 className="text-4xl font-bold text-gray-800">MAM</h1>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            Military Asset Management
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {isLogin ? 'Access your military asset dashboard' : 'Create your management account'}
          </p>
        </div>

        {/* Alert */}
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        {/* Form Card */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {/* Name Field (Register) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  disabled={loading}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="admin@military.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                disabled={loading}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                disabled={loading}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Role Field (Register) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="input-field"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                >
                  <option value="LOGISTICS">Logistics Officer</option>
                  <option value="MANAGER">Asset Manager</option>
                  <option value="COMMANDER">Commander</option>
                </select>
              </div>
            )}

            {/* Base Field (Register) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base</label>
                <select
                  className="input-field"
                  value={base}
                  onChange={(e) => setBase(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select Base</option>
                  <option value="BASE_A">Base Alpha</option>
                  <option value="BASE_B">Base Bravo</option>
                  <option value="BASE_C">Base Charlie</option>
                </select>
                {errors.base && <p className="text-xs text-red-500 mt-1">{errors.base}</p>}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={18} />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Toggle Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={toggleForm}
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Secure military asset management system
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
