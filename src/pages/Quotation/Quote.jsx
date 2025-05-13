// File: Quote.jsx
import { useState } from 'react';

const Quote = () => {
  const [productNumber, setProductNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [quotationData, setQuotationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/erp/quotation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_number: productNumber,
          phone_number: phoneNumber,
          name: name
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setQuotationData(data.data);
      } else {
        throw new Error(data.message || 'Failed to generate quotation');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate quotation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!quotationData) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Generate Quotation</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Number
            </label>
            <input
              type="text"
              value={productNumber}
              onChange={(e) => setProductNumber(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter product number (e.g., DSD200)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="254700000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter customer name...optional though...type any name you remember"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary_yellow text-white py-2 px-4 rounded-md 
              hover:bg-blue-700 disabled:bg-gray-400 transition-colors 
              duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Quotation'
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
          Customer Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Customer Number:</span> 
              <span className="ml-2 text-gray-800">{quotationData.customer.No}</span>
            </p>
            <p>
              <span className="font-semibold">Name:</span> 
              <span className="ml-2 text-gray-800">{quotationData.customer.Name}</span>
            </p>
            <p>
              <span className="font-semibold">Phone:</span> 
              <span className="ml-2 text-gray-800">{quotationData.customer.Phone_No}</span>
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Date:</span> 
              <span className="ml-2 text-gray-800">{quotationData.quotation_text.metadata.date}</span>
            </p>
            <p>
              <span className="font-semibold">Reference:</span> 
              <span className="ml-2 text-gray-800">{quotationData.quotation_text.metadata.reference_number}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
          Product Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Product Number:</span> 
              <span className="ml-2 text-gray-800">{quotationData.product.No}</span>
            </p>
            <p>
              <span className="font-semibold">Description:</span> 
              <span className="ml-2 text-gray-800">{quotationData.product.Description}</span>
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Unit Price:</span> 
              <span className="ml-2 text-gray-800">{quotationData.price.unit_price_formatted}</span>
            </p>
            <p>
              <span className="font-semibold">Available Stock:</span> 
              <span className="ml-2 text-gray-800">{quotationData.product.Inventory}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
          Pricing Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-gray-600">
            <p className="flex justify-between">
              <span className="font-semibold">Subtotal:</span>
              <span className="text-gray-800">{quotationData.price.subtotal_formatted}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold">Tax ({quotationData.price.tax_rate}%):</span>
              <span className="text-gray-800">{quotationData.price.tax_amount_formatted}</span>
            </p>
          </div>
          <div className="flex items-center justify-end">
            <p className="text-2xl font-bold text-blue-600">
              Total: {quotationData.price.grand_total_formatted}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
          Technical Specifications
        </h2>
        <div className="space-y-4 text-gray-600">
          <p className="font-medium text-gray-800">
            {quotationData.quotation_text.equipment.description}
          </p>
          <p className="leading-relaxed">
            {quotationData.quotation_text.equipment.technical_details}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
          Price Breakdown
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Item</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Unit Price</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {quotationData.quotation_text.price_schedule.items.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-800">{item.rate_formatted}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-800">{item.amount_formatted}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-4 py-3 text-sm font-semibold text-gray-600 text-right" colSpan="2">
                  Subtotal:
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-800">
                  {quotationData.quotation_text.price_schedule.subtotal_formatted}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-semibold text-gray-600 text-right" colSpan="2">
                  Tax ({quotationData.quotation_text.price_schedule.tax.rate}%):
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-800">
                  {quotationData.quotation_text.price_schedule.tax.amount_formatted}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-lg font-bold text-blue-600 text-right" colSpan="2">
                  Grand Total:
                </td>
                <td className="px-4 py-3 text-lg font-bold text-right text-blue-600">
                  {quotationData.quotation_text.price_schedule.total_formatted}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Quote;