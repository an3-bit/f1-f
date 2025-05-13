import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, FileText, User, Search, X, Trash } from 'lucide-react';

export default function SalesQuotePage() {
  const [notes, setNotes] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);
  const [quoteCreated, setQuoteCreated] = useState(null);
  const [savingLineItems, setSavingLineItems] = useState(false);
  const [lineItemsStatus, setLineItemsStatus] = useState(null);

  // Function to search for clients by phone number
  const searchClient = async () => {
    if (!clientSearch.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Make an API call to the specified endpoint
      const response = await fetch(`http://127.0.0.1:8000/erp/Customer_Card/Phone_No/${encodeURIComponent(clientSearch)}`);
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.value && data.value.length > 0) {
        // Map the response data to our format
        const clients = data.value.map(client => ({
          No: client.No,
          Name: client.Name,
          Phone_No: client.Phone_No,
          E_Mail: client.E_Mail
        }));
        
        setSearchResults(clients);
      } else {
        // No results found
        setSearchResults([]);
      }
    } catch (err) {
      setError('Failed to search client. Please try again.');
      console.error('Error searching client:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to search for products
  const searchProduct = async () => {
    if (!productSearch.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Make an API call to the specified endpoint
      const response = await fetch(`http://127.0.0.1:8000/erp/products/number/${encodeURIComponent(productSearch)}`);
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.value && data.value.length > 0) {
        // Get the first product from the response
        const product = data.value[0];
        
        // Extract only the fields we need
        const productData = {
          No: product.No,
          Item_Category_Code: product.Item_Category_Code,
          Product_Model: product.Product_Model,
          Description: product.Description,
          Unit_Price: product.Unit_Price,
          Retail_Price: product.Retail_Price,
          Standard_Cost: product.Standard_Cost
        };
        
        setSelectedProduct(productData);
      } else {
        // No results found
        setSelectedProduct(null);
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to search product. Please try again.');
      console.error('Error searching product:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to add product to quote
  const addProductToQuote = () => {
    if (selectedProduct) {
      const newProduct = {
        ...selectedProduct,
        quantity: quantity,
        totalPrice: selectedProduct.Unit_Price * quantity
      };
      
      setProducts([...products, newProduct]);
      setIsAddingProduct(false);
      setSelectedProduct(null);
      setProductSearch('');
      setQuantity(1);
    }
  };

  // Function to remove product from quote
  const removeProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  // Select a client
  const selectClient = (client) => {
    setSelectedClient(client);
    setSearchResults(null);
    setClientSearch('');
  };

  // Calculate total amount when products change
  useEffect(() => {
    const total = products.reduce((sum, product) => sum + product.totalPrice, 0);
    setTotalAmount(total);
  }, [products]);

  // Function to save quote line items
  const saveQuoteLineItems = async (quoteNumber) => {
    setSavingLineItems(true);
    setLineItemsStatus({ success: 0, failed: 0, total: products.length });
    
    try {
      const savedItems = await Promise.all(
        products.map(async (product) => {
          const lineItemData = {
            Document_Type: "Quote",
            Document_No: quoteNumber,
            Type: "Item",
            Quantity: product.quantity,
            No: product.No
          };
          
          try {
            const response = await fetch('http://127.0.0.1:8000/erp/sales-quote-line', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(lineItemData)
            });
            
            if (!response.ok) {
              console.error(`Failed to save line item for product ${product.No}`);
              return { success: false, product: product.No };
            }
            
            const data = await response.json();
            return { success: true, product: product.No, data };
          } catch (err) {
            console.error(`Error saving line item for product ${product.No}:`, err);
            return { success: false, product: product.No };
          }
        })
      );
      
      const successCount = savedItems.filter(item => item.success).length;
      setLineItemsStatus({
        success: successCount,
        failed: products.length - successCount,
        total: products.length
      });
      
      return successCount === products.length;
    } catch (err) {
      console.error('Error saving quote line items:', err);
      return false;
    } finally {
      setSavingLineItems(false);
    }
  };

  // Function to create quote
  const createQuote = async () => {
    if (!selectedClient || products.length === 0) return;
    
    setIsCreatingQuote(true);
    setError(null);
    
    try {
      // Prepare the quote data according to the API requirements
      const quoteData = {
        Sell_to_Customer_No: selectedClient.No,
        Salesperson_code: "AKIOKO",
        Responsibility_Center: "21010",
        Assigned_User_ID: "AKIOKO"
      };
      
      // Send the data to the API endpoint
      const response = await fetch('http://127.0.0.1:8000/erp/sales-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quoteData)
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle the successful response
      if (data && data.status === 'success') {
        setQuoteCreated(data.data);
        
        // After quote is created, save the line items
        await saveQuoteLineItems(data.data.No);
        
        console.log('Quote created successfully:', data);
      } else {
        throw new Error('Failed to create quote');
      }
    } catch (err) {
      setError('Failed to create quote. Please try again.');
      console.error('Error creating quote:', err);
    } finally {
      setIsCreatingQuote(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  // Render quote created success message
  const renderQuoteCreatedMessage = () => {
    if (!quoteCreated) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Quote Created Successfully</h3>
            <button 
              onClick={() => setQuoteCreated(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-green-600 font-medium mb-2">Your quote has been created successfully!</p>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-sm mb-1"><span className="font-medium">Quote Number:</span> {quoteCreated.No}</p>
              <p className="text-sm mb-1"><span className="font-medium">Reference:</span> {quoteCreated.Reference}</p>
              <p className="text-sm mb-1"><span className="font-medium">Valid Until:</span> {new Date(quoteCreated.Quote_Valid_Until_Date).toLocaleDateString()}</p>
              <p className="text-sm"><span className="font-medium">Customer:</span> {quoteCreated.Sell_to_Customer_Name}</p>
            </div>
            
            {lineItemsStatus && (
              <div className="mt-3">
                <p className="text-sm">
                  <span className="font-medium">Products added: </span> 
                  {lineItemsStatus.success} of {lineItemsStatus.total} successful
                  {lineItemsStatus.failed > 0 && (
                    <span className="text-orange-500"> ({lineItemsStatus.failed} failed)</span>
                  )}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              onClick={() => {
                setQuoteCreated(null);
                setProducts([]);
                setSelectedClient(null);
                setNotes('');
                setLineItemsStatus(null);
                // Additional actions could be added here, such as redirecting to a new page
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-orange-500 mr-2">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              </div>
            </div>
            <span className="font-bold text-lg">AI Solar Water Assistant</span>
          </div>
          
          <nav className="flex items-center space-x-4">
            <a 
              href="/assessment-dashboard" 
              className="px-3 py-2 text-gray-600 hover:text-gray-900 flex items-center"
            >
              <span>Triage & Sizing</span>
            </a>
            <a 
              href="/assessment-dashboard" 
              className="px-3 py-2 text-gray-600 hover:text-gray-900 flex items-center"
            >
              <span>Future Expansion</span>
            </a>
            <a 
              href="/quote1" 
              className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center"
            >
              <span>Sales Quote</span>
            </a>
            <a 
              href="/proposal-generation" 
              className="px-3 py-2 text-gray-600 hover:text-gray-900 flex items-center"
            >
              <span>Proposals</span>
            </a>
          </nav>
          <div className="flex items-center">
            <span className="text-gray-700">John Doe</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Sales Quote</h1>
          <p className="text-gray-600">Create a sales quote for your client by selecting products and quantities.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-1">Client Information</h2>
              <p className="text-gray-600 text-sm mb-4">Select the client for this quote</p>
              
              {selectedClient ? (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{selectedClient.Name}</h3>
                      <p className="text-gray-600 text-sm">Client ID: {selectedClient.No}</p>
                      <p className="text-gray-600 text-sm">Phone: {selectedClient.Phone_No}</p>
                      {selectedClient.E_Mail && (
                        <p className="text-gray-600 text-sm">Email: {selectedClient.E_Mail}</p>
                      )}
                    </div>
                    <button 
                      onClick={() => setSelectedClient(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex mb-2">
                    <input 
                      type="text" 
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md" 
                      placeholder="Search by phone number (e.g., 254768372439)"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchClient()}
                    />
                    <button 
                      className="px-4 py-2 bg-gray-700 text-white rounded-r-md hover:bg-gray-600 flex items-center"
                      onClick={searchClient}
                      disabled={loading}
                    >
                      {loading ? 'Searching...' : <Search size={18} />}
                    </button>
                  </div>
                  
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                  
                  {searchResults && searchResults.length > 0 ? (
                    <div className="mt-3 border border-gray-200 rounded-md">
                      {searchResults.map((client, index) => (
                        <div 
                          key={index} 
                          className={`p-3 hover:bg-gray-50 cursor-pointer ${index > 0 ? 'border-t border-gray-200' : ''}`}
                          onClick={() => selectClient(client)}
                        >
                          <h4 className="font-medium">{client.Name}</h4>
                          <p className="text-gray-600 text-sm">Client ID: {client.No}</p>
                          <p className="text-gray-600 text-sm">Phone: {client.Phone_No}</p>
                        </div>
                      ))}
                    </div>
                  ) : searchResults && searchResults.length === 0 ? (
                    <p className="text-gray-500 mt-2">No clients found with that phone number</p>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Quote Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-1">Quote Details</h2>
              <p className="text-gray-600 text-sm mb-4">Reference and notes</p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-32" 
                  placeholder="Add any additional notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quote Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">Quote Items</h2>
              <p className="text-gray-600 text-sm">Add products to your quote</p>
            </div>
            <button 
              className="flex items-center px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
              onClick={() => setIsAddingProduct(true)}
              disabled={isAddingProduct}
            >
              <Plus size={16} className="mr-1" />
              Add Product
            </button>
          </div>

          {isAddingProduct && (
            <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Add Product</h3>
                <button 
                  onClick={() => {
                    setIsAddingProduct(false);
                    setSelectedProduct(null);
                    setProductSearch('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex mb-3">
                <input 
                  type="text" 
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md" 
                  placeholder="Search by product number (e.g., DSD200)"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchProduct()}
                />
                <button 
                  className="px-4 py-2 bg-gray-700 text-white rounded-r-md hover:bg-gray-600 flex items-center"
                  onClick={searchProduct}
                  disabled={loading}
                >
                  {loading ? 'Searching...' : <Search size={18} />}
                </button>
              </div>
              
              {error && <p className="text-red-500 text-sm mt-1 mb-2">{error}</p>}
              
              {selectedProduct && (
                <div className="mt-2 mb-3">
                  <div className="bg-white p-3 border border-gray-200 rounded-md">
                    <h4 className="font-medium">{selectedProduct.Description}</h4>
                    <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                      <p>Product ID: <span className="font-medium">{selectedProduct.No}</span></p>
                      <p>Category: <span className="font-medium">{selectedProduct.Item_Category_Code}</span></p>
                      <p>Model: <span className="font-medium">{selectedProduct.Product_Model}</span></p>
                      <p>Unit Price: <span className="font-medium">{formatCurrency(selectedProduct.Unit_Price)}</span></p>
                      <p>Retail Price: <span className="font-medium">{formatCurrency(selectedProduct.Retail_Price)}</span></p>
                      <p>Standard Cost: <span className="font-medium">{formatCurrency(selectedProduct.Standard_Cost)}</span></p>
                    </div>
                    
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input 
                        type="number" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                        value={quantity}
                        min="1"
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                      onClick={addProductToQuote}
                    >
                      Add to Quote
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {products.length === 0 && !isAddingProduct ? (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
              <div className="flex justify-center mb-4">
                <ShoppingCart size={48} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No products added yet</h3>
              <p className="text-gray-500 mt-2 mb-6">Click the "Add Product" button to search for products and add them to your quote.</p>
              <button 
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded mx-auto hover:bg-gray-700"
                onClick={() => setIsAddingProduct(true)}
              >
                <Plus size={16} className="mr-1" />
                Add Product
              </button>
            </div>
          ) : products.length > 0 ? (
            <div className="products-list mt-4">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.No}</div>
                          <div className="text-xs text-gray-500">{product.Item_Category_Code} / {product.Product_Model}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{product.Description}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900">{formatCurrency(product.Unit_Price)}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">{product.quantity}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(product.totalPrice)}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <button 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeProduct(index)}
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td colSpan="4" className="px-4 py-3 text-right font-medium">Total Amount:</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(totalAmount)}</td>
                      <td className="px-4 py-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : null}

          <div className="flex justify-end mt-6 space-x-4">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              Save as Draft
            </button>
            <button 
              className="flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              disabled={!selectedClient || products.length === 0 || isCreatingQuote || savingLineItems}
              onClick={createQuote}
            >
              <FileText size={16} className="mr-1" />
              {isCreatingQuote || savingLineItems ? 'Processing...' : 'Create Quote'}
            </button>
          </div>
        </div>
      </main>

      {/* Quote Created Modal */}
      {quoteCreated && renderQuoteCreatedMessage()}
    </div>
  );
}