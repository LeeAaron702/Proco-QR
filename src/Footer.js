import React from "react";

function Footer() {
  return (
    <footer className="footer bg-light py-4 mt-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <ul className="list-inline footer-nav">
              <li className="list-inline-item">
                <a href="https://www.professorcolor.com/" className="footer-link" target="_blank" rel="noopener noreferrer">
                  Professor Color Home
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://www.professorcolor.com/pages/about-us" className="footer-link" target="_blank" rel="noopener noreferrer">
                  About Us
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://www.professorcolor.com/pages/privacy-policy" className="footer-link" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="footer-text mb-0">
              <a href="https://www.professorcolor.com/pages/ccpa-opt-out" className="footer-link" target="_blank" rel="noopener noreferrer">
                Click here to request your data to be deleted
              </a>
            </p>
          </div>
        </div>
      </div>
      <style>{`
        .footer-link {
          color: #333;
          text-decoration: none;
          transition: color 0.3s;
          margin-right: 10px; /* Added spacing between list items */
        }

        .footer-link:hover {
          color: #777;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
