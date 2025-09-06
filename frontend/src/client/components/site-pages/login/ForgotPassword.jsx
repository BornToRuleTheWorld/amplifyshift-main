import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from './loginHeader';
import SiteFooter from "../home/footer";
import {AUTH_TOKEN, API_BASE_URL} from '../config'

const SiteForgotPassword = (props) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // success or error
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.body.classList.add("account-page");
    return () => document.body.classList.remove("account-page");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setMessage("");

    try {
        const response = await axios.post(`${API_BASE_URL}/ForgotPassword/`, {'email':email}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
          }
        });

      setStatus("success");
      setMessage(
        response.data?.Message || "Password reset link sent to your email."
      );
    } catch (error) {
      if (error.response) {
        setStatus("error");
        setMessage(
          error.response.data?.Error ||
            error.response.data?.message ||
            "Something went wrong. Please try again."
        );
      } else {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    }finally{
        setEmail('')
    }
  };

  return (
    <>
      <Header {...props} />
       <>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="account-content">
                <div className="row align-items-center justify-content-center">
                  <div className="col-md-7 col-lg-6 login-left">
                    <img
                      src="assets/img/as-login.jpg"
                      className="img-fluid"
                      alt="Login Banner"
                    />
                  </div>
                  <div className="col-md-12 col-lg-6 login-right">
                    <div className="login-header">
                      <h3>Forgot Password?</h3>
                      <p className="small text-muted">
                        Enter your email to get a password reset link
                      </p>
                    </div>

                    {/* Show message */}
                    {status && (
                      <div
                        className={`alert ${
                          status === "success"
                            ? "alert-success"
                            : "alert-danger"
                        }`}
                      >
                        {message}
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="form-group form-focus">
                        <input
                          type="email"
                          className="form-control floating"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label className="focus-label">Email</label>
                      </div>
                      <div className="text-end">
                        <Link className="forgot-link" to="/site-login">
                          Remember your password?
                        </Link>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary w-100 btn-lg login-btn"
                      >
                        Reset Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              {/* /Account Content */}
            </div>
          </div>
        </div>
      </div>
      </>
      <SiteFooter {...props} />
    </>
  );
};

export default SiteForgotPassword;
