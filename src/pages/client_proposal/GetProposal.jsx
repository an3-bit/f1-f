import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GetAProposal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSystem, fullData } = location.state || {};

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      selectedSystem,
      questionnaireAnswers: fullData
    };

    try {
      // Replace this with your real endpoint
      const res = await fetch('https://your-backend-api.com/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Submitted successfully! A sales engineer will reach out shortly.');
        navigate('/');
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Get a Quote</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Selected System</h3>
        <p className="text-gray-700"><strong>Name:</strong> {selectedSystem?.name}</p>
        <p className="text-gray-700"><strong>Model:</strong> {selectedSystem?.model}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <p className='text-center'>Please fill in these details:</p>
          <label htmlFor="fullName" className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary_yellow text-white py-2 rounded-md hover:opacity-90 transition"
        >
          {loading ? 'Submitting...' : 'Submit to Sales Engineer'}
        </button>
      </form>
    </div>
  );
};

export default GetAProposal;
