import React from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import Cursor from "../../common/cursor/cursor";
import ProgressButton from "../../common/progress/progress";

const SiteFooter = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="footer footer-three">
        {/* Footer Top */}
        <div className="footer-top">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                {/* Footer Widget */}
                <div className="footer-widget footer-about">
                  <div className="footer-logo">
                    {/* <ImageWithBasePath src="assets/img/footer-logo.png" alt="logo" /> */}
                    <h2 className="text-white">Amplify Shift</h2>
                  </div>
                  <div className="footer-about-content">
                    <p>
                      Empowering both workplaces and healthcare professionals through tailored online on-demand staffing solutions.
                      We connect talented professionals with dynamic organizations, ensuring seamless coordination, exceptional care, and fulfillment for all. Let us help you build strong partnerships and create a thriving workforce committed to excellence.
                    </p>
                    <div className="social-icon">
                      <ul>
                        <li>
                          {" "}
                          <Link to="#">
                            <i className="fa-brands fa-facebook" />
                          </Link>
                        </li>
                        <li>
                          {" "}
                          <Link to="#">
                            <i className="fab fa-twitter" />{" "}
                          </Link>
                        </li>
                        <li>
                          {" "}
                          <Link to="#">
                            <i className="fab fa-linkedin-in" />
                          </Link>
                        </li>
                        <li>
                          {" "}
                          <Link to="#">
                            <i className="fab fa-instagram" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* /Footer Widget */}
              </div>
              <div className="col-lg-3 col-md-6">
                {/* Footer Widget */}
                <div className="footer-widget footer-menu">
                  <h2 className="footer-title">Professionals</h2>
                  <ul>
                    <li>
                      <Link to="/job-search">Search for Facilities</Link>
                    </li>
                    <li>
                      <Link to="/site-login">Login</Link>
                    </li>
                    <li>
                      <Link to="/professional/register">Register</Link>
                    </li>
                    <li>
                      <Link to="#">Shifts/Calendar</Link>
                    </li>
                    <li>
                      <Link to="#">Dashboard</Link>
                    </li>
                  </ul>
                </div>
                {/* /Footer Widget */}
              </div>
              <div className="col-lg-3 col-md-6">
                {/* Footer Widget */}
                <div className="footer-widget footer-menu">
                  <h2 className="footer-title">Facilities</h2>
                  <ul>
                    <li>
                    <Link to="/professional-search">Search for Professionals</Link>
                    </li>
                    <li>
                      <Link to="/site-login">Login</Link>
                    </li>
                    <li>
                      <Link to="/facility/register">Register</Link>
                    </li>
                    <li>
                      <Link to="#">Shifts/Calendar</Link>
                    </li>
                    <li>
                    <Link to="#">Dashboard</Link>
                    </li>                                        
                  </ul>
                </div>
                {/* /Footer Widget */}
              </div>
              <div className="col-lg-3 col-md-6">
                {/* Footer Widget */}
                <div className="footer-widget footer-contact">
                  <h2 className="footer-title">Contact Us</h2>
                  <div className="footer-contact-info">
                    <div className="footer-address">
                      {" "}
                      <span>
                        <i className="fas fa-map-marker-alt" />
                      </span>
                      <p>
                        Philadelphia, PA
                      </p>
                    </div>
                    <p>
                      <i className="fa-solid fa-mobile-screen-button" />
                      +1 267 221 1016
                    </p>
                  </div>
                </div>
                {/* /Footer Widget */}
              </div>
            </div>
          </div>
        </div>
        {/* /Footer Top */}
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="container-fluid">
            {/* Copyright */}
            <div className="copyright">
              <div className="row">
                <div className="col-md-6 col-lg-6">
                  <div className="copyright-text">
                    <p className="mb-0">
                      Copyright © 2025 Amplify Shift. All Rights Reserved
                    </p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-6">
                  {/* Copyright Menu */}
                  <div className="copyright-menu">
                    <ul className="policy-menu">
                      <li>
                        <Link to="#">Terms and Conditions</Link>
                      </li>
                      <li>
                        <Link to="#">Policy</Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Copyright Menu */}
                </div>
              </div>
            </div>
            {/* /Copyright */}
          </div>
        </div>
        {/* /Footer Bottom */}
      </footer>
      {/* /Footer */}
      <ProgressButton />
      <Cursor/>
    </div>
  );
};

export default SiteFooter;
