import React, {useState, useEffect, useRef } from "react";
import StickyBox from "react-sticky-box";
import { Link, useHistory } from "react-router-dom";
import SiteFooter from "../../home/footer.jsx";
import SiteHeader from "../../home/header.jsx";
import { DatePicker, Descriptions } from "antd";
import Select from "react-select";
import ImageWithBasePath from "../../../../../core/img/imagewithbasebath.jsx";
import {AUTH_TOKEN, API_BASE_URL } from '../../config';
import { FaPen, FaPlusSquare, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import axios from "axios";

const AddMembership = (props) => {

  const [planData, setPlanData] = useState({
    name:"",
    description:"",
    monthly_price:"",
    yearly_price:"",
    is_popular:"",
    user_type:"",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [features, setFeatures] = useState([{feature:"", sort_order:""}])
  const history = useHistory()

  const popular = [
    {value:"1", label:"Yes"},
    {value:"0", label:"No"}
  ]

  const userType = [
    {value:"Facility", label:"Facility"},
    {value:"Professional", label:"Professional"}
  ] 

  const handleAddFeature = () => {
    setFeatures([...features, { feature: "", sort_order: "" }]);
  };

  const handleFeatureChange = (index, e) => {
    const updatedFeatures = [...features];
    updatedFeatures[index][e.target.name] = e.target.value;
    setFeatures(updatedFeatures);
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
  };


  const handleCancel = () => {
    setError(null)
    setSuccess(null)
    setFormErrors({})
    setPlanData({ name:"",
      description:"",
      monthly_price:"",
      yearly_price:"",
      is_popular:"", 
      user_type:"",
    });
    setFeatures([{feature:"", sort_order:""}])
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setFormErrors({})
    setError(null);
    setSuccess(null);
    const formValidate = await validiteFormInputs(planData)
    console.log("formValidate",formValidate)
    if (Object.keys(formValidate).length === 0) {
      setIsLoading(true)
        const response = await axios.post(`${API_BASE_URL}/membership/CreateMembership/`, planData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
          },
        })
        .then((response) => {
          setSuccess('Pricing plan created successfully')
          console.log('Pricing plan created successfully:', response.data);
          createFeatures(response.data.MembershipID);
        })
        .catch((err) => {
          setError('Error creating pricing plan.....')
          console.error('Error creating pricing plan:', err);
        })
    }else{
      setFormErrors(formValidate)
      return false;
    }
  };


  const createFeatures =  async(id) => {
    const updatedData = features.map(data => ({
        ...data,
        membership: id
    }));
    try{
      await axios.post(`${API_BASE_URL}/membership/CreateFeature/`, updatedData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
        }
    })
    history.push("/site-user/pricing-plan")
    }catch (err) {
        console.log("createFeatures",err)
        setError(err.response?.data?.Result || "An error occurred");
    } finally {
        setIsLoading(false);
        setPlanData({ 
          name:"",
          description:"",
          monthly_price:"",
          yearly_price:"",
          is_popular:"", 
        });
        setFeatures([{feature:"", sort_order:""}])
    }
  }
  
    const validiteFormInputs = async(data) => {
        console.log("validiteFormInputs",data)
        setFormErrors({})
        const errorObj = {};
        
        if (data.name == '') {
        errorObj.name = "Plan name is required";
        }

        if (data.description == '') {
        errorObj.description = "Description is required";
        }

        if (data.monthly_price == '') {
        errorObj.monthly_price = "Monthly price is required";
        }

        if (data.yearly_price == '') {
            errorObj.yearly_price = "Yearly price is required";
        }

        if (data.is_popular == '') {
          errorObj.is_popular = "Please choose a option";
        }

        if (data.user_type == '') {
          errorObj.user_type = "Please choose a user type";
        }

        if (features && features.length > 0) {
        features.forEach((feature, index) => {
            if (feature.feature == '') {
            errorObj[`feature_name_${index}`] = `Feature name is required`;
            }

            if (feature.sort_order == '') {
            errorObj[`sort_order_${index}`] = `Sort order is required`;
            }
        });
    }
    
return errorObj
}

