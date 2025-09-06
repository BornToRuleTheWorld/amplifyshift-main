import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL,AUTH_TOKEN, disciplineOptions, specialtyOptions, visitType, jobTypeOptions, sortFieldOptions, sortOrderOptions, workSettingOptions, yearOptions, stateOptions, cntryOptions, langOptions, ColourOption, SingleValue, MultiValueLabel, statusOptions} from "../config";
import { convertToUS } from "../utils";
import Pagination from '../pagination';
import { FaTimesCircle, FaEye, FaSearch, FaHourglassHalf, FaPlusCircle, FaPen, FaPlus } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import SiteHeader from "../home/header.jsx";
import SiteFooter from "../home/footer.jsx";
import { doctor_thumb_01, doctor_thumb_02, doctor_thumb_03, doctor_thumb_05, doctor_thumb_07, doctor_thumb_08, doctor_thumb_09, logo } from "../../imagepath.jsx";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import AdminPagination from "../admin/AdminPagination.jsx";
import MessagePopup from "../messagePopup.js";

const JobListPage = (props) => {
  const [show, setShow] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false)
  const [deleteID, setDeleteID] = useState(null)
  
  const handleYes = () => {
    setShow(false);
    setDeletePopup(true)
  }

  const handleNo = () => {
    setShow(false);
    setDeletePopup(false)
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const facID = atob(localStorage.getItem('userID')) || "";
  const history = useHistory();

  const [job, setjob] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [sortOrder, setSortOrder] = useState({value:"desc", label:"Descending"});
  const [sortField, setSortField] = useState({value:"created", label:"Created On"});

  const [srchSubmit, setsrchSubmit] = useState(false);
  const [srchError, setsrchError] = useState();
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
  const [srchJobStatus, setSrchJobStatus] = useState([]);


  const [addSearch, setAddSearch] = useState(false);
  
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
      }
      else if (name="srchJobStatus"){
        setSrchJobStatus(value)
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
      setsrchError();
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
    
    const handleAdd = () => history.push('/facility/addjob')

    const fetchjob = async () => {
      const data = {
        FacID : facID,
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
          const response = await axios.post(`${API_BASE_URL}/jobs/GetAllJobs/`,data,{
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
              setjob(response.data.data);
              setSuccess(null);
              setError(null);
            }
            else {
              setjob([]);
              setSuccess('No job data available');
              setError(null);
            }
    
          }
        } catch (err) {
          console.log('responseError', err);
          setjob([]);
          setError("An error occurred while fetching job list");
          setSuccess(null);
        }
    };

    const deletejob = async (id) => {
      setError(null)
      setSuccess(null)
      handleShow()
      setDeleteID(id)
    };

    const removeJob = async(id) => {
      try {
        await axios.delete(`${API_BASE_URL}/jobs/DeleteJobs/${id}/`,{
            headers: { 
                "Content-Type": "application/json",
                'Authorization': AUTH_TOKEN
            },
        });
        setjob(job.filter((job) => job.id !== id));
        setSuccess("Job deleted successfully")
      } catch (err) {
          setError(err.response?.data?.Result || "Error deleting job");
      }finally{
        setDeletePopup(false)
    }
    }

    const viewJob = async (id) => {
      localStorage.setItem("currentJobID",btoa(id))
      history.push("/facility/viewjob") 
    }

    const editJob = async (id) => {
      localStorage.setItem("updateJobID",btoa(id))
      history.push("/facility/updatejob") 
    }

    const searchJob = async (id) => {
      localStorage.setItem('searchJobID',btoa(id))
      localStorage.setItem('setJobSearch',true)
      history.push('/facility/search')
    }

    const jobWorkHours = async(id) =>{
      localStorage.setItem('facJobID',btoa(id))
      history.push('/facility/job-work-hours')
    }

    useEffect(() => {
      fetchjob();
    },[facID,srchSubmit,currentPage]);

    useEffect(() => {
      if(deletePopup){
        removeJob(deleteID);
      }
    }, [deletePopup]);

      const handleSort = (field) => {
        let newSortOrder = 'asc';
        if (sortField === field && sortOrder === 'asc') {
          newSortOrder = 'desc';
        }
        setSortOrder(newSortOrder);
        setSortField(field);
    
        const sortedData = [...job].sort((a, b) => {
          if (field === 'status' || field === 'contact_person' || field === 'job_title' ) {
            const nameA = a[field].toLowerCase();
            const nameB = b[field].toLowerCase();
            if (nameA < nameB) return newSortOrder === 'asc' ? -1 : 1;
            if (nameA > nameB) return newSortOrder === 'asc' ? 1 : -1;
            return 0;
          } else if (field === 'start_date' || field === 'end_date') {
            const dateA = new Date(a[field]);
            const dateB = new Date(b[field]);
            return newSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
          }
          return 0;
        });
    
        setjob(sortedData);
      };
  
    console.log("srchSubmit",srchSubmit)
    console.log("job",job)

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
                    {/* <li className="breadcrumb-item active">Job</li> */}
                  </ol>
                  <h2 className="breadcrumb-title">Jobs</h2>
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
      <div className="content doctor-content">
        <div className="container">
          <div className="row">
            {/* Invoices */}
            <div className="col-lg-12 col-xl-12">
                
              <div className="dashboard-header">
                {/* <h3>Jobs <FaPlusCircle title="Add job" className="text-success m-1" onClick={handleAdd}/></h3> */}
                
              </div>
              {/* {(job.length === 0) ? 
              null
              :
              <div className="search-header">
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
              </div>
              } */}
              <form onSubmit={handleSearchSubmit}>
                <div className="row my-4 px-2">
                  <div className="col-3 p-1 border-none">
                    <label className="form-label">Disciplines</label>
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
                    <input
                      type="text"
                      name="srchKeyword"
                      className="form-control"
                      placeholder="Searh Keyword"
                      value={srchKeyword}
                      onChange={handleSearchKeyword}
                    />
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
                    <label className="form-label">Status</label>
                    <Select
                      name="srchJobStatus"
                      //className="form-control"                  
                      classNamePrefix="react-select"
                      placeholder="Select Status"
                      value={srchJobStatus}
                      options={statusOptions}
                      onChange={(selected) => handleSelectChange(selected, 'srchJobStatus')}
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
                  
                  </>}
      
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
                      {addSearch ? 'Hide search' : 'Advance search'}
                      </Link>
                    </div>
                  </div>

                </div>
              </form>
              <div className="row my-2 px-2">
                <div className="col-2">
                  <div className="row-sm d-flex justify-content-start">
                    <button className="btn btn-primary" onClick={handleAdd}><FaPlus className="text-white bg-primary"/> Create Job </button>
                  </div>
                </div>
                <div className="offset-4 col-3 p-1">
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
              <div className="tab-content appointment-tab-content">
                <div
                  className="tab-pane fade show active"
                  id="pills-upcoming"
                  role="tabpanel"
                  aria-labelledby="pills-upcoming-tab"
                >
                {
                job.length === 0 ?
                  <div className="col-lg-12">
                    <div className="card doctor-list-card">
                      <div className="d-md-flex align-items-center">
                        <div className="card-body p-0">
                          <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                            <Link to="#" className="text-teal fw-medium fs-14">
                              No job data available
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                :
                job.map((job, index) => (
                <div className="appointment-wrap" key={`${job.id}-${index}`}>
                  <ul>
                    <li className="mb-1">
                      <p>
                        <i className="fa-solid fa-clock" />&nbsp;
                        {convertToUS(job.created,"DateTime")}
                      </p>
                    </li>
                    <li className="mb-1">
                      <p>
                        {
                          (() => {
                            const option = disciplineOptions.find(disp => disp.value == job.discipline);
                            return option ? (
                              <span style={{ backgroundColor: option.color, color:"white", padding:"5px",borderRadius:"5px" }}>{option.label}</span>
                            ) : "N/A";
                          })()
                        }
                      </p>
                    </li>
                    <li className="mb-1">
                      <p><Link to="#" onClick={() => viewJob(job.id)}>{job.job_title}</Link></p>
                    </li>
                    <li className="mb-1">
                      <p>
                      <i className="fa-solid fa-calendar-days" />&nbsp;
                      {job.start_date &&
                        convertToUS(job.start_date, "Date")
                      }
                      </p>
                    </li>
                    <li className="mb-1">
                      <p>
                      <i className="fa-solid fa-calendar-days" />&nbsp;
                      {job.end_date &&
                        convertToUS(job.end_date, "Date")
                      }
                      </p>
                    </li>
                    <li className="mb-1"><p>{job.zipcode}</p></li>
                    <li className="mb-1">
                      <p>
                      {
                        job.contract_created
                        ?
                          <Link to="#" className="text-success font-weight-bold" style={{fontWeight:"bolder"}}>Contract Created</Link>
                        :
                        job.status === "Active"
                          ?
                          <Link to="#" className="text-success font-weight-bold" style={{fontWeight:"bolder"}}>{job.status}</Link>
                          :
                          <Link to="#" className="text-danger font-weight-bold" style={{fontWeight:"bolder"}}>{job.status}</Link>
                      }
                      </p>
                    </li>
                    <li className="mb-1">
                      <p>$ {job.pay}</p>
                    </li>
                    <li className="mb-1">
                      <p>
                        {job.contract_created === false ? <FaPen title="Update job" onClick={() => editJob(job.id)} /> : null}&nbsp;&nbsp;
                        <FaEye title="View job" className="text-primary" style={{fontSize:"19px"}} onClick={() => viewJob(job.id)}/>
                        <FaTimesCircle title="Delete job" className="text-danger m-2" style={{fontSize:"17px"}} onClick={() => deletejob(job.id)}/>
                        {(job.status === "Inactive") 
                        ?
                        // <FaHourglassHalf title="Add Work Hours" className="text-secondary" style={{fontSize:"17px"}} onClick={() => jobWorkHours(job.id)} />
                        null
                        :
                        <FaSearch title="Search professional" className="text-secondary" style={{fontSize:"17px"}} onClick={() => searchJob(job.id)}/>
                        } 
                      </p>
                    </li>
                  </ul>
                  <ul className="mb-2">
                    <div className="row text-sm">

                    {job.speciality &&
                      <div className="col-auto">
                        <Link to="#">
                          {specialtyOptions.map(spl => {
                            if (spl.value === job.speciality) {
                              return spl.label;
                            }
                          return null;
                          })}
                        </Link>&nbsp;&nbsp;/
                      </div>
                      }

                      {job.work_setting && 
                      <div className="col-auto">
                        <Link to="#">
                          {workSettingOptions.map(visit => {
                              if (visit.value === job.work_setting) {
                                  return visit.label
                              }
                              return null;
                          })}
                        </Link>&nbsp;&nbsp;/
                      </div>}

                      {job.job_type &&
                      <div className="col-auto">
                        <Link to="#">
                          {jobTypeOptions.map(spl => {
                            if (spl.value === job.job_type) {
                              return spl.label;
                            }
                          return null;
                          })}
                        </Link>&nbsp;&nbsp;/
                      </div>
                      }
                      
                      {job.visit_type &&
                      <div className="col-auto">
                        <Link to="#">
                          {visitType.map(visit => {
                              if (visit.value === job.visit_type) {
                                  return visit.label
                              }
                              return null;
                          })}
                        </Link>&nbsp;&nbsp;/
                      </div>
                      }

                      {job.years_of_exp &&
                      <div className="col-auto">
                        <Link to="#">
                        {job.years_of_exp ? yearOptions.find(option => option.value === job.years_of_exp).label : "N/A"}
                        </Link>&nbsp;&nbsp;/
                      </div>
                      }

                      {job.contact_person &&
                      <div className="col-auto">
                        <Link to="#">
                        {job.contact_person}
                        </Link>&nbsp;&nbsp;/
                      </div>
                      }
                      <div className="col-auto">
                        <Link to="#">
                        {stateOptions.find(option => option.value == job.state)?.label},&nbsp;
                        {cntryOptions.find(option => option.value == job.country)?.label}
                        </Link>
                      </div>-

                      <div className="col-auto">
                        <label className="text-primary">By</label>&nbsp;&nbsp;
                        <Link to="#">
                          {job.created_by}
                        </Link>
                      </div>
                    </div>
                  </ul>
                  
                  
                  {/* <ul>
                    <li className="appointment-info">
                      <p>
                        <i className="fa-solid fa-clock" />
                        {convertToUS(job.created,"DateTime")}
                      </p>
                      <ul className="d-flex apponitment-types">
                        <li>General Visit</li>
                        <li>Video Call</li>
                      </ul>
                    </li>
                    <li>
                      <div className="patinet-information">
                        <div className="patient-info">
                          <p>
                            {
                              (() => {
                                const option = disciplineOptions.find(disp => disp.value == job.discipline);
                                return option ? (
                                  <span style={{ color: option.color }}>{option.label}</span>
                                ) : "N/A";
                              })()
                            }
                          </p>
                          <h6>
                            <Link to="#">
                            {job.job_title}
                            </Link>
                          </h6>
                        </div>
                      </div>
                    </li>
                    <li className="mail-info-patient">
                      <ul>
                        <li>
                          <i className="fa-solid fa-calendar-days" />
                          {job.start_date &&
                              convertToUS(job.start_date, "Date")
                            }
                        </li>
                        <li>
                          <i className="fa-solid fa-calendar-days" />
                          {job.end_date &&
                              convertToUS(job.end_date, "Date")
                            }
                        </li>
                      </ul>
                    </li>
                    <li>
                      <div className="mail-info-patient">
                        <ul>
                          <li>
                            <i className="fa-solid fa-envelope" />
                            edalin@example.com
                          </li>
                          <li>
                            <i className="fa-solid fa-phone" />
                            +1 504 368 6874
                          </li>
                        </ul>
                      </div>
                    </li>
                    
                    <li className="appointment-action">
                      <ul>
                        <li>
                          <Link to="/patient/upcoming-appointment">
                            <i className="fa-solid fa-eye" />
                          </Link>
                        </li>
                        <li>
                          <Link to="#">
                            <i className="fa-solid fa-comments" />
                          </Link>
                        </li>
                        <li>
                          <Link to="#">
                            <i className="fa-solid fa-xmark" />
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="appointment-detail-btn">
                      <Link to="#" className="start-link">
                        <i className="fa-solid fa-calendar-check me-1" />
                        Attend
                      </Link>
                    </li>
                  </ul> */}
                </div>
                ))}
                {/* <div className="table-responsive">
                  <table className="table table-center mb-0 table-hover table-striped cust-table">
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
                      {job.length === 0 ? (
                        <tr><td colSpan="15" style={{ fontSize: "19px", padding: "15px", }}>Loading...</td></tr>
                      ) : (
                        job.map((job) => (
                          <>
                          <tr key={job.id}>
                            <td>{convertToUS(job.created,"DateTime")}</td>
                            <td>
                              {
                              (() => {
                                const option = disciplineOptions.find(disp => disp.value == job.discipline);
                                return option ? (
                                  <span style={{ color: option.color }}>{option.label}</span>
                                ) : "N/A";
                              })()
                            }
                            </td>
                            <td>{job.job_title}</td>
                            <td>{job.start_date &&
                              convertToUS(job.start_date, "Date")
                            }</td>
                            <td>{job.end_date &&
                              convertToUS(job.end_date, "Date")
                            }</td>
                            <td>{job.zipcode}</td>
                            <td>
                            {job.status === "Active"
                            ?
                            <Link to="#" className="text-success font-weight-bold">{job.status}</Link>
                            :
                            <Link to="#" className="text-danger font-weight-bold">{job.status}</Link>
                            }
                            </td>
                            <td>$ {job.pay}</td>
                            <td>
                              <div className="action-item">
                              <FaPen title="Update job" onClick={() => editJob(job.id)}/>&nbsp;&nbsp;
                              <FaEye title="View job" className="text-primary" style={{fontSize:"19px"}} onClick={() => viewJob(job.id)}/>
                              <FaTimesCircle title="Delete job" className="text-danger m-2" style={{fontSize:"17px"}} onClick={() => deletejob(job.id)}/>
                              {(job.status === "Inactive") 
                              ?
                              <FaHourglassHalf title="Add Work Hours" className="text-secondary" style={{fontSize:"17px"}} onClick={() => jobWorkHours(job.id)} />
                              :
                              <FaSearch title="Search professional" className="text-secondary" style={{fontSize:"17px"}} onClick={() => searchJob(job.id)}/>
                              } 
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={15}>
                              <div className="row text-sm">
                                <div className="col-auto">
                                  <Link to="#">
                                    {specialtyOptions.map(spl => {
                                      if (spl.value === job.speciality) {
                                        return spl.label;
                                      }
                                    return null;
                                    })}
                                  </Link>
                                </div>/
                                <div className="col-auto">
                                  <Link to="#">
                                    {workSettingOptions.map(visit => {
                                        if (visit.value === job.work_setting) {
                                            return visit.label
                                        }
                                        return null;
                                    })}
                                  </Link>
                                </div>/
                                <div className="col-auto">
                                  <Link to="#">
                                    {jobTypeOptions.map(spl => {
                                      if (spl.value === job.job_type) {
                                        return spl.label;
                                      }
                                    return null;
                                    })}
                                  </Link>
                                </div>/
                                <div className="col-auto">
                                  <Link to="#">
                                    {visitType.map(visit => {
                                        if (visit.value === job.visit_type) {
                                            return visit.label
                                        }
                                        return null;
                                    })}
                                  </Link>
                                </div>/
                                <div className="col-auto">
                                  <Link to="#">
                                  {yearOptions.find(option => option.value === job.years_of_exp).label}
                                  </Link>
                                </div>/
                                <div className="col-auto">
                                  <Link to="#">
                                  {job.contact_person}
                                  </Link>
                                </div>/
                                <div className="col-auto">
                                  <Link to="#">
                                  {stateOptions.find(option => option.value == job.state)?.label},&nbsp;
                                  {cntryOptions.find(option => option.value == job.country)?.label}
                                  </Link>
                                </div>-

                                <div className="col-auto">
                                  <label className="text-primary">By</label>&nbsp;&nbsp;
                                  <Link to="#">
                                    {job.created_by}
                                  </Link>
                                </div>
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
                                          if (spl.value === job.speciality) {
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
                                            if (visit.value === job.work_setting) {
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
                                          if (spl.value === job.job_type) {
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
                                            if (visit.value === job.visit_type) {
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
                                      {yearOptions.find(option => option.value === job.years_of_exp).label}
                                      </Link>
                                  </p>
                                  
                                  <p style={{fontSize:"14px"}}>
                                  <label className="text-primary">Contact Person</label> - &nbsp;
                                      <Link to="#">
                                      {job.contact_person}
                                      </Link>
                                  </p>
                                </div>
                                <div className="col">
                                  <p style={{fontSize:"14px"}}>
                                      <Link to="#">
                                      {stateOptions.find(option => option.value == job.state)?.label},&nbsp;&nbsp;
                                      {cntryOptions.find(option => option.value == job.country)?.label}
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
                </div>
              </div>
            </div>
            {/* /Invoices */}
          </div>
        </div>
      </div>
      {/* /Page Content */}
      {/*View Invoice */}
      <div className="modal fade custom-modals" id="invoice_view">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">View Invoice</h3>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="modal-body pb-0">
              <div className="prescribe-download">
                <h5>21 Mar 2025</h5>
                <ul>
                  <li>
                    <Link to="#" className="print-link">
                      <i className="isax isax-printer5" />
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="btn btn-primary prime-btn">
                      Download
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="view-prescribe invoice-content">
                <div className="invoice-item">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="invoice-logo">
                        <img src={logo} alt="logo" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <p className="invoice-details">
                        <strong>Invoice No : </strong> #INV005
                        <br />
                        <strong>Issued:</strong> 21 Mar 2025
                      </p>
                    </div>
                  </div>
                </div>
                {/* Invoice Item */}
                <div className="invoice-item">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="invoice-info">
                        <h6 className="customer-text">Billing From</h6>
                        <p className="invoice-details invoice-details-two">
                          Edalin Hendry <br />
                          806 Twin Willow Lane, <br />
                          Newyork, USA <br />
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="invoice-info">
                        <h6 className="customer-text">Billing To</h6>
                        <p className="invoice-details invoice-details-two">
                          Richard Wilson <br />
                          299 Star Trek Drive
                          <br />
                          Florida, 32405, USA
                          <br />
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="invoice-info invoice-info2">
                        <h6 className="customer-text">Payment Method</h6>
                        <p className="invoice-details">
                          Debit Card <br />
                          XXXXXXXXXXXX-2541
                          <br />
                          HDFC Bank
                          <br />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Invoice Item */}
                {/* Invoice Item */}
                <div className="invoice-item invoice-table-wrap">
                  <div className="row">
                    <div className="col-md-12">
                      <h6>Invoice Details</h6>
                      <div className="table-responsive">
                        <table className="invoice-table table table-bordered">
                          <thead>
                            <tr>
                              <th>Description</th>
                              <th>Quatity</th>
                              <th>VAT</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>General Consultation</td>
                              <td>1</td>
                              <td>$0</td>
                              <td>$150</td>
                            </tr>
                            <tr>
                              <td>Video Call</td>
                              <td>1</td>
                              <td>$0</td>
                              <td>$100</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-md-6 col-xl-4 ms-auto">
                      <div className="table-responsive">
                        <table className="invoice-table-two table">
                          <tbody>
                            <tr>
                              <th>Subtotal:</th>
                              <td>
                                <span>$350</span>
                              </td>
                            </tr>
                            <tr>
                              <th>Discount:</th>
                              <td>
                                <span>-10%</span>
                              </td>
                            </tr>
                            <tr>
                              <th>Total Amount:</th>
                              <td>
                                <span>$315</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Invoice Item */}
                {/* Invoice Information */}
                <div className="other-info mb-0">
                  <h4>Other information</h4>
                  <p className="text-muted mb-0">
                    An account of the present illness, which includes the
                    circumstances surrounding the onset of recent health changes and
                    the chronology of subsequent events that have led the patient to
                    seek medicine
                  </p>
                </div>
                {/* /Invoice Information */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MessagePopup title={"Jobs"} message={"Are you sure to delete the job"} close={handleClose} show={show} yes={handleYes} no={handleNo}/>
      {/* /View Invoice */}
      {recordsPerPage < totalPages ? <AdminPagination totalPages={totalPages} recordsPerPage={recordsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} /> : ''}
      <SiteFooter />

    </div>
  );
};

export default JobListPage;
