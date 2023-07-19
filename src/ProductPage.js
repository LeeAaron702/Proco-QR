import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from 'react-bootstrap';

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
  const [shopifyID, setShopifyID] = useState('')
  const [variantId, setVariantId] = useState('');
  const [pictureUrl, setPictureUrl] = useState('')
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [autocompleteResults, setAutocompleteResults] = useState([]);


  useEffect(() => {
    if (data) {
      setShopifyID(data.ID);
      setVariantId(data.variantId);
      setPictureUrl(data.pictureURL)
    }
  }, [data]);

  const handleClose = () => {
    setShow(false);
    clearForm();
  };

  const handleShow = () => setShow(true);


  const instantReplacement = async () => {
    const response = await fetch('/api/InstantReplacement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        email: email.trim(),
        address1,
        address2,
        city,
        state,
        zipcode,
        shopifyID,
        variantId
      }),
    });

    if (response.ok) {
      handleClose()
      setSuccessMessage('Instant replacement created successfully.');
    } else {
      const errorData = await response.json();
      handleClose()
      setErrorMessage(errorData.message);
      setSuccessMessage('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    instantReplacement();
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
    setAutocompleteResults([])
  };


  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 30000); // 30000 milliseconds = 30 seconds

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);


  function useDebounce(fn, delay) {
    let timeoutRef = useRef(null);

    function debouncedFn(...args) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        fn(...args);
      }, delay);
    }

    return debouncedFn;
  }

  const debouncedAutoComplete = useDebounce(async (query) => {
    if (query) {
      try {
        const response = await fetch('/api/autocomplete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ input: query }),
        });
        console.log("🚀 ~ file: ProductPage.js:127 ~ debouncedAutoComplete ~ query:", query)

        if (response.ok) {
          const data = await response.json();
          setAutocompleteResults(data.predictions);
          console.log("Response data:", data);

        } else {
          console.error('Response not OK', response);
        }
      } catch (error) {
        console.error('Error fetching autocomplete results', error);
      }
    }
  }, 500);

  // Function to handle change in address field
  const handleAddressChange = (e) => {
    setAddress1(e.target.value);
    debouncedAutoComplete(e.target.value.trim());
  };

  // Function to handle autocomplete result selection
  const handleAutocompleteSelect = (result) => {
    const { structured_formatting } = result;
    setAddress1(structured_formatting.main_text);

    const [city = '', state = ''] = structured_formatting.secondary_text.split(', ');
    setCity(city.trim());
    setState(state.trim());

    // Clear autocomplete results
    setAutocompleteResults([]);
  };






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
      <div className="card mt-3">
        <div className="card-body">
          <div className="row mb-0">
          <div className="col-md-3 d-flex justify-content-center align-items-center"> 
              <img src="./pc_1.png" alt="Logo" className="img-fluid" style={{width: "250px"}}/>
            </div>
            <div className="col-md-9">
              <h1 className="card-title display-2 text-center">Professor Color</h1>
              <h1 className="card-title display-5 text-center">{data.modelNumber}</h1>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            {pictureUrl &&
              <img src={pictureUrl} alt="Logo" className="img-fluid" style={{ width: "250px" }} />
            }
          </div>
        </div>
        <div className="text-center">
          <p className="h4">{data.productTitle}</p>
        </div>
        <div className="button-container text-center">
          <div className="mb-3">
            {data.shopifyLink &&
              <a href={data.shopifyLink} target="_blank" rel="noreferrer" className="btn btn-success btn-lg">Purchase Directly From Us and Save</a>
            }
          </div>
          <div className="mb-3">
            {data.amazonLink &&
              <a href={data.amazonLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-lg">Go to Amazon Sales Page</a>
            }
          </div>
          <div className="mb-3">
            <a href="https://professorcolor.onsitesupport.io/ticket/add" target="_blank" rel="noreferrer" className="btn btn-danger btn-lg">Submit A Help Ticket</a>
          </div>
          <div>
            {data.variantId &&
              <Button className="btn btn-warning mb-3 btn-lg" onClick={handleShow}>
                Instant Replacement
              </Button>
            }
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} className="modal-fixed">
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Instant Replacement Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="formFirstName"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={(e) => setFirstName(e.target.value.trim())}
                autoComplete="given-name"
                required
              />
              <label htmlFor="formFirstName">First Name</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="formLastName"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={(e) => setLastName(e.target.value.trim())}
                autoComplete="family-name"
                required
              />
              <label htmlFor="formLastName">Last Name</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="formPhone"
                placeholder="Enter phone"
                value={phone}
                onChange={(e) => {
                  if ((/^\d+$/.test(e.target.value) && e.target.value.length <= 10) || e.target.value === '') {
                    setPhone(e.target.value);
                  }
                }}
                autoComplete="tel"
                required
                pattern="\d{10}"
                onInput={(e) => {
                  e.target.setCustomValidity('');
                  if (!e.target.validity.valid) {
                    if (e.target.value.length < 10) {
                      e.target.setCustomValidity('Please enter a valid 10-digit phone number.');
                    }
                  }
                }}
              />
              <label htmlFor="formPhone">Phone</label>
            </div>

            <div className="form-floating mb-3">
              <input type="email" className="form-control" id="formEmail" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
              <label htmlFor="formEmail">Email</label>
            </div>


            <div className="form-floating mb-3 position-relative">
              <input
                type="text"
                className="form-control"
                id="formAddress1"
                placeholder="Enter address 1"
                value={address1}
                onChange={handleAddressChange}
                autoComplete="address-line1"
                required
              />
              <label htmlFor="formAddress1">Address 1</label>

              <div className={`dropdown-menu w-auto ${autocompleteResults.length > 0 ? 'show' : ''}`} style={{ maxWidth: '90vw' }}>
                {/* Display autocomplete results */}
                {autocompleteResults.map((result, index) => (
                  <div
                    key={index}
                    className="dropdown-item text-wrap w-100"
                    onClick={() => handleAutocompleteSelect(result)}
                  >
                    {result.description}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="formAddress2"
                placeholder="Enter address 2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                onBlur={(e) => setAddress2(e.target.value.trim())}
                autoComplete="address-line2"
              />
              <label htmlFor="formAddress2">Address 2</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="formCity"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={(e) => setCity(e.target.value.trim())}
                autoComplete="address-level2"
                required
              />
              <label htmlFor="formCity">City</label>
            </div>
            <div className="form mb-3">
              <select
                className="form-control"
                id="formState"
                value={state}
                onChange={(e) => setState(e.target.value)}
                autoComplete="address-level1"
                required
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
              <input
                type="text"
                className="form-control"
                id="formZipcode"
                placeholder="Enter zipcode"
                value={zipcode}
                onChange={(e) => {
                  if ((/^\d+$/.test(e.target.value) && e.target.value.length <= 5) || e.target.value === '') {
                    setZipcode(e.target.value);
                  }
                }}
                autoComplete="postal-code"
                required
                pattern="\d{5}"
                onInput={(e) => {
                  e.target.setCustomValidity('');
                  if (!e.target.validity.valid) {
                    if (e.target.value.length < 5) {
                      e.target.setCustomValidity('Please enter a valid 5-digit zipcode.');
                    }
                  }
                }}
              />
              <label htmlFor="formZipcode">Zipcode</label>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <small className="text-muted">
              We are collecting this information to process your instant replacement request and to improve our services. Your data will not be used for any other purpose.
            </small>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit for Instant Replacement
            </Button>
          </Modal.Footer>
        </form>
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