console.log("planData",planData)
console.log("features",features)

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
                      <Link to="/">
                        <i className="isax isax-home-15" />
                      </Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                        <Link to="/site-user/dashboard">Admin</Link>
                    </li>
                    <li className="breadcrumb-item active">
                        <Link to="/site-user/pricing-plan">Pricing Plan</Link>
                    </li>
                  </ol>
                  <h2 className="breadcrumb-title">Create Plan</h2>
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
            <div className="col-lg-12 col-xl-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="border-bottom pb-3 mb-3">
                        <h5>Membership</h5>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="setting-title">
                          <h6>Plan</h6>
                        </div>
                        {error ? (
                          <div className="alert alert-danger alert-dismissible fade show mt-2" role="alert">
                              {error}
                          </div>
                          ) : ''}
                        {success ? (
                          <div className="alert alert-success alert-dismissible fade show mt-2" role="alert">
                              {success}
                          </div>
                          ) : ''}
                        <div className= "setting-card">
                          <div className="row">
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                Plan Name
                                </label>&nbsp;<span className="text-danger">*</span>
                              
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={planData.name}
                                    onChange={(e) => setPlanData({ ...planData, name: e.target.value})}
                                  />
                               
                                {formErrors.name && <div className="form-label text-danger m-1">{formErrors.name}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Description</label>&nbsp;<span className="text-danger">*</span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={planData.description}
                                    onChange={(e) => setPlanData({ ...planData, description: e.target.value})}
                                  />
                                {formErrors.description && <div className="form-label text-danger m-1">{formErrors.description}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label"> Monthly Price </label>&nbsp;<span className="text-danger">*</span>
                              
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={planData.monthly_price}
                                    onChange={(e) => setPlanData({ ...planData, monthly_price: e.target.value})}
                                  />
                            
                                {formErrors.monthly_price && <div className="form-label text-danger m-1">{formErrors.monthly_price}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label"> Yearly Price </label>&nbsp;<span className="text-danger">*</span>
                              
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={planData.yearly_price}
                                    onChange={(e) => setPlanData({ ...planData, yearly_price: e.target.value})}
                                  />
                            
                                {formErrors.yearly_price && <div className="form-label text-danger m-1">{formErrors.yearly_price}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="mb-3">
                                <label className="form-label">Popular plan&nbsp;<span className="text-danger">*</span></label>
                                
                                <Select
                                    className="select"
                                    name="is_popular"
                                    options={popular}
                                    value={planData.is_popular ? popular.find(option => option.value === planData.is_popular) : null}
                                    onChange={(selected) => setPlanData({...planData, is_popular: selected?.value})}
                                    placeholder="Select"
                                    isClearable={true}
                                    isSearchable={true}
                                />
                                {formErrors.is_popular && <div className="form-label text-danger m-1">{formErrors.is_popular}</div>}
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                              <label className="form-label">User Type&nbsp;<span className="text-danger">*</span></label>
                              
                              <Select
                                  className="select"
                                  name="user_type"
                                  options={userType}
                                  value={userType.find(option => option.value === planData.user_type) || null}
                                  onChange={(selected) => setPlanData({...planData, user_type: selected?.value})}
                                  placeholder="Select"
                                  isClearable={true}
                                  isSearchable={true}
                              />
                              {formErrors.user_type && <div className="form-label text-danger m-1">{formErrors.user_type}</div>}
                              </div>
                          </div>
                          </div>
                          
                        </div>

                        {/* Dynamic Features Form */}
                        <div className="setting-title">
                            <h6>Features&nbsp;&nbsp;<button type="button" className="btn btn-md btn-secondary rounded-pill" onClick={handleAddFeature}>Add Feature</button></h6>
                        </div>
                        
                        <div className="setting-card">
                        {features.map((feature, index) => (
                            <div key={index} className="row">
                                <div className="col-lg-9 col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Feature Name&nbsp;<span className="text-danger">*</span></label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    name="feature"
                                    value={feature.feature}
                                    onChange={(e) => handleFeatureChange(index, e)}
                                    />
                                    {formErrors[`feature_name_${index}`] && <div className="form-label text-danger m-1">{formErrors[`feature_name_${index}`]}</div>}
                                </div>
                                </div>
                                <div className="col-lg-2 col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Order&nbsp;<span className="text-danger">*</span></label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    name="sort_order"
                                    value={feature.sort_order}
                                    onChange={(e) => handleFeatureChange(index, e)}
                                    />
                                    {formErrors[`sort_order_${index}`] && <div className="form-label text-danger m-1">{formErrors[`sort_order_${index}`]}</div>}
                                </div>
                                </div>
                                {index > 0 && (
                                <div className="col-lg-1 col-md-6">
                                     <div className="mb-3">
                                    <button
                                    type="button"
                                    className="btn btn-md btn-danger rounded-pill mt-4"
                                    onClick={() => handleRemoveFeature(index)}
                                    >
                                    Remove
                                    </button>
                                    </div>
                                </div>
                                )}
                            </div>
                            ))}
                            </div>
                     
                        <div className="modal-btn text-end">
                            <Link
                                to="#"
                                className="btn btn-md btn-primary-gradient rounded-pill"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="btn btn-md btn-primary-gradient rounded-pill"
                                disabled= {isLoading ? true : false}
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
                        </div>
                      </form>
                    </div>
                  </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter/>
    </div>
  );
};

export default AddMembership;
