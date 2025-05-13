import { useState } from 'react';
import Context from './Context';

const ContextProvider = ({ children }) => {
  const [data, setData] = useState(null);
  
  const updateData = (newData) => {
    setData(newData);
  };

  return (
    <Context.Provider value={{ data, updateData }}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;