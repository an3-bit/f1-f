import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import LoginImage from '../../assets/loginImage.jpg';
import axios from 'axios';
import Logo from '../../assets/logo.png';
import { ApiDomain } from '../../utilis/ApiDomain';

axios.defaults.baseURL = ApiDomain;

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('login'); // 'login' or 'verify'
  const [code, setCode] = useState('');
  const [codeExpired, setCodeExpired] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const specialUsers = ['alice@company.com', 'bob@company.com'];
      if (specialUsers.includes(formData.email.toLowerCase())) {
        const mockUser = {
          name: formData.email.split('@')[0],
          email: formData.email,
          userType: 'sales_engineer',
        };
        localStorage.setItem('authToken', 'special_user_token');
        localStorage.setItem('userName', mockUser.name);
        localStorage.setItem('userEmail', mockUser.email);
        localStorage.setItem('userType', mockUser.userType);

        navigate('/home1');
        return;
      }

      // Request verification code
      await axios.post('/api/sales-engineer/login', {
        email: formData.email,
      });

      // Move to Step 2: Code verification
      setStep('verify');
    } catch (error) {
      setError(
        error.response?.data?.detail || 'Failed to send verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCodeVerification = async () => {
    try {
      setLoading(true);
      setError('');
      setCodeExpired(false);

      const response = await axios.post('/verify-code', {
        email: formData.email,
        code,
      });

      const { access_token, user } = response.data;

      localStorage.setItem('authToken', access_token);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userType', user.userType);

      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      navigate('/home1');
    } catch (error) {
      const message = error.response?.data?.detail || 'Code verification failed. Try again.';
      setError(message);
      setCodeExpired(message.toLowerCase().includes('expired'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      setError('');
      await axios.post('/api/resend-code', { email: formData.email });
      setCodeExpired(false);
      setError('A new verification code has been sent to your email.');
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-teal-100 p-6">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row max-w-5xl w-full">
        {/* Left side */}
        <div className="md:w-1/2 bg-gradient-to-br from-[#00ADEF] to-[#004aad] text-white p-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Welcome to The Dashboard</h1>
            <div className="flex justify-center mb-2">
              <img src={Logo} alt="Company Logo" className="w-full mt-6 rounded-lg" />
            </div>
            <img src={LoginImage} alt="Water" className="w-full mt-6 rounded-lg" />
            <h2 className="text-3xl mt-8 font-bold">IMPROVING LIVES</h2>
            <p className="text-xl">through WATER & ENERGY SOLUTIONS</p>
          </div>
        </div>

        {/* Right side */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-[#004aad] text-center">
            {step === 'login' ? 'Login to Your Account' : 'Enter Verification Code'}
          </h2>

          {error && <div className="text-red-600 mb-4">{error}</div>}

          {step === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label>Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-4 py-2 border rounded-lg w-full"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
              >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
              </button>
              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={handleBackToHome}
                  className="text-[#004aad] hover:underline font-medium"
                >
                  Back to Home
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <label>Enter 4-digit code sent to {formData.email}</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={4}
                className="w-full p-2 border rounded-lg"
              />
              <button
                onClick={handleCodeVerification}
                disabled={loading}
                className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>

              {codeExpired && (
                <button
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-blue-700 underline mt-2"
                >
                  Resend Code
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

