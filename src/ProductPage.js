import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import ReviewModal from "./Modals/ReviewModal";
import InstantReplacementModal from "./Modals/InstantReplacementModal";

function ProductPage({ data }) {
  const [IRshow, setIRShow] = useState(false);


  const [shopifyID, setShopifyID] = useState('')
  const [variantId, setVariantId] = useState('');
  const [pictureUrl, setPictureUrl] = useState('')
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const [showReviewModal, setShowReviewModal] = useState(false)

  const handleReviewModalOpen = () => setShowReviewModal(true)
  const handleReviewModalClose = () => setShowReviewModal(false)



  useEffect(() => {
    if (data) {
      setShopifyID(data.ID);
      setVariantId(data.variantId);
      setPictureUrl(data.pictureURL)
    }
  }, [data]);

  const handleIRMClose = () => {
    setIRShow(false);
    // clearForm();
  };

  const handleIRMShow = () => setIRShow(true);



  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 30000); // 30000 milliseconds = 30 seconds

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);



  if (!data) {
    return (
      <div className="container mt-3">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <img src="./pc_1.png" alt="Logo" className="img-fluid mt-3" />
          </div>
          <div className="col-md-8">
            <div className="alert alert-warning text-center" role="alert">
              <h4 className="alert-heading">Oops!</h4>
              <p>
                It looks like the link you're trying to visit might be broken.
              </p>
              <hr />
              <p className="mb-0">
                For product support, please click on the button below.
              </p>
            </div>
            <div className="d-grid gap-2">
              <a href="https://professorcolor.onsitesupport.io/ticket/add" target="_blank" rel="noreferrer" className="btn btn-danger btn-lg">
                Submit A Help Ticket
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card mt-1 mb-1">
        <div className="card-body">
          <div className="row mb-0">
            <div className="col-md-6 d-flex justify-content-center align-items-center">
              <img src="./pc_1.png" alt="Logo" className="img-fluid d-block mx-auto" style={{ width: "250px", maxWidth: "100%" }} />
            </div>
            <div className="col-md-6 d-flex align-items-center justify-content-center">
              <h1 className="card-title display-5 text-center">{data.modelNumber}</h1>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            {pictureUrl && (
              <img
                src={pictureUrl}
                alt="Logo"
                className="img-fluid d-block mx-auto"
                style={{
                  width: "250px",
                  maxWidth: "100%",
                }}
              />
            )}
          </div>
        </div>
        <div className="text-center">
          <p className="h4">{data.productTitle}</p>
        </div>
        <div className="text-center mb-3">
            <div className="mb-3">
              <a
                href={`https://www.amazon.com/review/create-review/?ie=UTF8&channel=glance-detail&asin=${data.amazonASIN}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-lg"
              >
                Leave a review on Amazon
              </a>
            </div>
            <div className="mb-3">
              {data.shopifyLink &&
                <a href={data.shopifyLink} target="_blank" rel="noreferrer" className="btn btn-success btn-lg">Purchase Directly From Us and Save</a>
              }
            </div>
            <div className="mb-3">
              {data.amazonASIN && (
                <a
                  href={`https://www.amazon.com/dp/${data.amazonASIN}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-lg"
                >
                  Go to Amazon Sales Page
                </a>
              )}
            </div>
            <div className="mb-3">
              <a href="https://professorcolor.onsitesupport.io/ticket/add" target="_blank" rel="noreferrer" className="btn btn-danger btn-lg">Submit A Help Ticket</a>
            </div>
            <div className="mb-3">
              {data.variantId &&
                <Button className="btn btn-warning btn-lg" onClick={handleIRMShow}>
                  Instant Replacement
                </Button>
              }
            </div>
        </div>
      </div>
      <InstantReplacementModal
        handleIRMClose={handleIRMClose}
        handleIRMShow={handleIRMShow}
        variantId={variantId}
        shopifyID={shopifyID}
        setErrorMessage={setErrorMessage}
        setSuccessMessage={setSuccessMessage}
        show={IRshow}
      />
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default ProductPage;

  