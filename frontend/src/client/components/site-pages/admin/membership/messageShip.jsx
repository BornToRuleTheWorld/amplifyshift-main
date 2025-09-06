import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN, disciplineOptions, specialtyOptions, visitType, jobTypeOptions, paginationDefaultCount, workSettingOptions, langOptions } from "../../config.js";
import { convertToUS } from "../../utils.js";
import Pagination from '../../pagination.js';
import { FaPlus } from "react-icons/fa";
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

const AdminMembershipList = (props) => {

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
    }
    console.log('responseIpData', data);

    try {
      const response = await axios.post(`${API_BASE_URL}/membership/GetAllMemberships/`, data, {
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
          setSucMessage('No membership data available');
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

  const handleAdd = () => {
    history.push("/site-user/pricing-plan/add") 
  }

  const handleUpdate = (id) =>{
    localStorage.setItem("memberShipID",btoa(id))
    history.push("/site-user/pricing-plan/update") 
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
      </>
      <div style={{ margin: "10px" }}>

        {/*search form*/}

        {srchError ? (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {srchError}
          </div>
        ) : ''}

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
            <div className="row-sm d-flex justify-content-end mb-2 mt-3">
                <button className="btn btn-primary" onClick={handleAdd}><FaPlus className="text-white bg-primary"/> Create Plan </button>
            </div>
          <div className="table-responsive custom-table">
            <table className="table table-center mb-0 table-striped table-hover">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="bg-primary text-white">Name</th>
                  <th className="bg-primary text-white">description</th>
                  <th className="bg-primary text-white">Monthly Price($)</th>
                  <th className="bg-primary text-white">Yearly Price($)</th>
                  <th className="bg-primary text-white">Action</th>
                </tr>
              </thead>
              <tbody>

                {userData.length === 0 ? (
                  <tr><td colSpan="15" style={{ fontSize: "19px", padding: "15px", }}>Membership data not found</td></tr>
                ) : (
                  userData.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.description}</td>
                      <td>{user.monthly_price}</td>
                      <td>{user.yearly_price}</td>
                      <td>
                        <div className="action-item">
                          <Link to="#" onClick={()=>handleUpdate(user.id)}>
                            <i className="isax isax-edit-2" />
                          </Link>
                          <Link to="#">
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

export default AdminMembershipList;
