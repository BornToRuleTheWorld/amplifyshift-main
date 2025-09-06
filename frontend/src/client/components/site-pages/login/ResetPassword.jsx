import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useHistory } from "react-router-dom";
import Header from './loginHeader';
import SiteFooter from "../home/footer";
import {AUTH_TOKEN, API_BASE_URL} from '../config'
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";

const ResetPassword = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const { uidb64, token } = useParams();
  const history = useHistory();

  useEffect(() => {
    document.body.classList.add("account-page");
    return () => document.body.classList.remove("account-page");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setMessage("");

    if (!password || !confirmPassword) {
      setStatus("error");
      setMessage("Both password fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    try {

        const response = await axios.post(`${API_BASE_URL}/PasswordResetConfirm/${uidb64}/${token}/`, { "password" : password }, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
            }
        });
    
      setStatus("success");
      setMessage(
        response.data?.Message || "Password has been reset successfully."
      );

      // Redirect to login after short delay
      setTimeout(() => {
        history.push("/site-login");
      }, 2000);
    } catch (error) {
      if (error.response) {
        setStatus("error");
        setMessage(
          error.response.data?.Error ||
            error.response.data?.message ||
            "Invalid or expired reset link."
        );
      } else {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    }finally{
        setPassword('')
        setConfirmPassword('')
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
                    <ImageWithBasePath
                      src="assets/img/as-login.jpg"
                      className="img-fluid"
                      alt="Doccure Login"
                    />
                  </div>
                  <div className="col-md-12 col-lg-6 login-right">
                    <div className="login-header">
                      <h3>Set New Password</h3>
                      <p className="small text-muted">
                        Enter and confirm your new password
                      </p>
                    </div>

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
                          type="password"
                          className="form-control floating"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label className="focus-label">New Password</label>
                      </div>

                      <div className="form-group form-focus">
                        <input
                          type="password"
                          className="form-control floating"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <label className="focus-label">
                          Confirm New Password
                        </label>
                      </div>

                      <div className="text-end">
                        <Link className="forgot-link" to="/login">
                          Back to login
                        </Link>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 btn-lg login-btn"
                      >
                        Set New Password
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

export default ResetPassword;
