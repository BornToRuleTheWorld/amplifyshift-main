import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN } from "../config";

const SendActivationLink = () => {
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const activationEmail = params.get("link");
        console.log(activationEmail)

        if (activationEmail) {
            ActivateLink(activationEmail);
        } else {
            setError("Invalid mail sending link.");
            setLoading(false);
        }
    }, [location]);

    const ActivateLink = async (code) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/GenerateUserOrLink/`, { Link : code, method:"regenerate" },{
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
            setError("Failed to send actiavtion link. Please try again.");
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
                                <h3>Sending in progress...</h3>
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
                                        <p>Activation link has been sent your registered mail</p>
                                    </div>
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

export default SendActivationLink;
