import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../home/header";
import SiteFooter from "../home/footer";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import axios from "axios";
import { API_BASE_URL,AUTH_TOKEN } from "../config";

const PricingPlans = (props) => {

  const [planData, setPlanData] = useState([])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [monthly,setMonthly] = useState(true)

  const group = atob(localStorage.getItem("group")) || ""


  const handlePlan = async() => {
    setMonthly(!monthly)
  }

  const fetchPlan = async() => {
    const data = {
      UserType : group
    }
    try {
        const response = await axios.post(`${API_BASE_URL}/membership/GetAllMemberships/`, data, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': AUTH_TOKEN
        },
        });
        console.log('response', response);

        if (response?.status === 200) {
            if (response.data.data.length > 0) {
                setPlanData(response.data.data);
                setSuccess(null);
                setError(null);
            }
            else {
                setPlanData([]);
                setSuccess('No prircing plan data available');
                setError(null);
            }
        }
    } catch (err) {
        console.log('responseError', err);
        setPlanData([]);
        setError("An error occurred while fetching pricing plan");
        setSuccess(null);
    }
  }

  useEffect(()=>{
    fetchPlan()
  },[group])



  return (
    <>
      <SiteHeader {...props} />
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
                    <li className="breadcrumb-item active">{group}</li>
                  </ol>
                  <h2 className="breadcrumb-title">Pricing Plan</h2>
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
        {/* Pricing */}
        <section className="pricing-section">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <div className="section-inner-header pricing-inner-header">
                  <h2>Our Pricing Plan</h2>
                  {planData.length === 0 ? null :
                  <div className="plan-choose-info">
                    <label className="monthly-plan">Monthly</label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        defaultChecked=""
                        onChange={handlePlan}
                      />
                    </div>
                    <label className="yearly-plan">Yearly</label>
                  </div>
                  }
                </div>
              </div>
            </div>
            <div className="row align-items-center justify-content-center">
              {planData.length === 0 ?
                <div className="col-lg-12">
                      <div className="card doctor-list-card">
                        <div className="d-md-flex align-items-center">
                          <div className="card-body p-0">
                            <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                              <Link to="#" className="text-teal fw-medium fs-14">
                                No pricing plan available
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
              :
              planData.map((plan)=>( 
                <div className="col-lg-4 col-md-6">
                    <div className={plan.is_popular ? "card pricing-card active w-100" : "card pricing-card w-100" }  >
                    <div className="card-body">
                        <div className="pricing-header">
                        <div className="pricing-header-info">
                            <div className="pricing-icon">
                            <span>
                                <ImageWithBasePath src="assets/img/icons/price-icon2.svg" alt="icon" />
                            </span>
                            </div>
                            <div className="pricing-title">
                            <p>{plan.description}</p>
                            <h4>{plan.name}</h4>
                            </div>
                        </div>
                        {plan.is_popular ? 
                            <div>
                                <span className="badge">Popular</span>
                            </div>
                        :
                            null
                        }
                        </div>
                        <div className="pricing-info">
                        <div className="pricing-amount">
                            <h2>
                            ${monthly ? plan.monthly_price : plan.yearly_price} <span>{ monthly ? "/monthly" : "/yearly" }</span>
                            </h2>
                            <h6>What’s included</h6>
                        </div>
                        <div className="pricing-list">
                            <ul>
                            {plan.features.map((feature,index) => (
                                <li key={index}>{feature.feature}</li>
                            ))}
                            </ul>
                        </div>
                        <div className="pricing-btn">
                            <Link to="#" className="btn btn-primary">
                            Choose Plan
                            </Link>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
         
            </div>
          </div>
        </section>
        {/* /Pricing */}
      </>

      <SiteFooter {...props} />
    </>
  );
};

export default PricingPlans;
