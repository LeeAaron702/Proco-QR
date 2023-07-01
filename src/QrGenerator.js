import React, { useState, useRef } from "react";
import QRCode from "qrcode.react";

function QRCodeGenerator() {
  const [productData, setProductData] = useState({
    productTitle: "",
    modelNumber: "",
    shopifyLink: "",
    amazonLink: "",
    amazonSKU: "",
    ID: "",
  });
  const adminBaseUrl = process.env.SHOPIFY_URL;

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [variantId, setVariantId] = useState(null);
  const timeoutRef = useRef(null); // New reference to store timeout id

  const baseUrl = "https://proco-qr.vercel.app/";

  const handleInputChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchVariantId = async (productId) => {
    try {
      const res = await fetch(
        `${adminBaseUrl}/api/fetch-variant-id?productId=${productId}`,
        {
          headers: {
            "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.variantId) {
        setVariantId(data.variantId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    if (productData.ID) {
      fetchVariantId(productData.ID);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const serializedData = encodeURIComponent(JSON.stringify(productData));
    const fullUrl = `${baseUrl}?data=${serializedData}`;
    setQrCodeUrl(fullUrl);
    console.log(
      "🚀 ~ file: QrGenerator.js:30 ~ handleSubmit ~ fullUrl:",
      fullUrl
    );
  };

  return (
    <div className="container">
    <div className="card">
      <div className="card-body">
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="form-group">
            <label htmlFor="ID">Shopify Product ID:</label>
            <div className="input-group">
              <input type="text" id="ID" className="form-control" name="ID" value={productData.ID} onChange={handleInputChange} />
              <div className="input-group-append">
                <button type="button" className="btn btn-primary" onClick={handleSearch}>Search</button>
              </div>
            </div>
          </div>

            <div className="form-group">
              <label htmlFor="productTitle">Product Title:</label>
              <input
                type="text"
                id="productTitle"
                className="form-control"
                name="productTitle"
                value={productData.productTitle}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="modelNumber">Model Number:</label>
              <input
                type="text"
                id="modelNumber"
                className="form-control"
                name="modelNumber"
                value={productData.modelNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="shopifyLink">Shopify Link:</label>
              <input
                type="text"
                id="shopifyLink"
                className="form-control"
                name="shopifyLink"
                value={productData.shopifyLink}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="amazonLink">Amazon Link:</label>
              <input
                type="text"
                id="amazonLink"
                className="form-control"
                name="amazonLink"
                value={productData.amazonLink}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="amazonSKU">Amazon SKU:</label>
              <input
                type="text"
                id="amazonSKU"
                className="form-control"
                name="amazonSKU"
                value={productData.amazonSKU}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Generate QR Code
            </button>
          </form>

          {qrCodeUrl && <QRCode value={qrCodeUrl} size={1000} level={"H"} />}
        </div>
      </div>
    </div>
  );
}

export default QRCodeGenerator;
