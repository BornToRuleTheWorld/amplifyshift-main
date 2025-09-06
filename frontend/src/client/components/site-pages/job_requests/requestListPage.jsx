import React, {useState, useEffect} from "react";
import Header from "../../header.jsx";
import SiteHeader from "../home/header.jsx";
import SiteFooter from "../home/footer.jsx";
import DoctorFooter from "../../common/doctorFooter/index.jsx";
import { doctordashboardprofile01, doctordashboardprofile02, doctordashboardprofile04, doctordashboardprofile05, doctordashboardprofile06, doctordashboardprofile07, doctordashboardprofile08, doctordashboardprofile3 } from "../../imagepath.jsx";
import { Link, useHistory } from "react-router-dom";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
import axios from "axios";
import { API_BASE_URL,AUTH_TOKEN, specialtyOptions, visitType, jobTypeOptions, boolOption, paginationDefaultCount, workSettingOptions, yearOptions, stateOptions, cntryOptions, langOptions, sortFieldOptions, sortOrderOptions, ColourOption, SingleValue, MultiValueLabel} from "../config";
import { convertToUS } from "../utils.js";
import { FaTimesCircle, FaEye, FaPen } from "react-icons/fa";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import AdminPagination from "../admin/AdminPagination.jsx";
import { getCurrentUserDiscipline } from "../utils.js";

