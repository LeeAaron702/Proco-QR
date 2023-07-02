import React, { useState, useRef } from "react";
import QRCode from "qrcode.react";

function QRCodeGenerator() {
  const [productTitle, setProductTitle] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [shopifyLink, setShopifyLink] = useState("");
  const [amazonLink, setAmazonLink] = useState("");
  const [ID, setID] = useState("");
  const [variantId, setVariantId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const qrCodeRef = useRef(null);


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
      case "ID":
        setID(value);
        break;
      default:
        break;
    }
  };

  const handleDownload = () => {
    if (!qrCodeRef.current) {
      return;
    }
    const canvas = qrCodeRef.current.querySelector("canvas");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${modelNumber}-${ID}-${variantId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
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

      if (data) {
        setProductTitle(data.productTitle);
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
      ID,
      variantId,
    };
    const serializedData = encodeURIComponent(JSON.stringify(productData));
    const fullUrl = `${baseUrl}?data=${serializedData}`;
    setQrCodeUrl(fullUrl);
    console.log("🚀 ~ file: QrGenerator.js:83 ~ handleSubmit ~ fullUrl:", fullUrl)
  };
  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="mb-3">
            <h1 className="display-1 text-center"> ProCo QR Code Generator</h1>
            <p></p>
            <div className="form-group">
              <label htmlFor="ID">Shopify Product ID:</label>
              <div className="input-group">
                <input
                  type="text"
                  id="ID"
                  className="form-control"
                  name="ID"
                  value={ID}
                  onChange={handleInputChange}
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
              <p className="small mb-1">Must use the search button for QR code to work</p>
            </div>

            <div className="form-group">
              <label htmlFor="variantId">Variant ID:</label>
              <input
                type="text"
                id="variantId"
                className="form-control"
                name="variantId"
                value={variantId}
                readOnly
              />
            </div>
            <p className="small mb-1">Must use the search button to populate Variant ID.</p>
            <p className="small mb-1">Without Variant ID, shopify cannot link to the product correctly.</p>

            <div className="form-group">
              <label htmlFor="productTitle">Product Title:</label>
              <input
                type="text"
                id="productTitle"
                className="form-control"
                name="productTitle"
                value={productTitle}
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
                value={modelNumber}
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
                value={shopifyLink}
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
                value={amazonLink}
                onChange={handleInputChange}
              />
            </div>

            <div className="d-flex justify-content-between mt-2">
              <button type="submit" className="btn btn-primary">
                Generate QR Code
              </button>

              <button onClick={handleDownload} className="btn btn-primary">
                Download QR Code
              </button>
            </div>

            <p> {qrCodeUrl} </p>
            {/* {qrCodeUrl && <QRCode value={qrCodeUrl} size={350} level={"H"} />} */}
            {qrCodeUrl && (
              <div ref={qrCodeRef}>
                <QRCode value={qrCodeUrl} size={350} level={"H"} />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}


export default QRCodeGenerator;
