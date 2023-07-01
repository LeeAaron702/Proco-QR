import React, { useState } from "react";
import QRCode from "qrcode.react";

function QRCodeGenerator() {
  const [productData, setProductData] = useState({
    productTitle: "",
    modelNumber: "",
    shopifyLink: "",
    amazonLink: "",
    amazonSKU: "",
    ID: "",
    variantId: "",
  });

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const baseUrl = "https://proco-qr.vercel.app/";

  const handleInputChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchProductDetails = async (productId) => {
    try {
      const res = await fetch(
        `/api/fetch-product-details?productId=${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch product details.");
      }

      const data = await res.json();
      console.log("🚀 ~ file: QrGenerator.js:42 ~ fetchProductDetails ~ data:", data)

      if (data.product) {
        setProductData({
          ...productData,
          productTitle: data.product.title,
          variantId: data.product.variantId,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    if (productData.ID) {
      fetchProductDetails(productData.ID);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
                  <input type="text" id="ID" className="form-control" name="ID" value={productData.ID} onChange={handleInputChange} />
                  <div className="input-group-append">
                    <button type="button" className="btn btn-primary" onClick={handleSearch}>Search</button>
                  </div>
                </div>
              </div>
  
              <div className="form-group">
                <label htmlFor="variantId">Product Title:</label>
                <input
                  type="text"
                  id="variantId"
                  className="form-control"
                  name="variantId"
                  value={productData.variantId}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="productTitle">Product Title:</label>
                <input
                  type="text"
                  id="productTitle"
                  className="form-control"
                  name="productTitle"
                  value={productData.productTitle}
                  readOnly
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
                  readOnly
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
                  readOnly
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
