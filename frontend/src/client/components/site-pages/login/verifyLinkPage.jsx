import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN } from "../config";
import { Link } from "react-router-dom"; 

const VerifyLinkPage = () => {
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const activationCode = params.get("code");
        const data = activationCode.split(" ")
        const uuid = data[0]
        const token = data[1]

        if (activationCode) {
            verifyUser(uuid,token);
        } else {
            setError("Invalid activation link.");
            setLoading(false);
        }
    }, [location]);

    const verifyUser = async (uuid,code) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/VerifyActiveUser/`, { uuid:uuid, code: code },{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN,
                },
            });

            if (response.status === 200) {
                setIsVerified(true);
            }
        } catch (err) {
            console.log(err)
            setError(err.response.data.Result || "Failed to verify the link. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <fieldset style={{display:'block'}}>
              <div className="card booking-card">
                <div className="card-body booking-body pb-1">
                    <div className="login-content-info">
                        <div className="container">
                            {/* Login Phone */}
                            <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-8">
                                <div className="account-content">
                                
                                <div className="account-info">
                                {loading 
                                ? 
                                <h3>Verification in progress ........</h3>
                                :
                                null
                                }
                                {error 
                                ?
                                    <h3>{error}</h3>
                                :
                                    null
                                }
                                {isVerified ?
                                <>
                                    <div className="login-verify-img">
                                        <i className="isax isax-tick-circle" />
                                    </div>
                                    <div className="login-title">
                                        <h3>Success</h3>
                                        <p>Your account has been successfully verified!</p>
                                    </div>
                                    <form>
                                        <div className="mb-3">
                                            <Link
                                            className="btn btn-primary-gradient w-100"
                                            to='/site-login'
                                            >
                                            Sign In
                                            </Link>
                                        </div>
                                    </form>
                                </>
                                :
                                    null
                                }
                                </div>
                                </div>
                            </div>
                            </div>
                        {/* /Login Phone */}
                        </div>
                    </div>
                </div>
              </div>
              <div>
              </div>
            </fieldset>
        </div>
    );
};

export default VerifyLinkPage;
