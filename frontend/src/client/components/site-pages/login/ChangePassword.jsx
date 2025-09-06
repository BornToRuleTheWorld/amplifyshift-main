import React, { useState } from "react";
// import DashboardSidebar from "../sidebar/sidebar.jsx";
import DashboardSidebar from "../../patients/dashboard/sidebar/sidebar.jsx";
// import IMG01 from "../../../../assets/images/patient.jpg";
import StickyBox from "react-sticky-box";
import { Link,useHistory,NavLink } from "react-router-dom";
import SiteFooter from "../home/footer.jsx";
import SiteHeader from "../home/header.jsx";
// import Header from "./header.jsx";
import { DatePicker } from "antd";
import Select from "react-select";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
//import ImageWithBasePath from "../../core/img/imagewithbasebath.jsx";
import ProfessionalNav from "../professional/profile/ProfessionalNav.jsx";
import { AUTH_TOKEN,API_BASE_URL } from "../config.js";
import axios from 'axios';
import { flag01 } from "../../imagepath.jsx";
import ProfessionalSidebar from "../professional/profile/ProfessionalSidebar.jsx";
import FacilitySidebar from "../facility/facilitySidebar.jsx";

const ChangePassword = (props) => {
    const group  = atob(localStorage.getItem('group')) || "";
    const currentUserID = atob(localStorage.getItem('userID')) || "";
    const history = useHistory();

    const[data, setData] = useState({
        user_id:currentUserID,
        old_password:"",
        new_password:"",
        confirm_password:""
    })

    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [formErrors, setFormErrors] = useState({});

    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [isNewPasswordVisible, setNewPasswordVisibility] = useState(false);
    const [isConfPasswordVisible, setConfPasswordVisibility] = useState(false);
    
    const togglePasswordVisibility = () => {
        setPasswordVisibility(!isPasswordVisible);
    };

    const toggleNewPasswordVisibility = () => {
        setNewPasswordVisibility(!isNewPasswordVisible);
    };

    const toggleConfPasswordVisibility = () => {
        setConfPasswordVisibility(!isConfPasswordVisible);
    };

    const validiteFormInputs = (data) => {
      
        const errorObj = {};
        
        if (Object.keys(data).length !== 0){
          if (data.old_password == '') {
            errorObj.old_password = "Old password is required";
          }
  
          if (data.new_password == '') {
            errorObj.new_password = "New password is required";
          }
  
          if (data.confirm_password == '') {
            errorObj.confirm_password = "Confirm password is required";
          }

          if ((data.new_password != '') && (data.confirm_password != '')) {
            if (JSON.stringify(data.new_password) != JSON.stringify(data.confirm_password)) {
                errorObj.confirm_password = "Password and confirm password should be the same";
            }
          }
        }
        return errorObj
    }

    const handleCancel = () => {
        setData({
            user_id:currentUserID,
            old_password:"",
            new_password:"",
            confirm_password:""
        })
        setFormErrors({})
        setError(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFormErrors({})
        const formValidate = validiteFormInputs(data)
        if (Object.keys(formValidate).length === 0) {
            setIsLoading(true);

            try {
                const response = await axios.post(`${API_BASE_URL}/ChangePassword/`, data,{
                    headers: { 
                        "Content-Type": "application/json",
                        'Authorization': AUTH_TOKEN
                    }}
                );

                if (response.status === 200){
                    setSuccess("Password changed successfully")
                    localStorage.clear();
                    history.push('/site-login');
                }

            } catch (err) {
                console.log(err)
                setError(err.response?.data?.Result || "An error occurred");
            } finally {
                setIsLoading(false);
            }
        }else{
            setFormErrors(formValidate)
            return false
        }
    };

    return (
        <div>
            <SiteHeader />
            <>
                {/* Breadcrumb */}
                <div className="breadcrumb-bar">
                    <div className="container">
                        <div className="row align-items-center inner-banner">
                            <div className="col-md-12 col-12 text-center">
                                <nav aria-label="breadcrumb" className="page-breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/home">
                                                <i className="isax isax-home-15" />
                                            </Link>
                                        </li>
                                        <li className="breadcrumb-item" aria-current="page">
                                        {group === "Facility"
                                        ?
                                        <Link to="/facility/dashboard">Facility</Link>
                                        :
                                        <Link to="/professional/dashboard">Professional</Link>
                                        }
                                        </li>
                                        <li className="breadcrumb-item active">
                                            {group === "Facility"
                                            ?
                                            <Link to="/facility/myprofile">Profile</Link>
                                            :
                                            <Link to="/professional/myprofile">Profile</Link>
                                            }
                                        </li>
                                    </ol>
                                    <h2 className="breadcrumb-title">Change Password</h2>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="breadcrumb-bg">
                        <ImageWithBasePath
                            src="assets/img/bg/breadcrumb-bg-01.png"
                            alt="img"
                            className="breadcrumb-bg-01"
                        />
                        <ImageWithBasePath
                            src="assets/img/bg/breadcrumb-bg-02.png"
                            alt="img"
                            className="breadcrumb-bg-02"
                        />
                        <ImageWithBasePath
                            src="assets/img/bg/breadcrumb-icon.png"
                            alt="img"
                            className="breadcrumb-bg-03"
                        />
                        <ImageWithBasePath
                            src="assets/img/bg/breadcrumb-icon.png"
                            alt="img"
                            className="breadcrumb-bg-04"
                        />
                    </div>
                </div>
                {/* /Breadcrumb */}
            </>


            <div className="content">
                <div className="container">
                    <div className="row">
                    
                        <div className="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar">
                            <StickyBox offsetTop={20} offsetBottom={20}>
                                {group === "Professional" ?
                                <ProfessionalSidebar />
                                :
                                <FacilitySidebar />
                                }
                            </StickyBox>
                        </div>

                        <div className="col-lg-8 col-xl-9">
                                    <div className="card">
                                        <div className="card-body">
                                            {/* <div className="border-bottom pb-3 mb-3">
                                                <h5>Change Password</h5>
                                            </div> */}
                                            {error ? (
                                            <div className="alert alert-danger alert-dismissible fade show mt-2" role="alert">
                                                {error}
                                            </div>
                                            ) : ''}
                                            <form onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <div className="form-group-flex">
                                                                <label className="form-label">Current Password</label>
                                                            </div>
                                                            <div className="pass-group">
                                                                <input
                                                                    type={isPasswordVisible ? "text" : "password"}
                                                                    name = "password"
                                                                    value={data.old_password}
                                                                    className="form-control pass-input-sub"
                                                                    onChange={(e) => setData({...data, old_password: e.target.value})}
                                                                />
                                                                <span
                                                                    className={`feather toggle-password-sub ${isPasswordVisible ? "feather-eye" : "feather-eye-off"
                                                                    }`}
                                                                    onClick={togglePasswordVisibility}
                                                                />
                                                            
                                                            </div>
                                                            {formErrors.old_password && <div className="form-label text-danger m-1">{formErrors.old_password}</div>}
                                                        </div>
                                                        <div className="mb-3">
                                                            <div className="form-group-flex">
                                                                <label className="form-label">New Password</label>
                                                            </div>
                                                            <div className="pass-group">
                                                                <input
                                                                    type={isNewPasswordVisible ? "text" : "password"}
                                                                    name = "password"
                                                                    value={data.new_password}
                                                                    className="form-control pass-input-sub"
                                                                    onChange={(e) => setData({...data, new_password: e.target.value})}
                                                                />
                                                                <span
                                                                    className={`feather toggle-password-sub ${isNewPasswordVisible ? "feather-eye" : "feather-eye-off"
                                                                    }`}
                                                                    onClick={toggleNewPasswordVisibility}
                                                                />
                                                           
                                                            </div>
                                                            {formErrors.new_password && <div className="form-label text-danger m-1">{formErrors.new_password}</div>}
                                                        </div>
                                                        <div className="mb-3">
                                                            <div className="form-group-flex">
                                                                <label className="form-label">Confirm Password</label>
                                                            </div>
                                                            <div className="pass-group">
                                                                <input
                                                                    type={isConfPasswordVisible ? "text" : "password"}
                                                                    name = "password"
                                                                    value={data.confirm_password}
                                                                    className="form-control pass-input-sub"
                                                                    onChange={(e) => setData({...data, confirm_password: e.target.value})}
                                                                />
                                                                <span
                                                                    className={`feather toggle-password-sub ${isConfPasswordVisible ? "feather-eye" : "feather-eye-off"
                                                                    }`}
                                                                    onClick={toggleConfPasswordVisibility}
                                                                />
                                                           
                                                            </div>
                                                            {formErrors.confirm_password && <div className="form-label text-danger m-1">{formErrors.confirm_password}</div>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal-btn border-top pt-3 text-end">
                                                    <Link to="#" className="btn btn-md btn-light rounded-pill" onClick={handleCancel}>
                                                        Cancel
                                                    </Link>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-md btn-primary-gradient rounded-pill"
                                                        >
                                                        {isLoading ?
                                                        <> 
                                                            <div class="spinner-border spinner-border-sm text-light col-1 mt-1" role="status">
                                                                <span class="sr-only">Submitting.....</span>
                                                            </div>
                                                            <span className="col text-light text-start p-1">Submitting.....</span>
                                                        </>
                                                                
                                                        : "Submit"}
                                                    </button>
                                                    {/* <input type='submit' value={isLoading ? "Submitting...." : "Submit" } disabled={isLoading ? true : false } className="btn btn-md btn-primary-gradient rounded-pill"/> */}
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                        </div>
                    </div>
                </div>
            </div>
            <SiteFooter />
        </div>
    );
};

export default ChangePassword;
