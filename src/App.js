import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductPage from './ProductPage';
import PasswordProtectedComponent from "./Password";
import Footer from "./Footer";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serializedData = params.get('data');

    if (serializedData) {
      const data = JSON.parse(decodeURIComponent(serializedData));
      setData(data);
    }
  },[]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductPage data={data}/>} />
        <Route path="/qr-generator" element={<PasswordProtectedComponent />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
