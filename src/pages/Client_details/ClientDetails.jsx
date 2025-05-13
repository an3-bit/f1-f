import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClientDetails = () => {
  const { state } = useLocation(); // { system: { … } }
  const navigate = useNavigate();

  const [isExistingClient, setIsExistingClient] = useState(false);
  const [clientPhone, setClientPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClientSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await axios.get(
        `http://127.0.0.1:8000/erp/Customer_Card/Phone_No/${clientPhone}`
      );

      const arr = resp.data?.value;
      if (Array.isArray(arr) && arr.length > 0) {
        const rec = arr[0];
        // Navigate to upgrade suggestion page
        navigate('/client-details-page', {
          state: {
            client: rec,
            system: state?.system
          }
        });
      } else {
        setError('No client found with this phone number.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch client. Check phone number or try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedNew = () => {
    navigate('/system-advisor', {
      state: { system: state?.system }
    });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        System Selection
      </h2>
      <p className="text-gray-600 mb-6">
        Choose whether to have a new system via the System Advisor or search for an existing system to get an upgrade.
      </p>

      <div className="mb-6">
        <label className="mr-6">
          <input
            type="radio"
            checked={!isExistingClient}
            onChange={() => { setIsExistingClient(false); setError(''); }}
          />{' '}
          New system
        </label>
        <label>
          <input
            type="radio"
            checked={isExistingClient}
            onChange={() => { setIsExistingClient(true); setError(''); }}
          />{' '}
          Existing system
        </label>
      </div>

      {isExistingClient ? (
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="Enter phone number"
              className="border border-gray-300 px-3 py-2 rounded w-full"
            />
            <button
              onClick={handleClientSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={loading || !clientPhone}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      ) : (
        <div>
          <button
            onClick={handleProceedNew}
            className="bg-green-600 text-white px-6 py-3 rounded"
          >
            Proceed to System Advisor
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
