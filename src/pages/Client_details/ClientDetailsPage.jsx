import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClientDetailsPage = () => {
  const { state } = useLocation();
  const { client, system: initialSystem } = state || {};
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    selected_system: initialSystem?.name || initialSystem?.systemName || '',
    current_capacity: initialSystem?.current_capacity ?? 0,
    current_users: initialSystem?.current_users ?? 0,
    location: client?.City || client?.Address || '',
    target_capacity: initialSystem?.target_capacity ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!client) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Client Details</h2>
        <p>No client data found. Please go back and try again.</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'selected_system' || name === 'location'
        ? value
        : Number(value)
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/futureexpansion',
        formData
      );
      navigate('/upgrade-suggestion', {
        state: {
          client,
          upgrade: response.data,
          currentSystem: formData
        }
      });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch upgrade suggestion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <section>
        <h2 className="text-2xl font-semibold mb-2">Client Details</h2>
        <p><strong>Name:</strong> {client.Name}</p>
        <p><strong>Phone:</strong> {client.Phone_No}</p>
      </section>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Suggest an Upgrade
        </button>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold">Upgrade Details</h3>

          <div>
            <label className="block mb-1">Selected System</label>
            <input
              type="text"
              name="selected_system"
              value={formData.selected_system}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Current Capacity</label>
              <input
                type="number"
                name="current_capacity"
                value={formData.current_capacity}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Current Users</label>
              <input
                type="number"
                name="current_users"
                value={formData.current_users}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Target Capacity</label>
            <input
              type="number"
              name="target_capacity"
              value={formData.target_capacity}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              min="0"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 rounded text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default ClientDetailsPage;