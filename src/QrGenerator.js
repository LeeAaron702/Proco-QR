import React, { useState } from "react";
import QRCode from "qrcode.react";

function QRCodeGenerator() {
  const [productTitle, setProductTitle] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [shopifyLink, setShopifyLink] = useState("");
  const [amazonLink, setAmazonLink] = useState("");
  const [amazonSKU, setAmazonSKU] = useState("");
  const [ID, setID] = useState("");
  const [variantId, setVariantId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const baseUrl = "https://proco-qr.vercel.app/";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "productTitle":
        setProductTitle(value);
        break;
      case "modelNumber":
        setModelNumber(value);
        break;
      case "shopifyLink":
        setShopifyLink(value);
        break;
      case "amazonLink":
        setAmazonLink(value);
        break;
      case "amazonSKU":
        setAmazonSKU(value);
        break;
      case "ID":
        setID(value);
        break;
      default:
        break;
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const res = await fetch(`/api/fetch-product-details?productId=${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch product details.");
      }
  
      const data = await res.json();
      console.log("🚀 ~ file: QrGenerator.js:55 ~ fetchProductDetails ~ data:", data);
      console.log(data.variantId);
  
      if (data.product) {
        setProductTitle(data.title);
        setVariantId(data.variantId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    if (ID) {
      fetchProductDetails(ID);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      productTitle,
      modelNumber,
      shopifyLink,
      amazonLink,
      amazonSKU,
      ID,
      variantId,
    };
    const serializedData = encodeURIComponent(JSON.stringify(productData));
    const fullUrl = `${baseUrl}?data=${serializedData}`;
    setQrCodeUrl(fullUrl);
  };
  
    return (
      <div className="container">
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="mb-3">
              <div className="form-group">
                <label htmlFor="ID">Shopify Product ID:</label>
                <div className="input-group">
                  <input type="text" id="ID" className="form-control" name="ID" value={ID} onChange={handleInputChange} />
                  <div className="input-group-append">
                    <button type="button" className="btn btn-primary" onClick={handleSearch}>Search</button>
                  </div>
                </div>
              </div>
  
              <div className="form-group">
                <label htmlFor="variantId">Variant ID:</label>
                <input
                  type="text"
                  id="variantId"
                  className="form-control"
                  name="variantId"
                  value={variantId}
                />
              </div>
              <div className="form-group">
                <label htmlFor="productTitle">Product Title:</label>
                <input
                  type="text"
                  id="productTitle"
                  className="form-control"
                  name="productTitle"
                  value={productTitle}
                   
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="modelNumber">Model Number:</label>
                <input
                  type="text"
                  id="modelNumber"
                  className="form-control"
                  name="modelNumber"
                  value={modelNumber}
                   
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="shopifyLink">Shopify Link:</label>
                <input
                  type="text"
                  id="shopifyLink"
                  className="form-control"
                  name="shopifyLink"
                  value={shopifyLink}
                   
                />
              </div>

            <div className="form-group">
              <label htmlFor="amazonLink">Amazon Link:</label>
              <input
                type="text"
                id="amazonLink"
                className="form-control"
                name="amazonLink"
                value={amazonLink}
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
                value={amazonSKU}
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
