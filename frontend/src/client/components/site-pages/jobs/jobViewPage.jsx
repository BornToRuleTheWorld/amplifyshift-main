import React, {useState,useEffect} from 'react'
import SiteHeader from '../home/header';
import SiteFooter from '../home/footer';
import ImageWithBasePath from '../../../../core/img/imagewithbasebath';
import { Link, useHistory, NavLink } from "react-router-dom";
import { Calendar, theme } from 'antd';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {convertToUS} from "../utils"
import {AUTH_TOKEN, API_BASE_URL, boolOption, disciplineOptions, specialtyOptions, yearOptions, langOptions, workSettingOptions, stateOptions, cntryOptions, jobTypeOptions } from '../config'; 
import axios from 'axios';
import WorkHours from '../work_hours/workHours';
import WorkHoursCalender from '../work_hours/workCalender';
import { FaCalendarAlt} from "react-icons/fa";
import MapEmbed from '../Maps';

const JobViewPage = (props) => {

  //Maps
  // const [address, setAddress] = useState('Poonamallee High Rd, Poongavanapuram, Chennai, Tamil Nadu 600003');
  const [address, setAddress] = useState('Test address , Test city, Test 12345');
  const [embedUrl, setEmbedUrl] = useState(`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`);

  // if (address.trim() !== '') {
  //   const url = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  //   setEmbedUrl(url);
  // }

  
  const jobID = atob(localStorage.getItem('currentJobID')) || "";
  const currentUser = atob(localStorage.getItem('userID')) || "";
  const history = useHistory();
  
  const [jobData, setJobData] = useState([]);
  const [contractData, setContractData] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [contractSuccess, setContractSuccess] = useState(null);
  const [contractError, setContractError] = useState(null);
  const [contractCreated, setContractCreated] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [requestList,setRequestList] = useState([]);
  const [showWorkHours , setShowWorkHours] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const [sortRequestOrder, setSortRequestOrder] = useState('asc');
  const [sortRequestField, setSortRequestField] = useState('created_on');

  const [sortContractOrder, setSortContractOrder] = useState('asc');
  const [sortContractField, setSortContractField] = useState('created_on');

  const { token } = theme.useToken();
  const wrapperStyle = {
    width: '100%',
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleWorkHoursView = () => {
    setShowWorkHours(!showWorkHours)
  }

  const CustomNextArrow = ({ className, onClick }) => (
    <div className="nav nav-container slide-1 doctor-profile">
      <button type="button" role="presentation" className="owl-next" onClick={onClick}>
        <i className="fas fa-chevron-right" />
      </button>
    </div>

  );

  const CustomPrevArrow = ({ className, onClick }) => (
    <div className="nav nav-container slide-1 doctor-profile">
      <button type="button" role="presentation" className="owl-prev" onClick={onClick}>
        <i className="fas fa-chevron-left" />
      </button>
    </div>
  );

  const insurence = {
    dots: false,
    infinite: false,
    speed: 2000,
    slidesToShow: 6,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };


  const availability = {
    dots: false,
    infinite: false,
    speed: 2000,
    slidesToShow: 7,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 7,
        },
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };
  const awards = {
    dots: false,
    infinite: false,
    speed: 2000,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  
  const setJobID = async (id,prof_id) =>{
    localStorage.setItem("requestMessageID",btoa(id))
    localStorage.setItem("requestProfID",btoa(prof_id))
    history.push('/facility/job-request-view')
  }

  const handleContractView = (id) => {
    localStorage.setItem("ContractID", btoa(id))
    history.push("/facility/contract-view")
  }
  
  const fetchjob = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/jobs/GetJobs/?method=single&JobID=${id}`, {
            headers: { 
                "Content-Type": "application/json",
                'Authorization': AUTH_TOKEN
            },
        });
        setJobData(response.data.data);
        if(response.data.data){
          const state_name = response.data.data.state ? stateOptions.find(option => option.value == response.data.data.state).label : null
          const cntry_name = response.data.data.country ? cntryOptions.find(option => option.value == response.data.data.country).label : null
          setAddress(`${response.data.data.address1} ${response.data.data.address2} ${response.data.data.city} ${state_name} ${cntry_name} ${response.data.data.zipcode}`)
        }
    } catch (err) {
        setError(err.response?.data?.Result || "An error occurred");
    }
  };

  const fetchRequestData = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/job_request/GetJobRequest/?JobID=${id}`, {
            headers: { 
                "Content-Type": "application/json",
                'Authorization': AUTH_TOKEN
            },
        });
        setRequestList(response.data.data);
    } catch (err) {
        console.error(err);
        setError(err.response?.data?.Result || "An error occurred");
    }
  };

  const fetchContract = async(id) => {
    await axios.get(`${API_BASE_URL}/contract/GetContract/?JobID=${id}`, {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_TOKEN,
        }
    })
    .then((response) => {
      if(response.status === 200){
        setContractCreated(true);
        setContractData(response.data.data)
      }
    })
    .catch((err) => {
        console.error('Error:', err);
        setError(err.response.data.Result || "Error fetching data....")
    });
  }
  
  const createContract = async (id,requestID,startDate, endDate) => {
    setIsLoading(true);
    setContractError(null);
  
    const contractData = {
        job: id,
        job_request: requestID,
        created_by:currentUser,
        last_updated_by:"0",
        start_date:startDate,
        end_date:endDate,
        status:"New"
    }
  
    try {
        await axios({
            method: "POST",
            url: `${API_BASE_URL}/contract/CreateContract/`,
            data: contractData,
            headers: { 
                "Content-Type": "application/json",
                'Authorization': AUTH_TOKEN
            }
        });
        updateStatus(requestID,"Contract Created")
        setContractSuccess("Contract created successfully")
        fetchContract(jobID)
        
    } catch (err) {
        console.error(err)
        setContractError(err.response?.data?.Result || "An error occurred");
    } finally {
        setIsLoading(false);
    }
  };
  
  const updateStatus = async(request_id, status) =>{
          
    const data = {
        JobRequestID:request_id,
        RequestStatus:status
    }
  
    try {
        const response = await axios.post(`${API_BASE_URL}/job_request/UpdateJobRequestStatus/`,data,{
            headers: { 
                "Content-Type": "application/json",
                'Authorization': AUTH_TOKEN
             },
        });
        fetchRequestData(jobID)
    } catch (err) {
        setError(err.response?.data?.Result || "An error occurred");
    }
  }

  useEffect(() => {
    if (jobID) {
      fetchjob(jobID);  
      fetchRequestData(jobID)
      fetchContract(jobID)
    }
  }, [jobID]);

  useEffect(()=> {
    if (address.trim() !== '') { 
    const url = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
    setEmbedUrl(url)
    }
  }, [address])

  console.log("Embeded Address", address)

  //job request

  const handleRequestSort = (field) => {
    let newSortOrder = 'asc';
    if (sortRequestField === field && sortRequestOrder === 'asc') {
      newSortOrder = 'desc';
    }
    setSortRequestOrder(newSortOrder);
    setSortRequestField(field);

    const sortedData = [...requestList].sort((a, b) => {
        if (field === 'job_title' || field === 'status') {
          const nameA = a[field].toLowerCase();
          const nameB = b[field].toLowerCase();
          if (nameA < nameB) return newSortOrder === 'asc' ? -1 : 1;
          if (nameA > nameB) return newSortOrder === 'asc' ? 1 : -1;
          return 0;
        } else if (field === 'created_on' || field === 'start_date' || field === 'end_date') {
          const dateA = new Date(a[field]);
          const dateB = new Date(b[field]);
          return newSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }
        return 0;
      });

    setRequestList(sortedData);
  };

  // contract
  const handleContractSort = (field) => {
    let newSortOrder = 'asc';
    if (sortContractField === field && sortContractOrder === 'asc') {
      newSortOrder = 'desc';
    }
    setSortContractOrder(newSortOrder);
    setSortContractField(field);

    const sortedData = [...contractData].sort((a, b) => {
        if (field === 'job_title' || field === 'status') {
          const nameA = a[field].toLowerCase();
          const nameB = b[field].toLowerCase();
          if (nameA < nameB) return newSortOrder === 'asc' ? -1 : 1;
          if (nameA > nameB) return newSortOrder === 'asc' ? 1 : -1;
          return 0;
        } else if (field === 'created_on' || field === 'start_date' || field === 'end_date') {
          const dateA = new Date(a[field]);
          const dateB = new Date(b[field]);
          return newSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }
        return 0;
      });

      setContractData(sortedData);
  };

  console.log("jobData", jobData)
  return (
    <>
      <div className="main-wrapper">
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
                        <Link to="/facility/dashboard">Facility</Link>                        
                      </li>
                      <li className="breadcrumb-item">
                        <Link to="/facility/jobs">Jobs</Link>
                      </li>
                    </ol>
                    <h2 className="breadcrumb-title">{jobData?.job_title}</h2>
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

        <>
          {/* Page Content */}
          <div className="content">
            <div className="container">
              {/* Doctor Widget */}
              <div className="card doc-profile-card">
                <div className="card-body">
                  <div className="doc-profile-card-bottom border-top-0 border-bottom pb-4 mb-4">
                    <ul>
                      <li>
                        <span className="bg-blue">
                          <ImageWithBasePath src="assets/img/icons/calendar3.svg" alt="Img" />
                        </span>
                        <b>Start Date</b> - {(jobData?.start_date) ? convertToUS(jobData.start_date,"Date") : "N/A" } &nbsp;&nbsp; <b>End Date</b> - {(jobData?.end_date) ? convertToUS(jobData.end_date,"Date") : "N/A" }
                      </li>
                      {/* <li>
                        <span className="bg-dark-blue">
                          <ImageWithBasePath src="assets/img/icons/bullseye.svg" alt="Img" />
                        </span>
                        In Practice for 21 Years
                      </li>
                      <li>
                        <span className="bg-green">
                          <ImageWithBasePath src="assets/img/icons/bookmark-star.svg" alt="Img" />
                        </span>
                        15+ Awards
                      </li> */}
                    </ul>
                    <div className="bottom-book-btn">
                      {/* <p>
                        <span>Price : $100 - $200 </span> for a Session
                      </p>
                      <div className="clinic-booking">
                        <a className="apt-btn" href="/patient/booking1">
                          Book Appointment
                        </a>
                      </div> */}
                      {jobData?.contract_created ?
                      <span className='text-success px-4' style={{fontWeight:"bolder",fontSize:"19px"}}>
                        Contract Created{" "}
                      </span>
                      :
                      jobData?.status === "Active"
                      ?
                      <span className='text-success px-4' style={{fontWeight:"bolder",fontSize:"19px"}}>
                        {jobData?.status}{" "}
                      </span>
                      :
                      <span className='text-danger px-4' style={{fontWeight:"bolder",fontSize:"19px"}}>
                        {jobData?.status}{" "}
                      </span>
                      }
                      {/* <span className="btn btn-block w-100 btn-outline-success active">
                        <i className="fa-solid fa-circle" />&nbsp;
                        {jobData?.status}{" "}
                      </span> */}
                    </div>
                  </div>
                  <div className="doctor-widget doctor-profile-two border-bottom">
                    <div className="doc-info-left">
                      {/* <div className="doctor-img">
                        <ImageWithBasePath
                          src="assets/img/doctors/doc-profile-02.jpg"
                          className="img-fluid"
                          alt="User Image"
                        />
                      </div> */}
                      <div className="doc-info-cont">
                        {/* <span className="badge doc-avail-badge">
                          <i className="fa-solid fa-circle" />
                          Available{" "}
                        </span> */}
                        <h4 className="doc-name">
                        {jobData?.contact_person}{" "}
                        </h4>
                        <p>
                          <b>Discipline</b> - {
                                              (() => {
                                                const option = disciplineOptions.find(disp => disp.value == jobData.discipline);
                                                return option ? (
                                                  <span style={{ backgroundColor: option.color, color:"white", padding:"5px",borderRadius:"5px" }}>{option.label}</span>
                                                ) : "N/A";
                                              })()
                                            },&nbsp;
                          <b>Specialty</b> - {specialtyOptions.map(spl => { if (spl.value == jobData?.speciality) { return spl.label;}return null;})},&nbsp;
                          <b>Work Setting</b> - {workSettingOptions.map(work => { if (work.value == jobData?.work_setting) { return work.label;}return null;})}
                        </p>
                        <div className="d-flex pb-2">
                          <span className="">
                            <ImageWithBasePath src="assets/img/icons/watch-icon.svg" alt="Img" />
                          </span>
                          <p className='p-1'>{jobTypeOptions.map(job => {if (job.value == jobData?.job_type) {return job.label;}return null;})}</p>
                        </div>
                        <p><b>Experience required</b> - {yearOptions.map(year => {if (year.value == jobData?.years_of_exp) {return year.label;}return null;})},&nbsp;  
                        <b>License required</b> - {(jobData?.license) ? boolOption.map(option => {if (option.value == jobData?.license) {return option.label;}return "";}) : "N/A" },&nbsp;<b>CPR/BLS</b> - { (jobData?.cpr_bls) ? boolOption.map(option => {if (option.value == jobData?.cpr_bls) {return option.label;}return "";}): "N/A"},&nbsp;<b>Pay</b> - ${jobData?.pay}/hr</p>
                        <p><b>Speaks</b> - {langOptions.map(lang => { if (lang.value == jobData?.languages) { return lang.label;}return null;})}</p>
                      </div>
                    </div>
                    <div className="doc-info-right">
                      <div className="row align-items-center">
                        <div className="col-12">
                          <div className="clinic-info">
                            <div className="detail-clinic fs-5">
                              <h5>{jobData?.address1}</h5>
                              <p>{(jobData?.address2)? `${jobData?.address2},` : null}{jobData?.city},{(jobData?.state) ? stateOptions.find(option => option.value == jobData?.state )?.label : "N/A"},{(jobData?.country) ? cntryOptions.find(option=> option.value == jobData?.country)?.label :"N/A" },{jobData?.zipcode}</p>
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
                {/* <div className="card-body booking-body">
                  <div className="card mb-0">
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-lg-5">
                          <div className="card">
                            <div className="card-body p-2 pt-3">
                            <div style={wrapperStyle}>
                            <Calendar fullscreen={false} onPanelChange={onPanelChange} />
                            </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-7">
                          <div className="card booking-wizard-slots">
                            <div className="card-body">
                              <div className="book-title">
                                <h6 className="fs-14 mb-2">Morning</h6>
                              </div>
                              <div className="token-slot mt-2 mb-2">
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                      defaultChecked
                                    />
                                    <span className="visit-rsn">09:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">-</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">-</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">09:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">-</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                              </div>
                              <div className="book-title">
                                <h6 className="fs-14 mb-2">Afternoon</h6>
                              </div>
                              <div className="token-slot mt-2 mb-2">
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                      defaultChecked
                                    />
                                    <span className="visit-rsn">09:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">-</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                              </div>
                              <div className="book-title">
                                <h6 className="fs-14 mb-2">Evening</h6>
                              </div>
                              <div className="token-slot mt-2 mb-2">
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                      defaultChecked
                                    />
                                    <span className="visit-rsn">09:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">-</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">-</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">09:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">-</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">-</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="col-lg-12 col-xl-12">
                <div className="appointment-patient">
                  {/* Appoitment Tabs */}
                  <div className="appointment-tabs user-tab">
                    <ul className="nav">
                    <li className="nav-item">
                        <Link
                          className="nav-link active"
                          to="#work_hours"
                          data-bs-toggle="tab"
                        >
                          Work Hours
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          to="#pat_appointments"
                          data-bs-toggle="tab"
                        >
                          Job Requests
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          to="#prescription"
                          data-bs-toggle="tab"
                        >
                          Contract
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {/* /Appoitment Tabs */}
                  {contractSuccess ? (
                  <div className="alert alert-success alert-dismissible fade show mt-2" role="alert">
                      {contractSuccess}
                  </div>
                  ) : ''}
                  
                  <div className="tab-content pt-0">
                    <div id="work_hours" className="tab-pane fade show active">
                      {/* <div className="search-header">
                        <div className="search-field">
                            <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            />
                            <span className="search-icon">
                            <i className="fa-solid fa-magnifying-glass" />
                            </span>
                        </div>
                      </div> */}
                      <div className='row'>
                        <div className="col offset-11">
                          <FaCalendarAlt onClick={handleWorkHoursView} style={{fontSize:"20px"}}  className='text-success text-end'/>
                        </div>
                      </div>
                      {showWorkHours
                      ?
                      <WorkHours ID={jobID} Role={'Job'} View={'AdminStyle'}/>
                      :
                      <WorkHoursCalender ID={jobID} Role={'Job'} />
                      }
                    </div>
                    {/* Appointment Tab */}
                    <div id="pat_appointments" className="tab-pane fade">
                      
                      {/* <div className="search-header">
                        <div className="search-field">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                          />
                          <span className="search-icon">
                            <i className="fa-solid fa-magnifying-glass" />
                          </span>
                        </div>
                      </div> */}
                      <div className="tab-content appointment-tab-content">
                        <div
                          className="tab-pane fade show active"
                          id="pills-upcoming"
                          role="tabpanel"
                          aria-labelledby="pills-upcoming-tab"
                        >
                        <div className="table-responsive border rounded">
                          <table className="table table-center mb-0 table-striped table-hover">
                            <thead>
                              <tr className="bg-primary text-white">
                                <th onClick={() => handleRequestSort('created_on')} style={{ cursor: "pointer" }} className="bg-primary text-white">Created On {sortRequestOrder === 'asc' ? '↑' : '↓'}</th>
                                <th onClick={() => handleRequestSort('job_title')} style={{ cursor: "pointer" }} className="bg-primary text-white">Job Title {sortRequestOrder === 'asc' ? '↑' : '↓'}</th>
                                <th onClick={() => handleRequestSort('start_date')} style={{ cursor: "pointer" }} className="bg-primary text-white">Start Date {sortRequestOrder === 'asc' ? '↑' : '↓'}</th>
                                <th onClick={() => handleRequestSort('end_date')} style={{ cursor: "pointer" }} className="bg-primary text-white">End Date {sortRequestOrder === 'asc' ? '↑' : '↓'}</th>
                                <th onClick={() => handleRequestSort('status')} style={{ cursor: "pointer" }} className="bg-primary text-white">Status {sortRequestOrder === 'asc' ? '↑' : '↓'}</th>
                                <th className="bg-primary text-white">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {requestList.length === 0 ? (
                                <tr><td colSpan="10" style={{ fontSize: "15px", padding: "15px", }}>No job request found</td></tr>
                              ) : (
                                requestList.map((jobs) => (
                                  <tr key={jobs.id}>
                                    <td>{convertToUS(jobs.created_on,"DateTime")}</td>
                                    <td>{jobs.job_title}</td>
                                    <td>{convertToUS(jobs.start_date,"Date")}</td>
                                    <td>{convertToUS(jobs.end_date,"Date")}</td>
                                    <td>{jobs.status}</td>                                                          
                                    <td>
                                      <div className="action-item">
                                        <button onClick={()=>setJobID(jobs.id,jobs.professional_id)} className="btn btn-primary">View</button>&nbsp;&nbsp;
                                        {(jobs.status === "Confirmed") ? (
                                          <button onClick={()=> createContract(jobs.job_id,jobs.id,jobs.start_date,jobs.end_date)} className="btn btn-success">Create Contact</button>
                                        ) : null}
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
              
                            </tbody>
                          </table>
                        </div>
                        
                        {/* {
                          requestList.length === 0 ? (
                              <tr><td colSpan="10">No job request found</td></tr>
                          ) : (
                            requestList.map((jobs) => (
                              <div className="appointment-wrap">
                            <ul>
                              <li>
                                <div className="patinet-information">
                                  <div className="patient-info">
                                    <p>Created On</p>
                                    <h6>
                                    <i className="fa-solid fa-clock" />&nbsp;<Link to="#">{convertToUS(jobs.created_on,"DateTime")}</Link>
                                    </h6>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="patinet-information px-1">
                                  <div className="patient-info">
                                    <p>Job Title</p>
                                    <h6>
                                    <Link to="#" style={{fontSize:"20px"}}>Python full stack developer using django</Link>
                                    </h6>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="patinet-information" style={{minWidth:"0px"}}>
                                  <div className="patient-info">
                                    <p>Start Date</p>
                                    <h6>
                                    <Link to="#">{convertToUS(jobs.start_date,"Date")}</Link>
                                    </h6>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="patinet-information" style={{minWidth:"0px"}}>
                                  <div className="patient-info">
                                    <p>End Date</p>
                                    <h6>
                                    <Link to="#">{convertToUS(jobs.end_date,"Date")}</Link>
                                    </h6>
                                  </div>
                                </div>
                              </li>
                              <ul>
                                <li className="appointment-detail-btn text-success my-2" >
                                  <Link
                                    to="#"
                                    className="start-link"
                                  >
                                    {jobs.status}
                                  </Link>
                                </li>
                                <li className="appointment-detail-btn my-2">
                                <Link
                                  to="#"
                                  className="start-link"
                                  onClick={()=>setJobID(jobs.id,jobs.professional_id)}
                                >
                                  View Details
                                </Link>
                              </li>
                              {(jobs.status === "Confirmed") 
                              ?
                              <li className="appointment-detail-btn my-2">
                                <Link
                                  to="#"
                                  className="start-link"
                                  onClick={()=> createContract(jobs.job_id,jobs.id,jobs.start_date,jobs.end_date)}
                                >
                                  Create Contract
                                </Link>
                              </li>
                              :
                              null
                              }

                              </ul>
                              
                            </ul>
                          </div>
                              
                            ))
                          )
                        } */}
                      </div>
                      </div>
                    </div>
                    {/* /Appointment Tab */}
                    {/* Prescription Tab */}
                    <div className="tab-pane fade" id="prescription">
                      {/* <div className="search-header">
                        <div className="search-field">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                          />
                          <span className="search-icon">
                            <i className="fa-solid fa-magnifying-glass" />
                          </span>
                        </div>
                      </div> */}
                      <div className="tab-content appointment-tab-content">
                        <div
                          className="tab-pane fade show active"
                          id="pills-upcoming"
                          role="tabpanel"
                          aria-labelledby="pills-upcoming-tab"
                        >
                        <div className="table-responsive border rounded">
                          <table className="table table-center mb-0 table-striped table-hover">
                            <thead>
                              <tr className="bg-primary text-white">
                                <th onClick={() => handleContractSort('created_on')} style={{ cursor: "pointer" }} className="bg-primary text-white">Created On {sortContractOrder === 'asc' ? '↑' : '↓'}</th>
                                <th onClick={() => handleContractSort('job_title')} style={{ cursor: "pointer" }} className="bg-primary text-white">Job Title {sortContractOrder === 'asc' ? '↑' : '↓'}</th>
                                <th onClick={() => handleContractSort('start_date')} style={{ cursor: "pointer" }} className="bg-primary text-white">Start Date {sortContractOrder === 'asc' ? '↑' : '↓'}</th>
                                <th onClick={() => handleContractSort('end_date')} style={{ cursor: "pointer" }} className="bg-primary text-white">End Date {sortContractOrder === 'asc' ? '↑' : '↓'}</th>
                                <th onClick={() => handleContractSort('status')} style={{ cursor: "pointer" }} className="bg-primary text-white">Status {sortContractOrder === 'asc' ? '↑' : '↓'}</th>
                                <th className="bg-primary text-white">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {contractData.length === 0 ? (
                                <tr><td colSpan="10" style={{ fontSize: "15px", padding: "15px", }}>No contract found</td></tr>
                              ) : (
                                contractData.map((contract) => (
                                  <tr key={contract.id}>
                                    <td>{convertToUS(contract.created_on,"DateTime")}</td>
                                    <td>{contract.job_title}</td>
                                    <td>{convertToUS(contract.start_date,"Date")}</td>
                                    <td>{convertToUS(contract.end_date,"Date")}</td>
                                    <td>{contract.status}</td>                                                          
                                    <td>
                                      <div className="action-item">
                                        <button onClick={()=>handleContractView(contract.id)} className="btn btn-primary">View</button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
              
                            </tbody>
                          </table>
                        </div>
                        
                        {/* {
                          contractData.length === 0 ? (
                              <tr><td colSpan="10">No contract found</td></tr>
                          ) : (
                            contractData.map((contract) => (
                              <div className="appointment-wrap">
                            <ul>
                              <li>
                                <div className="patinet-information">
                                  <div className="patient-info">
                                    <p>Created On</p>
                                    <h6>
                                    <i className="fa-solid fa-clock" />&nbsp;<Link to="#">{convertToUS(contract.created_on,"DateTime")}</Link>
                                    </h6>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="patinet-information px-1">
                                  <div className="patient-info">
                                    <p>Job  Title</p>
                                    <h6>
                                    <Link to="#" style={{fontSize:"20px"}}>{contract.job_title}</Link>
                                    </h6>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="patinet-information" style={{minWidth:"0px"}}>
                                  <div className="patient-info">
                                    <p>Start Date</p>
                                    <h6>
                                    <Link to="#">{convertToUS(contract.start_date,"Date")}</Link>
                                    </h6>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="patinet-information" style={{minWidth:"0px"}}>
                                  <div className="patient-info">
                                    <p>End Date</p>
                                    <h6>
                                    <Link to="#">{convertToUS(contract.end_date,"Date")}</Link>
                                    </h6>
                                  </div>
                                </div>
                              </li>
                              <ul>
                                <li className="appointment-detail-btn text-success my-2" >
                                  <Link
                                    to="#"
                                    className="start-link"
                                  >
                                    {contract.status}
                                  </Link>
                                </li>
                                <li className="appointment-detail-btn my-2">
                                <Link
                                  to="#"
                                  className="start-link"
                                  onClick={()=>handleContractView(contract.id)}
                                >
                                  View Details
                                </Link>
                              </li>
                              </ul>
                              
                            </ul>
                          </div>
                              
                            ))
                          )
                        } */}
                      </div>
                      </div>
                    </div>
                    {/* /Prescription Tab */}
                  </div>
                </div>
              </div>
              {/* /Doctor Widget */}
            </div>
          </div>
          {/* /Page Content */}
        </>

        <SiteFooter />

      </div>
    </>
  )
}

export default JobViewPage;