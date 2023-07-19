import React from 'react';
import { Modal } from 'react-bootstrap';

const ReviewModal = ({ showReviewModal, handleReviewModalClose }) => {
    return (
        <Modal show={showReviewModal} onHide={handleReviewModalClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="w-100 text-center">Please Select</Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex flex-column align-items-center">
                <a href="http://amazon.com/review" target="_blank" rel="noreferrer" className="btn btn-primary btn-lg mb-3">
                    Leave a review on Amazon
                </a>
                <a href="http://google.com/review" target="_blank" rel="noreferrer" className="btn btn-lg btn-success">
                    Leave a review on Google
                </a>
            </Modal.Body>
        </Modal>
    );
}

export default ReviewModal;
