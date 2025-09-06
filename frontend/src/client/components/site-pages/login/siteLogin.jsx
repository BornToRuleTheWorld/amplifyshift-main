import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import Header from "./header";
// import Footer from "./footer";
import Header from './loginHeader';
// import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import Footer from "./loginFooter";
import SiteFooter from "../home/footer";
import axios from "axios";
import { useLocation, Redirect, useHistory } from 'react-router-dom';
import {AUTH_TOKEN, API_BASE_URL} from '../config'

const SiteLoginContainer = (props) => {

  useEffect(() => {
    document.body.classList.add("account-page");

    return () => document.body.classList.remove("account-page");
  }, []);

  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
      if (location.state?.message) {
          setMessages(location.state.message);
          
          const timer = setTimeout(() => {
              setMessages('');
          }, 3000);
  
        return () => clearTimeout(timer);
      }
    }, [location]);

    const [formData, setFormData] = useState({
        email: '',
        password:'',
      });
    
    const [group, setGroup ] = useState(null)
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
    };
    

    const pageRedirect = (group) => {
      if (group){
        if (group === "Facility"){
          history.push('/facility/shifts')
        }else if (group === "Professional"){
          history.push('/professional/myshifts')
        }else{
          history.push('/site-user/dashboard')
        }
      }
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${API_BASE_URL}/VerifyLogin/`, formData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
          }
        });

        console.log('Auth User :', response.data);
        localStorage.setItem("logged_in", btoa(JSON.stringify(response.data)))
        localStorage.setItem("email", btoa(response.data.Result.Email))
        localStorage.setItem("group", btoa(response.data.Result.Group))
        localStorage.setItem("navigation", btoa(response.data.Result.Group))
        localStorage.setItem("userID", btoa(response.data.Result.UserID))
        localStorage.setItem("RecordID", btoa(response.data.Result.GroupUserID))
        
        setGroup(response.data.Result.Group)
      } catch (err) {
        console.error('Error:', err);
        if (err.response?.data?.Error?.ActivationLink) {
          setError(
            <div>
              Your account is not activated,&nbsp;
              <a 
                  href={`/send-activate-link/?link=${err.response.data.Error.ActivationLink}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
              >
              Please activate your account
              </a>
            </div>
          );
        } else {
          if (err.response?.data?.Error){
            for(var key in err.response.data.Error) {
              setError(err.response.data.Error[key]);
            }
          }else{
            setError("Incorrect username/password");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      pageRedirect(group)
    },[group])

  return (
    <>
      <Header {...props}/>

      <>
        {/* Page Content */}
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-8 offset-md-2">
                {/* Login Tab Content */}
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
                        <h3>
                          Login
                        </h3>
                        {error && <div className="text-danger mt-3 text-center">{error}</div>}
                        {messages && <div className="text-success mt-3 text-center"> {messages} </div>}      
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label className="form-label">E-mail</label>
                          <input type="text" className="form-control" name="email"  onChange={handleInputChange} required/>
                        </div>
                        <div className="mb-3">
                          <div className="form-group-flex">
                            <label className="form-label">Password</label>
                            <Link to="/forgot-password" className="forgot-link">
                              Forgot password?
                            </Link>
                          </div>
                          <div className="pass-group">
                            <input
                              type={isPasswordVisible ? "text" : "password"}
                              name = "password"
                              className="form-control pass-input-sub"
                              onChange={handleInputChange}
                              required
                            />
                            <span
                              className={`feather toggle-password-sub ${isPasswordVisible ? "feather-eye" : "feather-eye-off"
                                }`}
                              onClick={togglePasswordVisibility}
                            />
                          </div>
                        </div>
                        <div className="mb-3 form-check-box">
                          <div className="form-group-flex">
                            <div className="form-check mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="remember"
                                defaultChecked=""
                              />
                              <label className="form-check-label" htmlFor="remember">
                                Remember Me
                              </label>
                            </div>
                            {/* <div className="form-check mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="remember1"
                              />
                              <label className="form-check-label" htmlFor="remember1">
                                Login with OTP
                              </label>
                            </div> */}
                          </div>
                        </div>
                        <div className="mb-3">
                          <button
                            className="btn btn-primary-gradient w-100"
                            type="submit"
                            disabled = {isLoading ? true : false}
                          >
                            {isLoading 
                            ?
                            <div className="row">
                              <div class="spinner-border text-light offset-3 col-1" role="status">
                                <span class="sr-only"></span>
                              </div>
                              <div className="col text-light text-start mt-1">Submitting.....</div>
                            </div>
                            : 
                              "Sign in"
                            }
                          </button>
                        </div>
                        <div className="login-or">
                          <span className="or-line" />
                          <span className="span-or">or</span>
                        </div>
                        {/* <div className="social-login-btn">
                          <Link to="#" className="btn w-100">
                            <ImageWithBasePath
                              src="assets/img/icons/google-icon.svg"
                              alt="google-icon"
                            />
                            Sign in With Google
                          </Link>
                          <Link to="#" className="btn w-100">
                            <ImageWithBasePath
                              src="assets/img/icons/facebook-icon.svg"
                              alt="fb-icon"
                            />
                            Sign in With Facebook
                          </Link>
                        </div> */}
                        <div className="account-signup">
                          <p>
                            Don't have an account ?{" "}
                            <Link to="/site-login">Sign up</Link>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/* /Login Tab Content */}
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </>


      <SiteFooter {...props} />
    </>
  );
};

export default SiteLoginContainer;
