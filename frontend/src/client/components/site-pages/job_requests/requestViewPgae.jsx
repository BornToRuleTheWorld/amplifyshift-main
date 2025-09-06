import React, {useState, useEffect} from "react";
import Header from "../../header.jsx";
import SiteHeader from "../home/header.jsx";
import SiteFooter from "../home/footer.jsx";
import DoctorFooter from "../../common/doctorFooter/index.jsx";
import { doctordashboardprofile01, doctordashboardprofile02, doctordashboardprofile04, doctordashboardprofile05, doctordashboardprofile06, doctordashboardprofile07, doctordashboardprofile08, doctordashboardprofile3 } from "../../imagepath.jsx";
import { Filter, initialSettings } from "../../common/filter/index.jsx";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN, yearOptions, stateOptions, cntryOptions, boolOption, disciplineOptions } from "../config.js";
import { convertToUS } from "../utils.js";
import { FaEye } from "react-icons/fa";
import Message from "../messages/message.jsx"
import MapEmbed from "../Maps.js";

const RequestViewPage = (props) => {

   // Map
   const [address, setAddress] = useState('Test address , Test city, Test 12345');
   const [embedUrl, setEmbedUrl] = useState(`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`);
  
    const Group = atob(localStorage.getItem('group')) || "";
    const currentUser = atob(localStorage.getItem('userID')) || "";
    const currentRequestID = atob(localStorage.getItem('requestID')) || "";
    const requestProfID = atob(localStorage.getItem('requestProfID')) || "";
    const [viewData, setViewData] = useState([]);
    const [action, setAction] = useState(false)
    const [requestStatus, setRequestStatus] = useState(null)
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    console.log("currentUser",currentUser)
    console.log("currentRequestID",currentRequestID)
    console.log("requestProfID",requestProfID)

    const fetchJobRequest = async(id) => {
        await axios.get(`${API_BASE_URL}/job_request/GetJobRequest/?RequestID=${id}`, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN,
            }
        })
        .then((response) => {
          setViewData(response.data.data);
          const requestData = response.data.data[0]
          if(requestData){
            const state_name = requestData.state ? stateOptions.find(option => option.value == requestData.state).label : null
            const cntry_name = requestData.country ? cntryOptions.find(option => option.value == requestData.country).label : null
            setAddress(`${requestData.address1} ${requestData.address2} ${requestData.city} ${state_name} ${cntry_name} ${requestData.zipcode}`)
          }
          setRequestStatus(response.data.data[0].status)
          if (response.data.data[0].status === "Interested"){ 
            setAction(true) 
          }else{
            setAction(false)
          }
        })
        .catch((err) => {
            console.error('Error:', err);
        });
    }

    const updateStatus = async(status) =>{
        
        const data = {
            JobRequestID:currentRequestID,
            RequestStatus:status
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/job_request/UpdateJobRequestStatus/`,data,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                 },
            });
            console.log(response)
            fetchJobRequest(currentRequestID)
            // navigate('/job-request-sent')
        } catch (err) {
            setError(err.response?.data?.Result || "An error occurred");
        }
    }
    
    useEffect(() => {
      if (currentRequestID){
          fetchJobRequest(currentRequestID)
      }
    }, [currentRequestID]);

    //Maps
    useEffect(()=> {
      if (address.trim() !== '') { 
      const url = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
      setEmbedUrl(url)
      }
    }, [address])

    console.log("Request address", address)
    console.log("Request Data", viewData)
      
  return (
    <div>
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
                      <a href="/">
                        <i className="isax isax-home-15" />
                      </a>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      <Link to="/facility/dashboard">Facility</Link> 
                    </li>
                    <li className="breadcrumb-item active">
                      <Link to="/facility/job-requests">Job Requests</Link>
                    </li>
                  </ol>
                  <h2 className="breadcrumb-title">Job Request</h2>
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

      {/* Page Content */}
      <div className="content">
        <div className="container">
          <div className="row">
            {/* <div className="col-lg-4 col-xl-3 theiaStickySidebar">
\              <DoctorSidebar />
            </div> */}
            <div className="col-lg-12 col-xl-12">
              {/* <div className="dashboard-header"> */}
                {/* <h3>Job Request</h3> */}
                {/* <ul className="header-list-btns">
                  <li> */}
                    {/* <div className="input-block dash-search-input">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                      />
                      <span className="search-icon">
                        <i className="fa-solid fa-magnifying-glass" />
                      </span>
                    </div> */}
                  {/* </li> */}
                  {/* <li>
                    <div className="view-icons">
                      <Link to="#" className="active">
                      <i className="isax isax-grid-7"></i>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="view-icons">
                      <Link to="#">
                        <i className="fa-solid fa-th" />
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="view-icons">
                      <Link to="#">
                      <i className="isax isax-calendar-tick"></i>
                      </Link>
                    </div>
                  </li> */}
                {/* </ul>
              </div> */}
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
              <div className="tab-content appointment-tab-content">
                <div
                  className="tab-pane fade show active"
                  id="pills-upcoming"
                  role="tabpanel"
                  aria-labelledby="pills-upcoming-tab"
                >
                
                {
                    viewData.length === 0 ? (
                        <div className="appointment-wrap">No job request found</div>
                  ) : (
                    viewData.map((data)=>(
                    <>
                    {/* {(action)?
                    <div className="row mx-2 mb-4">
                      <div className="offset-10 col-1">
                        <button onClick={() => updateStatus('Confirmed')} className="btn btn-success">Confirm</button>
                      </div>
                      <div className="col-1">
                        <button onClick={() => updateStatus('Rejected')} className="btn btn-danger">Rejected</button>
                      </div>
                    </div>
                    :null} */}
                    <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <div className="patient-info">
                            <p>Created On</p>
                            <h6>
                            <i className="fa-solid fa-clock" />&nbsp;<Link to="#">{convertToUS(data.created_on,"DateTime")}</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="patinet-information px-1">
                          <div className="patient-info">
                            <p>Job  Title</p>
                            <h6>
                            <Link to="#" style={{fontSize:"20px"}}>{data.job_title}</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="patinet-information" style={{minWidth:"0px"}}>
                          <div className="patient-info">
                            <p>Total Hours</p>
                            <h6>
                            <Link to="#">{data.total_request_hours} {data.total_request_hours > 1 ? "hrs" : "hr"}</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="patinet-information" style={{minWidth:"0px"}}>
                          <div className="patient-info">
                            <p>Total Pay</p>
                            <h6>
                            <Link to="#">$ {data.total_pay}</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="patinet-information" style={{minWidth:"0px"}}>
                          <div className="patient-info">
                            <p>Professional</p>
                            <h6>
                            <Link to="#">{data.professional_name}</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="patinet-information" style={{minWidth:"0px"}}>
                          <div className="patient-info">
                            <p>Start Date</p>
                            <h6>
                            <Link to="#">{convertToUS(data.start_date,"Date")}</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="patinet-information" style={{minWidth:"0px"}}>
                          <div className="patient-info">
                            <p>End Date</p>
                            <h6>
                            <Link to="#">{convertToUS(data.end_date,"Date")}</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <ul>
                      {data?.status === "Rejected" || data?.status === "Not Interested"
                      ?
                      <span className='text-danger px-4' style={{fontWeight:"bolder",fontSize:"19px"}}>
                        {data?.status}{" "}
                      </span>
                      :
                      <span className='text-success px-4' style={{fontWeight:"bolder",fontSize:"19px"}}>
                        {data?.status}{" "}
                      </span>
                      }
                      {/* <span className="btn btn-block w-100 btn-outline-success active">
                        <i className="fa-solid fa-circle" />&nbsp;
                        {data.status}{" "}
                      </span> */}
                      </ul>
                      
                    </ul>
                  </div>
                <div className="container">
                <div className="card doc-profile-card">
                    <div className="card-body">
                    <div className="doctor-widget doctor-profile-two border-bottom">
                        <div className="doc-info-left">
                        <div className="doc-info-cont">
                            <h4 className="doc-name">
                            {data.contact_person}{" "}
                            </h4>
                            <p><b>Discipline</b> - {
                                                  (() => {
                                                    const option = disciplineOptions.find(disp => disp.label === data.discipline);
                                                    return option ? (
                                                      <span style={{ backgroundColor: option.color, color:"white", padding:"5px",borderRadius:"5px" }}>{option.label}</span>
                                                    ) : "N/A";
                                                  })()
                                                },&nbsp; <b>Specialty</b> - {data.speciality},&nbsp; <b>Work Setting</b> - {data.work_setting}</p>
                            <div className="d-flex pb-2">
                            <span className="">
                                <ImageWithBasePath src="assets/img/icons/watch-icon.svg" alt="Img" />
                            </span>
                            <p className='p-1'>{data.visit_type}</p>
                            </div>
                            <p><b>Experience required</b> - {yearOptions.map(year => {if (year.value === data.years_of_exp) {return year.label} return null })},&nbsp;  
                            <b>License required</b> - {data.job_license ? boolOption.map(option => {if (option.value == data.job_license) {return option.label;}return "";}) : "N/A"},&nbsp;  <b>CPR/BLS</b> - {data.job_cpr_bls ? boolOption.map(option => {if (option.value == data.job_cpr_bls) {return option.label;}return "";}) : "N/A"},&nbsp;  <b>Pay</b> - ${data.job_pay}/hr</p>
                            <p><b>Speaks</b> - {data.languages}</p>
                        </div>
                        </div>
                        <div className="doc-info-right">
                        <div className="row align-items-center">
                            <div className="col-12">
                            <div className="clinic-info">
                                <div className="detail-clinic fs-5">
                                <h5>{data.address1}</h5>
                                <p>{(data.address) ? `${data.address2},` : null}{stateOptions.find(option => option.value == data.state).label}, {cntryOptions.find(option=> option.value == data.country).label}, {data.zipcode}</p>
                                </div>
                            </div>
                            </div>
                            <div className="col-12">
                            {/* <div className="contact-map d-flex">
                                <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.7301009561315!2d-76.13077892422932!3d36.82498697224007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89bae976cfe9f8af%3A0xa61eac05156fbdb9!2sBeachStreet%20USA!5e0!3m2!1sen!2sin!4v1669777904208!5m2!1sen!2sin"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className='h-50'
                                />
                            </div> */}
                            {embedUrl && <MapEmbed embedUrl={embedUrl} />}
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    </>
                    )))
                }
                
                  {/* <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <div className="patient-info">
                            <p>Created On</p>
                            <h6>
                              <Link to="/doctor/doctor-upcoming-appointment"></Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          11 Nov 2025 10.45 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Video Call</li>
                        </ul>
                      </li>
                      <li className="mail-info-patient">
                        <ul>
                          <li>
                            <i className="fa-solid fa-envelope" />
                            adran@example.com
                          </li>
                          <li>
                            <i className="fa-solid fa-phone" />
                            +1 504 368 6874
                          </li>
                        </ul>
                      </li>
                      <li className="appointment-action">
                        <ul>
                          <li>
                            <Link to="/doctor/doctor-upcoming-appointment">
                              <i className="fa-solid fa-eye" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="isax isax-messages-25" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="isax isax-close-circle5" />
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li className="appointment-start">
                        <Link
                          to="/doctor/doctor-appointment-start"
                          className="start-link"
                        >
                          Start Now
                        </Link>
                      </li>
                    </ul>
                  </div> */}
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  {/* <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-upcoming-appointment">
                            <img
                              src={doctordashboardprofile02}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0002</p>
                            <h6>
                              <Link to="/doctor/doctor-upcoming-appointment">Kelly</Link>
                              <span className="badge new-tag">New</span>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          05 Nov 2025 11.50 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Audio Call</li>
                        </ul>
                      </li>
                      <li className="mail-info-patient">
                        <ul>
                          <li>
                            <i className="fa-solid fa-envelope" />
                            kelly@example.com
                          </li>
                          <li>
                            <i className="fa-solid fa-phone" />
                            &nbsp;+1 832 891 8403
                          </li>
                        </ul>
                      </li>
                      <li className="appointment-action">
                        <ul>
                          <li>
                            <Link to="/doctor/doctor-upcoming-appointment">
                              <i className="fa-solid fa-eye" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="isax isax-messages-25" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="isax isax-close-circle5" />
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li className="appointment-start">
                        <Link
                          to="/doctor/doctor-appointment-start"
                          className="start-link"
                        >
                          Start Now
                        </Link>
                      </li>
                    </ul>
                  </div> */}
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  {/* <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-upcoming-appointment">
                            <img
                              src={doctordashboardprofile3}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0003</p>
                            <h6>
                              <Link to="/doctor/doctor-upcoming-appointment">Samuel</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          27 Oct 2025 09.30 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Video Call</li>
                        </ul>
                      </li>
                      <li className="mail-info-patient">
                        <ul>
                          <li>
                            <i className="fa-solid fa-envelope" />
                            samuel@example.com
                          </li>
                          <li>
                            <i className="fa-solid fa-phone" />
                            &nbsp;&nbsp;+1 749 104 6291
                          </li>
                        </ul>
                      </li>
                      <li className="appointment-action">
                        <ul>
                          <li>
                            <Link to="/doctor/doctor-upcoming-appointment">
                              <i className="fa-solid fa-eye" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="isax isax-messages-25" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="isax isax-close-circle5" />
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li className="appointment-start">
                        <Link
                          to="/doctor/doctor-appointment-start"
                          className="start-link"
                        >
                          Start Now
                        </Link>
                      </li>
                    </ul>
                  </div> */}
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  {/* <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-upcoming-appointment">
                            <img
                              src={doctordashboardprofile04}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0004</p>
                            <h6>
                              <Link to="/doctor/doctor-upcoming-appointment">
                                Catherine
                              </Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          18 Oct 2025 12.20 PM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Direct Visit</li>
                        </ul>
                      </li>
                      <li className="mail-info-patient">
                        <ul>
                          <li>
                            <i className="fa-solid fa-envelope" />
                            catherine@example.com
                          </li>
                          <li>
                            <i className="fa-solid fa-phone" />
                            +1 584 920 7183
                          </li>
                        </ul>
                      </li>
                      <li className="appointment-action">
                        <ul>
                          <li>
                            <Link to="/doctor/doctor-upcoming-appointment">
                              <i className="fa-solid fa-eye" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="isax isax-messages-25" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="isax isax-close-circle5" />
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li className="appointment-start">
                        <Link
                          to="/doctor/doctor-appointment-start"
                          className="start-link"
                        >
                          Start Now
                        </Link>
                      </li>
                    </ul>
                  </div> */}
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  {/* <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-upcoming-appointment">
                            <img
                              src={doctordashboardprofile05}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0005</p>
                            <h6>
                              <Link to="/doctor/doctor-upcoming-appointment">Robert</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          10 Oct 2025 11.30 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Chat</li>
                        </ul>
                      </li>
                      <li className="mail-info-patient">
                        <ul>
                          <li>
                            <i className="fa-solid fa-envelope" />
                            robert@example.com
                          </li>
                          <li>
                            <i className="fa-solid fa-phone" />
                            &nbsp;+1 059 327 6729
                          </li>
                        </ul>
                      </li>
                      <li className="appointment-action">
                        <ul>
                          <li>
                            <Link to="/doctor/doctor-upcoming-appointment">
                              <i className="fa-solid fa-eye" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="isax isax-messages-25" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="isax isax-close-circle5" />
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li className="appointment-start">
                        <Link
                          to="/doctor/doctor-appointment-start"
                          className="start-link"
                        >
                          Start Now
                        </Link>
                      </li>
                    </ul>
                  </div> */}
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  {/* <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-upcoming-appointment">
                            <img
                              src={doctordashboardprofile06}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0006</p>
                            <h6>
                              <Link to="/doctor/doctor-upcoming-appointment">Anderea</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          26 Sep 2025 10.20 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Chat</li>
                        </ul>
                      </li>
                      <li className="mail-info-patient">
                        <ul>
                          <li>
                            <i className="fa-solid fa-envelope" />
                            anderea@example.com
                          </li>
                          <li>
                            <i className="fa-solid fa-phone" />
                            &nbsp;&nbsp;+1 278 402 7103
                          </li>
                        </ul>
                      </li>
                      <li className="appointment-action">
                        <ul>
                          <li>
                            <Link to="/doctor/doctor-upcoming-appointment">
                              <i className="fa-solid fa-eye" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="isax isax-messages-25" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="isax isax-close-circle5" />
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li className="appointment-start">
                        <Link
                          to="/doctor/doctor-appointment-start"
                          className="start-link"
                        >
                          Start Now
                        </Link>
                      </li>
                    </ul>
                  </div> */}
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  {/* <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-upcoming-appointment">
                            <img
                              src={doctordashboardprofile07}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0007</p>
                            <h6>
                              <Link to="/doctor/doctor-upcoming-appointment">Peter</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          14 Sep 2025 08.10 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Chat</li>
                        </ul>
                      </li>
                      <li className="mail-info-patient">
                        <ul>
                          <li>
                            <i className="fa-solid fa-envelope" />
                            peter@example.com
                          </li>
                          <li>
                            <i className="fa-solid fa-phone" />
                            &nbsp;+1 638 278 0249
                          </li>
                        </ul>
                      </li>
                      <li className="appointment-action">
                        <ul>
                          <li>
                            <Link to="/doctor/doctor-upcoming-appointment">
                              <i className="fa-solid fa-eye" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="isax isax-messages-25" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="isax isax-close-circle5" />
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li className="appointment-start">
                        <Link
                          to="/doctor/doctor-appointment-start"
                          className="start-link"
                        >
                          Start Now
                        </Link>
                      </li>
                    </ul>
                  </div> */}
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  {/* <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-upcoming-appointment">
                            <img
                              src={doctordashboardprofile08}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0008</p>
                            <h6>
                              <Link to="/doctor/doctor-upcoming-appointment">Emily</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          03 Sep 2025 06.00 PM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Video Call</li>
                        </ul>
                      </li>
                      <li className="mail-info-patient">
                        <ul>
                          <li>
                            <i className="fa-solid fa-envelope" />
                            emily@example.com
                          </li>
                          <li>
                            <i className="fa-solid fa-phone" />
                            &nbsp;&nbsp;+1 261 039 1873
                          </li>
                        </ul>
                      </li>
                      <li className="appointment-action">
                        <ul>
                          <li>
                            <Link to="/doctor/doctor-upcoming-appointment">
                              <i className="fa-solid fa-eye" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="isax isax-messages-25" />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i className="isax isax-close-circle5" />
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li className="appointment-start">
                        <Link
                          to="/doctor/doctor-appointment-start"
                          className="start-link"
                        >
                          Start Now
                        </Link>
                      </li>
                    </ul>
                  </div> */}
                  {/* /Appointment List */}
                  {/* Pagination */}
                  {/* <div className="pagination dashboard-pagination">
                    <ul>
                      <li>
                        <Link to="#" className="page-link">
                          <i className="fa-solid fa-chevron-left" />
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          1
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link active">
                          2
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          3
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          4
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          ...
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          <i className="fa-solid fa-chevron-right" />
                        </Link>
                      </li>
                    </ul>
                  </div> */}
                  {/* /Pagination */}
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-cancel"
                  role="tabpanel"
                  aria-labelledby="pills-cancel-tab"
                >
                  {/* Appointment List */}
                  <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-cancelled-appointment">
                            <img
                              src={doctordashboardprofile01}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0001</p>
                            <h6>
                              <Link to="/doctor/doctor-cancelled-appointment">Adrian</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          11 Nov 2025 10.45 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Video Call</li>
                        </ul>
                      </li>
                      <li className="appointment-detail-btn">
                        <Link
                          to="/doctor/doctor-cancelled-appointment"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-cancelled-appointment">
                            <img
                              src={doctordashboardprofile02}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0002</p>
                            <h6>
                              <Link to="/doctor/doctor-cancelled-appointment">Kelly</Link>
                              <span className="badge new-tag">New</span>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          05 Nov 2025 11.50 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Audio Call</li>
                        </ul>
                      </li>
                      <li className="appointment-detail-btn">
                        <Link
                          to="/doctor/doctor-cancelled-appointment"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-cancelled-appointment">
                            <img
                              src={doctordashboardprofile3}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0003</p>
                            <h6>
                              <Link to="/doctor/doctor-cancelled-appointment">Samuel</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          27 Oct 2025 09.30 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Video Call</li>
                        </ul>
                      </li>
                      <li className="appointment-detail-btn">
                        <Link
                          to="/doctor/doctor-cancelled-appointment"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-cancelled-appointment">
                            <img
                              src={doctordashboardprofile04}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0004</p>
                            <h6>
                              <Link to="/doctor/doctor-cancelled-appointment">
                                Catherine
                              </Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          18 Oct 2025 12.20 PM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Direct Visit</li>
                        </ul>
                      </li>
                      <li className="appointment-detail-btn">
                        <Link
                          to="/doctor/doctor-cancelled-appointment"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-cancelled-appointment">
                            <img
                              src={doctordashboardprofile05}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0005</p>
                            <h6>
                              <Link to="/doctor/doctor-cancelled-appointment">Robert</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          10 Oct 2025 11.30 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Chat</li>
                        </ul>
                      </li>
                      <li className="appointment-detail-btn">
                        <Link
                          to="/doctor/doctor-cancelled-appointment"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-cancelled-appointment">
                            <img
                              src={doctordashboardprofile06}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0006</p>
                            <h6>
                              <Link to="/doctor/doctor-cancelled-appointment">
                                Anderea
                              </Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          26 Sep 2025 10.20 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Chat</li>
                        </ul>
                      </li>
                      <li className="appointment-detail-btn">
                        <Link
                          to="/doctor/doctor-cancelled-appointment"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-cancelled-appointment">
                            <img
                              src={doctordashboardprofile07}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0007</p>
                            <h6>
                              <Link to="/doctor/doctor-cancelled-appointment">Peter</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          14 Sep 2025 08.10 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Chat</li>
                        </ul>
                      </li>
                      <li className="appointment-detail-btn">
                        <Link
                          to="/doctor/doctor-cancelled-appointment"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-cancelled-appointment">
                            <img
                              src={doctordashboardprofile08}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0008</p>
                            <h6>
                              <Link to="/doctor/doctor-cancelled-appointment">Emily</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          03 Sep 2025 06.00 PM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Video Call</li>
                        </ul>
                      </li>
                      <li className="appointment-detail-btn">
                        <Link
                          to="/doctor/doctor-cancelled-appointment"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appointment List */}
                  {/* Pagination */}
                  <div className="pagination dashboard-pagination">
                    <ul>
                      <li>
                        <Link to="#" className="page-link">
                          <i className="fa-solid fa-chevron-left" />
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          1
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link active">
                          2
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          3
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          4
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          ...
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          <i className="fa-solid fa-chevron-right" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Pagination */}
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-complete"
                  role="tabpanel"
                  aria-labelledby="pills-complete-tab"
                >
                  {/* Appointment List */}
                  <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-completed-appointment">
                            <img
                              src={doctordashboardprofile01}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0001</p>
                            <h6>
                              <Link to="/doctor/doctor-completed-appointment">Adrian</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          11 Nov 2025 10.45 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Video Call</li>
                        </ul>
                      </li>
                      <li className="appointment-detail-btn">
                        <Link
                          to="/doctor/doctor-completed-appointment"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-completed-appointment">
                            <img
                              src={doctordashboardprofile02}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0002</p>
                            <h6>
                              <Link to="/doctor/doctor-completed-appointment">Kelly</Link>
                              <span className="badge new-tag">New</span>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          05 Nov 2025 11.50 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Audio Call</li>
                        </ul>
                      </li>
                      <li className="appointment-detail-btn">
                        <Link
                          to="/doctor/doctor-completed-appointment"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-completed-appointment">
                            <img
                              src={doctordashboardprofile3}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0003</p>
                            <h6>
                              <Link to="/doctor/doctor-completed-appointment">Samuel</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          27 Oct 2025 09.30 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Video Call</li>
                        </ul>
                      </li>
                      <li className="appointment-detail-btn">
                        <Link
                          to="/doctor/doctor-completed-appointment"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-completed-appointment">
                            <img
                              src={doctordashboardprofile04}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0004</p>
                            <h6>
                              <Link to="/doctor/doctor-completed-appointment">
                                Catherine
                              </Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          18 Oct 2025 12.20 PM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Direct Visit</li>
                        </ul>
                      </li>
                      <li className="appointment-detail-btn">
                        <Link
                          to="/doctor/doctor-completed-appointment"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-completed-appointment">
                            <img
                              src={doctordashboardprofile05}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0005</p>
                            <h6>
                              <Link to="/doctor/doctor-completed-appointment">Robert</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          10 Oct 2025 11.30 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Chat</li>
                        </ul>
                      </li>
                      <li className="appointment-detail-btn">
                        <Link
                          to="/doctor/doctor-completed-appointment"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-completed-appointment">
                            <img
                              src={doctordashboardprofile06}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0006</p>
                            <h6>
                              <Link to="/doctor/doctor-completed-appointment">
                                Anderea
                              </Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          26 Sep 2025 10.20 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Chat</li>
                        </ul>
                      </li>
                      <li className="appointment-detail-btn">
                        <Link
                          to="/doctor/doctor-completed-appointment"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-completed-appointment">
                            <img
                              src={doctordashboardprofile07}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0007</p>
                            <h6>
                              <Link to="/doctor/doctor-completed-appointment">Peter</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          14 Sep 2025 08.10 AM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Chat</li>
                        </ul>
                      </li>
                      <li className="appointment-detail-btn">
                        <Link
                          to="/doctor/doctor-completed-appointment"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appointment List */}
                  {/* Appointment List */}
                  <div className="appointment-wrap">
                    <ul>
                      <li>
                        <div className="patinet-information">
                          <Link to="/doctor/doctor-completed-appointment">
                            <img
                              src={doctordashboardprofile08}
                              alt="User Image"
                            />
                          </Link>
                          <div className="patient-info">
                            <p>#Apt0008</p>
                            <h6>
                              <Link to="/doctor/doctor-completed-appointment">Emily</Link>
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li className="appointment-info">
                        <p>
                          <i className="fa-solid fa-clock" />
                          03 Sep 2025 06.00 PM
                        </p>
                        <ul className="d-flex apponitment-types">
                          <li>General Visit</li>
                          <li>Video Call</li>
                        </ul>
                      </li>
                      <li className="appointment-detail-btn">
                        <Link
                          to="/doctor/doctor-completed-appointment"
                          className="start-link"
                        >
                          View Details
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appointment List */}
                  {/* Pagination */}
                  <div className="pagination dashboard-pagination">
                    <ul>
                      <li>
                        <Link to="#" className="page-link">
                          <i className="fa-solid fa-chevron-left" />
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          1
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link active">
                          2
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          3
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          4
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          ...
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          <i className="fa-solid fa-chevron-right" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Pagination */}
                </div>
              </div>
                <div className="container border border-1 rounded-4 shadow">
                  <Message
                  currentRequestID= {currentRequestID}
                  message_from = {currentUser}
                  message_to = {requestProfID}
                  FacID = {currentUser}
                  ProfID = {requestProfID}
                  UserRole = {"facility"}
                  />
                </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      <SiteFooter {...props} />
    </div>
  );
};

export default RequestViewPage;
