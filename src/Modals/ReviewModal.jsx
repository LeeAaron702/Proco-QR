import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';

const preventDefault = (event) => {
  event.preventDefault();
};

const ReviewModal = ({ showReviewModal, handleReviewModalClose, amazonASIN }) => {
  useEffect(() => {
    const handleTouchMove = (event) => preventDefault(event);

    if (showReviewModal) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [showReviewModal]);

  return (
    <Modal show={showReviewModal} onHide={handleReviewModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Please Select</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center">
        <a
          href={`https://www.amazon.com/review/create-review/?ie=UTF8&channel=glance-detail&asin=${amazonASIN}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary btn-lg mb-3"
        >
          Leave a review on Amazon
        </a>
        <a
          href="http://google.com/review"
          target="_blank"
          rel="noreferrer"
          className="btn btn-lg btn-success"
        >
          Leave a review on Google
        </a>
      </Modal.Body>
    </Modal>
  );
};

export default ReviewModal;
