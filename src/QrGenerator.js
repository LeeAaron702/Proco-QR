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
        setModelNumber(value.trim());
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
      downloadLink.download = `SKU_${modelNumber}-ID_${ID}-VariantId_${variantId}.png`;
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
      console.log("🚀 ~ file: QrGenerator.js:72 ~ fetchProductDetails ~ data:", data)

      if (data) {
        setProductTitle(data.productTitle);
        setVariantId(data.variantId);
        setShopifyLink(`https://www.professorcolor.com/products/${data.handle}`)
        setModelNumber(data.modelNumber)
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
  };

  const handleClear = () => {
    setProductTitle("");
    setModelNumber("");
    setShopifyLink("");
    setAmazonLink("");
    setID("");
    setVariantId("");
    setQrCodeUrl("");
  };

  return (
    <div className="container">
      <div className="card mt-3">
        <div className="card-body">
          <div className="row">
              <div className="col-md-3">
                <img src="./pc_1.png" alt="Logo" className="img-fluid mt-3 ms-3" /> {/*Replace this path with your logo path*/}
              </div>
              <div className="col-md-9">
                <h1 className="display-2 text-center">ProCo QR Code Generator</h1>
              </div>
            <form onSubmit={handleSubmit}>
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
              <fieldset disabled>

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
              </fieldset>

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
              <p className="small mb-1">Please use OEM Model Number / SKU</p>


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
              <p className="small mb-1">Please use 'Copy Link' button within 'More Actions' on the Admin Product Page and paste it into this field.</p>

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
              <p className="small mb-1">Please search for the product within Amazon, once identified, use the share item button that is in the top
                right of the product photos and paste it into this field.</p>

            </form>
            <div className="d-flex justify-content-between mt-2">
              <button onClick={handleSubmit} className="btn btn-primary">
                Generate QR Code
              </button>
              <button type="button" onClick={handleDownload} className="btn btn-success">
                Download QR Code
              </button>
              <button type="button" onClick={handleClear} className="btn btn-secondary">
                Clear
              </button>
            </div>
            <p className="small mb-2"> {qrCodeUrl} </p>
            {qrCodeUrl && (
              <div ref={qrCodeRef} className="d-flex justify-content-center">
                <QRCode value={qrCodeUrl} size={500} level={"H"} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRCodeGenerator;
