import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductPage from './ProductPage';

function App() {
  const [data, setData] = useState(null);

  const testProductData = {
    productTitle: 'Professor Color Re-Coded Toner Cartridge Replacement for Phaser 7500 | 106R01436 - High Capacity Cyan (17,800 Pages)',
    modelNumber: '106R01436',
    shopifyLink: 'https://www.professorcolor.com/products/refurbished-toner-cartridge-replacement-for-xerox-phaser-7500-high-capacity-cyan-106r01436?utm_source=copyToPasteBoard&utm_medium=product-links&utm_content=web',
    amazonLink: 'https://a.co/d/2bh5aBj',
    amazonSKU: 'XRX14361D-C-USA1'
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serializedData = params.get('data');

    if (serializedData) {
      const data = JSON.parse(decodeURIComponent(serializedData));
      setData(data);
    } else {
      setData(testProductData);
    }
  },[]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductPage data={data}/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;