const RequestListPage = (props) => {
    
    const disciplineOptions = getCurrentUserDiscipline()
    const Group = atob(localStorage.getItem('group')) || "";
    const LoginID = atob(localStorage.getItem('userID')) || "";
    const history = useHistory();

    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(3);
    const [totalPages, setTotalPages] = useState(0);
    
    const [requestList, setRequestList] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [sortOrder, setSortOrder] = useState({value:"desc", label:"Descending"});
    const [sortField, setSortField] = useState({value:"created", label:"Created On"});

    const [addSearch, setAddSearch] = useState(false);

     const [expandedJobId, setExpandedJobId] = useState(null);
    
    const toggleView = (jobId) => {
      setExpandedJobId(prevId => prevId === jobId ? null : jobId);
    };

    const handleRequestView = async(id) => {
      toggleView(id)
    }

    const [srchSubmit, setsrchSubmit] = useState(false);
    const [srchKeyword, setsrchKeyword] = useState('');
    const [srchZipCode, setSrchZipCode] = useState('');
    const [srchStartDate, setsrchStartDate] = useState('');
    const [srchEndDate, setsrchEndDate] = useState('');
    const [srchLanguage, setSearchLanguage] = useState([]);
    const [srchWorkSetting, setsrchWorkSetting] = useState([]);
    const [srchDiscipline, setsrchDiscipline] = useState([]);
    const [srchSpeciality, setsrchSpeciality] = useState([]);
    const [srchVisitType, setSrchVisitType] = useState([]);
    const [srchJobType, setSrchJobType] = useState([]);

    const handleSelectChange = (value, name) => {
      
      if (name == 'srchLanguage') {
        setSearchLanguage(value);
      }
      else if (name == 'srchVisitType') {
        setSrchVisitType(value);
      }
      else if (name == 'srchVisitType') {
        setSrchVisitType(value);
      }
      else if (name == 'srchJobType') {
        setSrchJobType(value);
      }
      else if (name == 'srchDiscipline') {
        setsrchDiscipline(value);
      }
      else if (name == 'srchSpeciality') {
        setsrchSpeciality(value);
      }
      else if (name == 'srchWorkSetting') {
        setsrchWorkSetting(value);
      }else if ((name == 'sortByField')){
        setSortField(value)
        setsrchSubmit(true)
      }else if ((name == 'sortByOrder')){
        setSortOrder(value)
        setsrchSubmit(true)
      }

      if (srchSubmit){
        setsrchSubmit(false)
      }
    }
  
    const handleSearchKeyword = (e) => {
      setsrchKeyword(e.target.value);
    }
  
    const handleSearchZipCode = (e) => {
      setSrchZipCode(e.target.value);
    }

    const handleAddSearch = () => {
      setError(null)
      setAddSearch(!addSearch)
    }
  
    const handleSearchSubmit = (e) => {
      e.preventDefault();
      const validateResult = validateSearchInputs();
      console.log('srchResult', validateResult);
      if (validateResult) {
          setsrchSubmit(true)
      }
      else {
        setError('Please provide atleast one search data');
        setsrchSubmit(false);
      }
    }
  
    const validateSearchInputs = () => {
  
      if (srchLanguage.length > 0) {
        return true;
      }
      else if (srchVisitType.length > 0) {
        return true;
      }
      else if (srchJobType.length > 0) {
        return true;
      }
      else if (srchWorkSetting.length > 0) {
        return true;
      }
      else if (srchDiscipline.length > 0) {
        return true;
      }
      else if (srchSpeciality.length > 0) {
        return true;
      }
      else if (srchKeyword) {
        return true;
      }
      else if (srchZipCode) {
        return true;
      }
      else if (srchStartDate) {
        return true;
      }
      else if (srchEndDate) {
        return true;
      }
      return false;
    }
  
  
    const clearSearchValue = () => {
      setError();
      setsrchKeyword('');
      setSrchZipCode('');
      setsrchStartDate('');
      setsrchEndDate('');
      setSearchLanguage([]);
      setsrchWorkSetting([]);
      setsrchDiscipline([]);
      setsrchSpeciality([]);
      setSrchVisitType([]);
      setSrchJobType([]);
  
      if (srchSubmit) {
        setsrchSubmit(false);
      }
      else {
        setsrchSubmit(true);
      }
  
    }

    const fetchJobRequestList = async () => {
      setError(null)
      setSuccess(null)
      const data = {
        FacID : LoginID,
        CurrentPage: currentPage,
        RecordsPerPage: recordsPerPage,
        Keyword: srchKeyword,
        ZipCode: srchZipCode,
        StartDate: (srchStartDate)?moment(srchStartDate).format('YYYY-MM-DD'):'' ,
        EndDate: (srchEndDate)?moment(srchEndDate).format('YYYY-MM-DD'):'' ,
        Languages: srchLanguage,
        WorkSetting: srchWorkSetting,
        Discipline: srchDiscipline,
        Speciality: srchSpeciality,
        VisitType: srchVisitType,
        JobType: srchJobType,
        SortField: sortField,
        SortOrder:sortOrder
      }
      try {
        const response = await axios.post(`${API_BASE_URL}/job_request/GetAllJobRequest/`,data,{
            headers: { 
                "Content-Type": "application/json",
                'Authorization': AUTH_TOKEN
              },
        });
        if (response?.status === 200) {
          if (response.data.CurrentPage) setCurrentPage(response.data.CurrentPage);
          if (response.data.RecordsPerPage) setRecordsPerPage(response.data.RecordsPerPage);
          if (response.data.TotalCount) setTotalPages(response.data.TotalCount);
          if (response.data.data.length > 0) {
            setRequestList(response.data.data);
            setSuccess(null);
            setError(null);
          }
          else {
            setRequestList([]);
            setSuccess('No job request data available');
            setError(null);
          }
  
        }
      } catch (err) {
        console.log('responseError', err);
        setRequestList([]);
        setError("An error occurred while fetching job request list");
        setSuccess(null);
      }finally{
        setsrchSubmit(false)
      }
    };

    const setJobID = async (id,prof_id) =>{
        localStorage.setItem("requestID",btoa(id))
        localStorage.setItem("requestProfID",btoa(prof_id))
        history.push('/facility/job-request-view')
    }

    const updateStatus = async(id, status) =>{
            
            const data = {
                JobRequestID:id,
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
                fetchJobRequestList()
            } catch (err) {
                setError(err.response?.data?.Result || "An error occurred");
            }
        }

    useEffect(() => {
      console.log("fetchJobRequestList")
        fetchJobRequestList();
    },[Group,srchSubmit,currentPage]);

    console.log("requestList :",requestList)
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
                    {/* <li className="breadcrumb-item active">Job request</li> */}
                  </ol>
                  <h2 className="breadcrumb-title">Job Requests</h2>
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
              <div className="dashboard-header">
                {/* <h3>Job requests</h3> */}
                <ul className="header-list-btns">
                  {/* {
                  requestList.length === 0 ? null :
                  <li>
                    <div className="input-block dash-search-input">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                      />
                      <span className="search-icon">
                        <i className="fa-solid fa-magnifying-glass" />
                      </span>
                    </div>
                  </li>
                  } */}
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
                </ul>
              </div>
              <form onSubmit={handleSearchSubmit}>
                <div className="row my-4 px-2">
                  <div className="col-3 p-1 border-none">
                    <label className="form-label">Discipline</label>
                    <Select
                      isMulti
                      name="srchDiscipline"
                      //className="form-control"
                      classNamePrefix="react-select"
                      placeholder="Select Disciplines"
                      value={srchDiscipline}
                      options={disciplineOptions}
                      onChange={(selected) => handleSelectChange(selected, 'srchDiscipline')}
                      isClearable={true}
                      components={{ Option : ColourOption, SingleValue, MultiValueLabel }}
                    />
                  </div>
                  <div className="col-3 p-1">
                    <label className="form-label">Start Date</label>
                    <div className="form-icon">
                      <DatePicker
                        className="form-control datetimepicker"
                        name="srchStartDate"
                        selected={srchStartDate}
                        onChange={(date) => setsrchStartDate(date)}
                        dateFormat="M/d/yyyy"
                        showDayMonthYearPicker
                      />
                      <span className="icon">
                        <i className="fa-regular fa-calendar-days" />
                      </span>
                    </div>
                  </div>
                  <div className="col-3 p-1">
                    <label className="form-label">End Date</label>
                    <div className="form-icon">
                      <DatePicker
                        className="form-control datetimepicker"
                        name="srchEndDate"
                        selected={srchEndDate}
                        onChange={(date) => setsrchEndDate(date)}
                        dateFormat="M/d/yyyy"
                        showDayMonthYearPicker
                      />
                      <span className="icon">
                        <i className="fa-regular fa-calendar-days" />
                      </span>
                    </div>
                  </div>
                  <div className="col-3 p-1">
                    <label className="form-label">Keyword</label>
                    <div className="search-header">
                      <div className="search-field">
                          <input
                              type="text"
                              className="form-control"
                              value={srchKeyword}
                              onChange={handleSearchKeyword}
                              placeholder="Search Keyword"
                          />
                          <span className="search-icon">
                              <i className="fa-solid fa-magnifying-glass" />
                          </span>
                      </div>
                    </div>
                    {/* <div className="input-group">
                      <input
                        type="text"
                        name="srchKeyword"
                        className="form-control"
                        placeholder="Keyword Search"
                        value={srchKeyword}
                        onChange={handleSearchKeyword}
                      />
                      <span className="search-icon">
                        <i className="fas fa-search"></i>
                      </span>
                    </div> */}
                  </div>


                  {addSearch && 
                  <>
                  <div className="col-3 p-1">
                    <label className="form-label">Languages</label>
                    <Select
                      isMulti
                      name="srchLanguage"
                      //className="form-control"
                      classNamePrefix="react-select"
                      placeholder="Select Languages"
                      value={srchLanguage}
                      options={langOptions}
                      onChange={(selected) => handleSelectChange(selected, 'srchLanguage')}
                      isClearable={true}
                    />
                  </div>
                  <div className="col-3 p-1">
                    <label className="form-label">Work Settings</label>
                    <Select
                      isMulti
                      name="srchWorkSetting"
                      classNamePrefix="react-select"
                      placeholder="Select Work Settings"
                      value={srchWorkSetting}
                      options={workSettingOptions}
                      onChange={(selected) => handleSelectChange(selected, 'srchWorkSetting')}
                      isClearable={true}
                    />
                  </div>
                  
                  <div className="col-3 p-1">
                    <label className="form-label">Specialities</label>
                    <Select
                      isMulti
                      name="srchSpeciality"
                      //className="form-control"                  
                      classNamePrefix="react-select"
                      placeholder="Select Specialities"
                      value={srchSpeciality}
                      options={specialtyOptions}
                      onChange={(selected) => handleSelectChange(selected, 'srchSpeciality')}
                      isClearable={true}
                    />
                  </div>
      
                  <div className="col-3 p-1">
                    <label className="form-label">Visit Type</label>
                    <Select
                      isMulti
                      name="srchVisitType"
                      //className="form-control"                  
                      classNamePrefix="react-select"
                      placeholder="Select Visit Type"
                      value={srchVisitType}
                      options={visitType}
                      onChange={(selected) => handleSelectChange(selected, 'srchVisitType')}
                      isClearable={true}
                    />
                  </div>
      
                  <div className="col-3 p-1">
                    <label className="form-label">Job Type</label>
                    <Select
                      isMulti
                      name="srchJobType"
                      //className="form-control"                  
                      classNamePrefix="react-select"
                      placeholder="Select Job Type"
                      value={srchJobType}
                      options={jobTypeOptions}
                      onChange={(selected) => handleSelectChange(selected, 'srchJobType')}
                      isClearable={true}
                    />
                  </div>
      
                  <div className="col-3 p-1">
                    <label className="form-label">Zip Code</label>
                    <input
                      type="text"
                      name="srchZipCode"
                      className="form-control"
                      placeholder="Searh Zipcode"
                      value={srchZipCode}
                      onChange={handleSearchZipCode}
                    />
                  </div>
                  </>
                  }
                  {/* <div className= {addSearch ? "col-4" :"offset-9 col-4 mt-0"}>
                    <input type='submit' className="btn btn-primary mt-4" value='Search' style={{ zIndex: "0", pointerEvents: "auto" }} />
                    <input type='button' className="btn btn-primary mt-4 mx-2" value='Clear' onClick={clearSearchValue} style={{ zIndex: "0" }} />
                    <input type='button' className="btn btn-primary mt-4" value={addSearch ? 'Remove' : 'Advance'} onClick={handleAddSearch} style={{ zIndex: "0" }} />
                  </div> */}

                  <div className="row mt-4">
                    <div className="col d-flex align-items-start">
                      <input
                        type='submit'
                        className="btn btn-primary me-2"
                        value='Search'
                        style={{ zIndex: "0", pointerEvents: "auto" }}
                      />
                      <input
                        type='button'
                        className="btn btn-primary"
                        value='Clear'
                        onClick={clearSearchValue}
                        style={{ zIndex: "0" }}
                      />
                    </div>

                    <div className="col-auto ms-auto mt-1">
                      <Link
                        to = "#"
                        className="text-primary text-decoration-underline font-weight-bold"
                        onClick={handleAddSearch}
                        style={{fontWeight:"bolder"}}
                      >
                      {addSearch ? 'Hide search' : 'Advanced search'}
                      </Link>
                    </div>
                  </div>

                </div>
              </form>
              <div className="row my-2 px-2">
                <div className="offset-6 col-3 p-1">
                  <Select
                    name="sortByField"             
                    classNamePrefix="react-select"
                    placeholder="Select Field"
                    value={sortField}
                    options={sortFieldOptions}
                    onChange={(selected) => handleSelectChange(selected, 'sortByField')}
                    isClearable={true}
                  />
                </div>
                <div className="col-3 p-1">
                  <Select
                    name="sortByOrder"              
                    classNamePrefix="react-select"
                    placeholder="Select Order"
                    value={sortOrder}
                    options={sortOrderOptions}
                    onChange={(selected) => handleSelectChange(selected, 'sortByOrder')}
                    isClearable={true}
                  />
                </div>
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
              <div className="appointment-tab-head">
                {/* {
                  requestList.length === 0 ? null :
                <div className="appointment-tabs">
                  <ul
                    className="nav nav-pills inner-tab "
                    id="pills-tab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="pills-upcoming-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-upcoming"
                        type="button"
                        role="tab"
                        aria-controls="pills-upcoming"
                        aria-selected="false"
                      >
                        New
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-cancel-tab"
                        data-bs-toggle="pill"
                        // data-bs-target="#pills-cancel"
                        type="button"
                        role="tab"
                        aria-controls="pills-cancel"
                        aria-selected="true"
                      >
                        Open
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-complete-tab"
                        data-bs-toggle="pill"
                        // data-bs-target="#pills-complete"
                        type="button"
                        role="tab"
                        aria-controls="pills-complete"
                        aria-selected="true"
                      >
                        Interested
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="not-interested"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-not-interested"
                        type="button"
                        role="tab"
                        aria-controls="pills-not-interested"
                        aria-selected="true"
                      >
                        Not Interested
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="confirm"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-Confirm"
                        type="button"
                        role="tab"
                        aria-controls="pills-Confirm"
                        aria-selected="true"
                      >
                        Confirm
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="Rejected"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-Rejected"
                        type="button"
                        role="tab"
                        aria-controls="pills-Rejected"
                        aria-selected="true"
                      >
                        Rejected
                      </button>
                    </li>
                  </ul>
                </div>
                } */}
                {/* <div className="filter-head">
                  <div className="position-relative daterange-wraper me-2">
                    <div className="input-groupicon calender-input">
                      <DateRangePicker initialSettings={initialSettings}>
                        <input
                          className="form-control  date-range bookingrange"
                          type="text"
                        />
                      </DateRangePicker>
                    </div>
                    <i className="fa-solid fa-calendar-days" />
                  </div>
                  <Filter />
                </div> */}
              </div>
              <div className="tab-content appointment-tab-content">
                <div
                  className="tab-pane fade show active"
                  id="pills-upcoming"
                  role="tabpanel"
                  aria-labelledby="pills-upcoming-tab"
                >
                {
                  requestList.length === 0 ?
                    <div className="col-lg-12">
                      <div className="card doctor-list-card">
                        <div className="d-md-flex align-items-center">
                          <div className="card-body p-0">
                            <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                              <Link to="#" className="text-teal fw-medium fs-14">
                                No job request data available
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  :
  
                  requestList.map((job) => (
                  <>
                  <div className="appointment-wrap">
                    <div className="row justify-content-end align-items-center border-bottom mb-0">
                      <div className="col-auto">
                        <p><Link to="#" className="text-primary" onClick={()=>setJobID(job.id,job.professional)}><i className="fa-solid fa-eye" />&nbsp;View</Link></p>
                      </div>
                      {job.status === "Interested" ?
                      <>
                      <div className="col-auto">
                        <p><Link to="#" className="text-success" onClick={()=>updateStatus(job.id,"Confirmed")}><i className="fa-solid fa-check" />&nbsp;Accept</Link></p>
                      </div>
                      <div className="col-auto">
                        <p><Link to="#" className="text-danger" onClick={()=>updateStatus(job.id,"Rejected")}><i className="fa-solid fa-xmark" />&nbsp;Reject</Link></p>
                      </div>
                      </>
                      : null}
                      <div className="col-auto">
                        <p><Link to="#" onClick={()=>handleRequestView(job.id)} style={{fontWeight:"bolder"}} className="text-primary text-decoration-underline font-weight-bold">{expandedJobId === job.id ? "Hide" : "Show"}</Link></p>
                      </div>
                    </div>
                    <ul className="mt-4">
                      <li className="mb-1">
                        <p>
                          <i className="fa-solid fa-clock" />&nbsp;
                          {convertToUS(job.created,"DateTime")}
                        </p>
                      </li>
                      <li className="mb-1">
                        <p>{job.request_hours_count} {job.request_hours_count > 1 ? "hrs" : "hr"}</p>
                      </li>
                      <li className="mb-1">
                        <p>
                          {
                            (() => {
                              const option = disciplineOptions.find(disp => disp.value == job.job_data.discipline);
                              return option ? (
                                <span style={{ backgroundColor: option.color, color:"white", padding:"5px",borderRadius:"5px" }}>{option.label}</span>
                              ) : "N/A";
                            })()
                          }
                        </p>
                      </li>
                      <li className="mb-1">
                        <p>{job.professional.prof_first_name} {job.professional.prof_last_name}</p>
                      </li>
                      <li className="mb-1">
                        <p><Link to="#" onClick={()=>setJobID(job.id,job.professional)}>{job.job_data.job_title}</Link></p>
                      </li>
                      <li className="mb-1">
                        <p>
                        <i className="fa-solid fa-calendar-days" />&nbsp;
                        {job.job_data.start_date &&
                          convertToUS(job.job_data.start_date, "Date")
                        }
                        </p>
                      </li>
                      <li className="mb-1">
                        <p>
                        <i className="fa-solid fa-calendar-days" />&nbsp;
                        {job.job_data.end_date &&
                          convertToUS(job.job_data.end_date, "Date")
                        }
                        </p>
                      </li>
                      {/* <li className="mb-1"><p>{job.job_data.zipcode}</p></li> */}
                      <li className="mb-1">
                        <p>
                        {job.status === "Rejected" || job.status === "Not Interested"
                          ?
                          <Link to="#" className="text-danger font-weight-bold" style={{fontWeight:"bolder"}}>{job.status}</Link>
                          :
                          <Link to="#" className="text-success font-weight-bold" style={{fontWeight:"bolder"}}>{job.status}</Link>
                        }
                        </p>
                      </li>
                      <li className="mb-1">
                        <p>$ {job.job_data.pay}</p>
                      </li>
                      {/* <li className="mb-1">
                        <p><Link to="#" className="text-primary" onClick={()=>setJobID(job.id,job.professional)}><i className="fa-solid fa-eye" />&nbsp;View</Link></p>
                      </li>
                      {job.status === "Interested" ?
                      <>
                      <li className="mb-1">
                        <p><Link to="#" className="text-success" onClick={()=>updateStatus(job.id,"Confirmed")}><i className="fa-solid fa-check" />&nbsp;Accept</Link></p>
                      </li>
                      <li className="mb-1">
                        <p><Link to="#" className="text-danger" onClick={()=>updateStatus(job.id,"Rejected")}><i className="fa-solid fa-xmark" />&nbsp;Reject</Link></p>
                      </li>
                      </>
                      :
                      null
                      } */}
                      
                    </ul>
                    <ul className="mb-2">
                      <div className="row text-sm">
                        
                        {job.job_data.speciality &&
                        <div className="col-auto">
                          <Link to="#">
                            {specialtyOptions.map(spl => {
                              if (spl.value === job.job_data.speciality) {
                                return spl.label;
                              }
                            return null;
                            })}
                          </Link>&nbsp;&nbsp;/
                        </div>
                        }

                        {job.job_data.work_setting && 
                        <div className="col-auto">
                          <Link to="#">
                            {workSettingOptions.map(visit => {
                                if (visit.value === job.job_data.work_setting) {
                                    return visit.label
                                }
                                return null;
                            })}
                          </Link>&nbsp;&nbsp;/
                        </div>}

                        {job.job_data.job_type && 
                        <div className="col-auto">
                          <Link to="#">
                            {jobTypeOptions.map(spl => {
                              if (spl.value === job.job_data.job_type) {
                                return spl.label;
                              }
                            return null;
                            })}
                          </Link>&nbsp;&nbsp;/
                        </div>}

                        {job.job_data.visit_type &&
                        <div className="col-auto">
                          <Link to="#">
                            {visitType.map(visit => {
                                if (visit.value === job.job_data.visit_type) {
                                    return visit.label
                                }
                                return null;
                            })}
                          </Link>&nbsp;&nbsp;/
                        </div>}

                        {job.job_data.years_of_exp &&      
                        <div className="col-auto">
                          <Link to="#">
                          {yearOptions.find(option => option.value === job.job_data.years_of_exp).label}
                          </Link>&nbsp;&nbsp;/
                        </div>
                        }
                        
                        {job.job_data.contact_person && 
                        <div className="col-auto">
                          <Link to="#">
                          {job.job_data.contact_person}
                          </Link>&nbsp;&nbsp;/
                        </div>}

                        <div className="col-auto">
                          <Link to="#">
                          {stateOptions.find(option => option.value == job.job_data.state)?.label},&nbsp;
                          {cntryOptions.find(option => option.value == job.job_data.country)?.label}
                          </Link>&nbsp;&nbsp;/
                        </div>
                        <div className="col-auto">
                          <Link to="#">{job.job_data.zipcode}</Link>
                        </div>-
                        <div className="col-auto">
                          <label className="text-primary">By</label>&nbsp;&nbsp;
                          <Link to="#">
                            {job.created_by}
                          </Link>
                        </div>
                        {/* <div className="col-auto text-end ms-auto">
                          <Link to="#" onClick={()=>handleRequestView(job.id)} style={{fontWeight:"bolder"}} className="text-primary text-decoration-underline font-weight-bold">{expandedJobId === job.id ? "Hide" : "Show"}</Link>
                        </div> */}
                      </div>
                    </ul>
                  </div>
                  {/* view section */}
                  {expandedJobId === job.id && (
                  <div className="row mt-4">
                    <div className="appointment-wrap col-12">
                      <ul>
                        <li>
                          <div className="patinet-information">
                            <div className="patient-info">
                              <p>Created On</p>
                              <h6>
                              <i className="fa-solid fa-clock" />&nbsp;<Link to="#">{convertToUS(job.created,"DateTime")}</Link>
                              </h6>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="patinet-information px-1">
                            <div className="patient-info">
                              <p>Job  Title</p>
                              <h6>
                              <Link to="#" style={{fontSize:"20px"}}>{job.job_data.job_title}</Link>
                              </h6>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="patinet-information" style={{minWidth:"0px"}}>
                            <div className="patient-info">
                              <p>Start Date</p>
                              <h6>
                              <Link to="#">{convertToUS(job.job_data.start_date,"Date")}</Link>
                              </h6>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="patinet-information" style={{minWidth:"0px"}}>
                            <div className="patient-info">
                              <p>End Date</p>
                              <h6>
                              <Link to="#">{convertToUS(job.job_data.end_date,"Date")}</Link>
                              </h6>
                            </div>
                          </div>
                        </li>
                        <ul>
                        {job?.status === "Rejected" || job?.status === "Not Interested"
                        ?
                        <span className='text-danger px-4 font-weight-bold' style={{fontWeight:"bolder",fontSize:"19px"}}>
                          {job?.status}{" "}
                        </span>
                        :
                        <span className='text-success px-4 font-weight-bold' style={{fontWeight:"bolder",fontSize:"19px"}}>
                          {job?.status}{" "}
                        </span>
                        }
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
                              {job.job_data.contact_person}{" "}
                              </h4>
                              <p><b>Discipline</b> - {
                                                    (() => {
                                                      const option = disciplineOptions.find(disp => disp.value === job.job_data.discipline);
                                                      return option ? (
                                                        <span style={{ backgroundColor: option.color, color:"white", padding:"5px",borderRadius:"5px" }}>{option.label}</span>
                                                      ) : "N/A";
                                                    })()
                                                  },&nbsp; 
                                <b>Specialty</b> - {specialtyOptions.map(spl => {
                                                    if (spl.value === job.job_data.speciality) {
                                                      return spl.label;
                                                    }
                                                  return null;
                                                  })},&nbsp; 
                              <b>Work Setting</b> - {workSettingOptions.map(visit => {
                                if (visit.value === job.job_data.work_setting) {
                                    return visit.label
                                }
                                return null;
                                })}</p>
                              <div className="d-flex pb-2">
                              <span className="">
                                  <ImageWithBasePath src="assets/img/icons/watch-icon.svg" alt="Img" />
                              </span>
                              <p className='p-1'>{visitType.map(visit => {
                                if (visit.value === job.job_data.visit_type) {
                                    return visit.label
                                }
                                return null;
                              })}</p>
                              </div>
                              <p><b>Experience required</b> - {yearOptions.map(year => {if (year.value === job.job_data.years_of_exp) {return year.label} return null })},&nbsp;  
                              <b>License required</b> - {job.job_data.license ? boolOption.map(option => {if (option.value == job.job_data.license) {return option.label;}return "";}) : "N/A"},&nbsp;  <b>CPR/BLS</b> - {job.job_data.cpr_bls ? boolOption.map(option => {if (option.value == job.job_data.cpr_bls) {return option.label;}return "";}) : "N/A"},&nbsp;  <b>Pay</b> - ${job.job_data.pay}/hr</p>
                              <p><b>Speaks</b> - {langOptions.map(lang => {
                                if (lang.value === job.job_data.languages) {
                                    return lang.label
                                }
                                return null;
                            })}</p>
                          </div>
                          </div>
                          <div className="doc-info-right">
                          <div className="row align-items-center">
                              <div className="col-12">
                              <div className="clinic-info">
                                  <div className="detail-clinic fs-5">
                                  <h5>{job.job_data.address1}</h5>
                                  <p>{(job.job_data.address2) ? `${job.job_data.address2},` : null}{stateOptions.find(option => option.value == job.job_data.state).label}, {cntryOptions.find(option=> option.value == job.job_data.country).label}, {job.job_data.zipcode}</p>
                                  </div>
                              </div>
                              </div>
                              <div className="col-12">
                              <div className="contact-map d-flex">
                                  <iframe
                                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.7301009561315!2d-76.13077892422932!3d36.82498697224007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89bae976cfe9f8af%3A0xa61eac05156fbdb9!2sBeachStreet%20USA!5e0!3m2!1sen!2sin!4v1669777904208!5m2!1sen!2sin"
                                  allowFullScreen=""
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                                  className='h-50'
                                  />
                              </div>
                              </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                      {/* view section */}
                  </div>
                  )}
                  </>
                  ))}

                {/* <div className="table-responsive">
                  <table className="table table-center mb-0  table-striped table-hover">
                    <thead className="bg-primary text-white">
                      <tr className="bg-primary text-white">
                        <th className="bg-primary text-white">Created On</th>
                        <th className="bg-primary text-white">Discipline</th>
                        <th className="bg-primary text-white">Job Title</th>
                        <th className="bg-primary text-white">Start Date</th>
                        <th className="bg-primary text-white">End Date</th>
                        <th className="bg-primary text-white">Zipcode</th>
                        <th className="bg-primary text-white">Status</th>
                        <th className="bg-primary text-white">Payment/hr</th>
                        <th className="bg-primary text-white">Action</th>
                      </tr>
                    </thead>
                    <tbody>
  
                      {requestList.length === 0 ? (
                        <tr><td colSpan="15" style={{ fontSize: "19px", padding: "15px", }}>No job request found...</td></tr>
                      ) : (
                        requestList.map((job) => (
                          <>
                          <tr key={job.id}>
                            <td>{convertToUS(job.created,"DateTime")}</td>
                            <td>
                            {
                              (() => {
                                const option = disciplineOptions.find(disp => disp.value == job.job_data.discipline);
                                return option ? (
                                  <span style={{ backgroundColor: option.color, color:"white", padding:"5px",borderRadius:"5px" }}>{option.label}</span>
                                ) : "N/A";
                              })()
                            }
                            </td>
                            <td>{job.job_data.job_title}</td>
                            <td>{job.job_data.start_date &&
                              convertToUS(job.job_data.start_date, "Date")
                            }</td>
                            <td>{job.job_data.end_date &&
                              convertToUS(job.job_data.end_date, "Date")
                            }</td>
                            <td>{job.job_data.zipcode}</td>
                            <td>
                            {job.status === "Rejected" || job.status === "Not Interested"
                            ?
                            <Link to="#" className="text-danger font-weight-bold">{job.status}</Link>
                            :
                            <Link to="#" className="text-success font-weight-bold">{job.status}</Link>
                            }
                            </td>
                            <td>${job.job_data.pay}</td>
                            <td>
                              <div className="action-item">
                              <FaPen title="Update job request"/>&nbsp;&nbsp;
                              <FaEye title="View job request" className="text-primary" style={{fontSize:"19px"}} onClick={()=>setJobID(job.id,job.professional)}/>
                              <FaTimesCircle title="Delete job request" className="text-danger m-2" style={{fontSize:"17px"}}/>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={15}>
                              <div className="row">
                                <div className="col">
                                  <p style={{fontSize:"14px"}}>
                                    <label className="text-primary">Speciality</label> - &nbsp;
                                      <Link to="#">
                                        {specialtyOptions.map(spl => {
                                          if (spl.value === job.job_data.speciality) {
                                            return spl.label;
                                          }
                                        return null;
                                        })}
                                      </Link>
                                  </p>
                                  
                                  <p style={{fontSize:"14px"}}>
                                  <label className="text-primary">Work Setting</label> - &nbsp;
                                      <Link to="#">
                                        {workSettingOptions.map(visit => {
                                            if (visit.value === job.job_data.work_setting) {
                                                return visit.label
                                            }
                                            return null;
                                        })}
                                      </Link>
                                  </p>
                                </div>
                                <div className="col">
                                  <p style={{fontSize:"14px"}}>
                                  <label className="text-primary">Job Type</label> - &nbsp;
                                      <Link to="#">
                                        {jobTypeOptions.map(spl => {
                                          if (spl.value === job.job_data.job_type) {
                                            return spl.label;
                                          }
                                        return null;
                                        })}
                                      </Link>
                                  </p>
                                  
                                  <p style={{fontSize:"14px"}}>
                                  <label className="text-primary">Visit Type</label> - &nbsp;
                                      <Link to="#">
                                        {visitType.map(visit => {
                                            if (visit.value === job.job_data.visit_type) {
                                                return visit.label
                                            }
                                            return null;
                                        })}
                                      </Link>
                                  </p>
                                </div>
                                <div className="col">
                                  <p style={{fontSize:"14px"}}>
                                  <label className="text-primary">Experience</label> - &nbsp;
                                      <Link to="#">
                                      {yearOptions.find(option => option.value === job.job_data.years_of_exp).label}
                                      </Link>
                                  </p>
                                  
                                  <p style={{fontSize:"14px"}}>
                                  <label className="text-primary">Contact Person</label> - &nbsp;
                                      <Link to="#">
                                      {job.job_data.contact_person}
                                      </Link>
                                  </p>
                                </div>
                                <div className="col">
                                  <p style={{fontSize:"14px"}}>
                                      <Link to="#">
                                      {stateOptions.find(option => option.value == job.job_data.state)?.label},&nbsp;&nbsp;
                                      {cntryOptions.find(option => option.value == job.job_data.country)?.label}
                                      </Link>
                                  </p>
                                  
                                  <p style={{fontSize:"14px"}}>
                                  <label className="text-primary">Created By</label> - &nbsp;
                                      <Link to="#">
                                        {job.created_by}
                                      </Link>
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                          </>
                        ))
                      )}
      
                    </tbody>
                  </table>
                </div> */}
                
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
                            <p>Job  Title</p>
                            <h6>
                            <Link to="#" style={{fontSize:"20px"}}>{jobs.job_title}</Link>
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
                        <li>
                        <span className="btn btn-block w-100 btn-outline-success active">
                          <i className="fa-solid fa-circle" />&nbsp;
                          {jobs.status}{" "}
                        </span>
                        </li>
                        <li className="text-end">
                        <button className="btn btn-primary my-2" onClick={()=>setJobID(jobs.id,jobs.professional_id)}> View Details</button>
                        </li>
                      </ul>
                      
                    </ul>
                  </div>
                      
                    ))
                  )
                } */}
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
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      {recordsPerPage < totalPages ? <AdminPagination totalPages={totalPages} recordsPerPage={recordsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} /> : ''}
      <SiteFooter {...props} />
    </div>
  );
};

export default RequestListPage;
