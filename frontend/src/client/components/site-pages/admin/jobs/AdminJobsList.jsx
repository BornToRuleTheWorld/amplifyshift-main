import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN, disciplineOptions, specialtyOptions, visitType, jobTypeOptions, paginationDefaultCount, workSettingOptions, langOptions, ColourOption, SingleValue, MultiValueLabel } from "../../config.js";
import { convertToUS } from "../../utils.js";
import Pagination from '../../pagination.js';
import { FaTimesCircle, FaEye, FaSearch, FaHourglassHalf, FaPlusCircle } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import SiteHeader from "../../home/header.jsx";
import SiteFooter from "../../home/footer.jsx";
import { doctor_thumb_01, doctor_thumb_02, doctor_thumb_03, doctor_thumb_05, doctor_thumb_07, doctor_thumb_08, doctor_thumb_09, logo } from "../../../imagepath.jsx";
import ImageWithBasePath from "../../../../../core/img/imagewithbasebath.jsx";
import AdminPagination from "../AdminPagination.jsx";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

const AdminJobsList = (props) => {

  const [userData, setUserData] = useState([]);
  const [error, setError] = useState(null);
  const [sucMessage, setSucMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  //const [recordsPerPage, setRecordsPerPage] = useState(paginationDefaultCount);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  //search related vars
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
  const history = useHistory();

  const fetchUsers = async () => {

    const data = {
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
      JobType: srchJobType
    }
    console.log('responseIpData', data);

    try {
      const response = await axios.post(`${API_BASE_URL}/jobs/GetAllJobs/`, data, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': AUTH_TOKEN
        },
      });
      console.log('response', response);

      if (response?.status === 200) {
        if (response.data.CurrentPage) setCurrentPage(response.data.CurrentPage);
        if (response.data.RecordsPerPage) setRecordsPerPage(response.data.RecordsPerPage);
        if (response.data.TotalCount) setTotalPages(response.data.TotalCount);
        if (response.data.data.length > 0) {
          setUserData(response.data.data);
          setSucMessage(null);
          setError(null);
        }
        else {
          setUserData([]);
          setSucMessage('No job data available');
          setError(null);
        }

      }


    } catch (err) {
      console.log('responseError', err);
      setUserData([]);
      setError("An error occurred while fetching job list");
      setSucMessage(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, srchSubmit]);

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
  }

  const handleSearchKeyword = (e) => {
    setsrchKeyword(e.target.value);
  }

  const handleSearchZipCode = (e) => {
    setSrchZipCode(e.target.value);
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const validateResult = validateSearchInputs();
    console.log('srchResult', validateResult);
    if (validateResult) {
      setsrchError();
      if (srchSubmit) {
        setsrchSubmit(false);
      }
      else {
        setsrchSubmit(true);
      }
    }
    else {
      setsrchError('Please provide atleast one search data');
      if (srchSubmit) {
        setsrchSubmit(false);
      }
      else {
        setsrchSubmit(true);
      }
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

  const handleJobView = (id) => {
    localStorage.setItem("currentJobID",btoa(id))
    history.push("/site-user/job-view") 
  }


  console.log('srchInputs', srchLanguage);
  console.log('srchInputs', srchStartDate);

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
                      <a href="/home">
                        <i className="isax isax-home-15" />
                      </a>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      <Link to="/site-user/dashboard">Admin</Link>
                    </li>
                    {/* <li className="breadcrumb-item active">Jobs</li> */}
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
      <div style={{ margin: "10px" }}>

        {/*search form*/}

        {srchError ? (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {srchError}
          </div>
        ) : ''}

        <form onSubmit={handleSearchSubmit}>
          <div className="row my-5 px-2">
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
            <div className="col-3 p-1 border-none">
              <label className="form-label">Disiplines</label>
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

            <div className="col-3 p-1">
              <input type='submit' className="btn btn-primary mt-4 mx-2" value='Search' style={{ zIndex: "0", pointerEvents: "auto" }} />
              <input type='button' className="btn btn-primary mt-4" value='Clear' onClick={clearSearchValue} style={{ zIndex: "0" }} />
            </div>




          </div>
        </form>
        {/*search form*/}


        {/* <div className="custom-table"> */}

          {sucMessage ? (
            <div className="alert alert-success alert-dismissible fade show" role="alert"
            >
              {sucMessage}
            </div>
          ) : ''}

          {error ? (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
            </div>
          ) : ''}

          <div className="table-responsive custom-table">
            <table className="table table-center mb-0 table-striped table-hover">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="bg-primary text-white">Title</th>
                  <th className="bg-primary text-white">Start Date</th>
                  <th className="bg-primary text-white">End Date</th>
                  <th className="bg-primary text-white">Contact Person</th>
                  <th className="bg-primary text-white">Contact Number</th>
                  <th className="bg-primary text-white">Payment</th>
                  <th className="bg-primary text-white">Zipcode</th>
                  <th className="bg-primary text-white">Licence</th>
                  <th className="bg-primary text-white">CPR/BLS</th>
                  <th className="bg-primary text-white">Visit Type</th>
                  <th className="bg-primary text-white">Job Type</th>
                  <th className="bg-primary text-white">Status</th>
                  <th className="bg-primary text-white">Action</th>
                </tr>
              </thead>
              <tbody>



                {userData.length === 0 ? (
                  <tr><td colSpan="15" style={{ fontSize: "19px", padding: "15px", }}>Loading...</td></tr>
                ) : (
                  userData.map((user) => (
                    <tr key={user.id}>
                      <td>{user.job_title}</td>
                      <td>{user.start_date &&
                        convertToUS(user.start_date, "Date")
                      }</td>
                      <td>{user.start_date &&
                        convertToUS(user.end_date, "Date")
                      }</td>
                      <td>{user.contact_person}</td>
                      <td>{user.contact_phone}</td>
                      <td>{user.pay}</td>
                      <td>{user.zipcode}</td>
                      <td>{user.license}</td>
                      <td>{user.cpr_bls}</td>
                      <td>{visitType.map(visit => {
                        if (visit.value === user.visit_type) {
                          return visit.label;
                        }
                        return null;
                      })}</td>
                      <td>{jobTypeOptions.map(job => {
                        if (job.value === user.job_type) {
                          return job.label;
                        }
                        return null;
                      })}</td>
                      <td>{user.status}</td>
                      <td>
                        <div className="action-item">
                          <Link to="#">
                            <i className="isax isax-edit-2" />
                          </Link>
                          <Link to="#" onClick={()=> handleJobView(user.id)}>
                            <i className="isax isax-eye4" />
                          </Link>
                          <Link to="#">
                            <i className="isax isax-trash" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>
        {/* </div> */}
      </div>

      {recordsPerPage < totalPages ? <AdminPagination totalPages={totalPages} recordsPerPage={recordsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} /> : ''}


      <SiteFooter />

    </div>
  );
};

export default AdminJobsList;
