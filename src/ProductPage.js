import React, { useState } from "react";
import { Button, Modal, Form } from 'react-bootstrap';

function ProductPage({ data }) {
  const [show, setShow] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const handleClose = () => {
    setShow(false);
    clearForm();
  };

  const handleShow = () => setShow(true);

  const createCustomer = async () => {
    const response = await fetch('/api/createCustomer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        email,
        address1,
        address2,
        city,
        state,
        zipcode
      }),
    });

    if (response.ok) {
      handleClose()
      setSuccessMessage('Customer created successfully.');
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.message || 'Error creating customer.');
      setSuccessMessage('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createCustomer();
  };

  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setAddress1('');
    setAddress2('');
    setCity('');
    setState('');
    setZipcode('');
  };

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title display-4">QR CODE THINGY</h1>
              <p className="card-text">{data.productTitle}</p>
              <p className="card-text">Model Number: {data.modelNumber}</p>
              <a href={data.shopifyLink} target="_blank" rel="noreferrer" className="btn btn-primary">Go to Shopify sales page</a>
              <a href={data.amazonLink} target="_blank" rel="noreferrer" className="btn btn-secondary">Go to Amazon sales page</a>
              <a href="https://professorcolor.onsitesupport.io/ticket/add" target="_blank" rel="noreferrer" className="btn btn-danger">Submit A Help Ticket</a>
              <Button variant="primary" onClick={handleShow}>
                Instant Replacement
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-5"></div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Instant Replacement Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
              <input type="text" className="form-control" id="formFirstName" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <label htmlFor="formFirstName">First Name</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="formLastName" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <label htmlFor="formLastName">Last Name</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="formPhone" placeholder="Enter phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <label htmlFor="formPhone">Phone</label>
            </div>

            <div className="form-floating mb-3">
              <input type="email" className="form-control" id="formEmail" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <label htmlFor="formEmail">Email</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="formAddress1" placeholder="Enter address 1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
              <label htmlFor="formAddress1">Address 1</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="formAddress2" placeholder="Enter address 2" value={address2} onChange={(e) => setAddress2(e.target.value)} />
              <label htmlFor="formAddress2">Address 2</label>
            </div>

            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="formCity" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} />
              <label htmlFor="formCity">City</label>
            </div>
            <div className="form mb-3">
              <select
                className="form-control"
                id="formState"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="">Select state</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </select>
            </div>
            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="formZipcode" placeholder="Enter zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
              <label htmlFor="formZipcode">Zipcode</label>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit for Instant Replacement
          </Button>
        </Modal.Footer>
      </Modal>

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
