import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN, disciplineOptions, specialtyOptions, visitType, jobTypeOptions, paginationDefaultCount, workSettingOptions, ColourOption, SingleValue, MultiValueLabel } from "../../config.js";
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

const AdminFacilityList = (props) => {

  const [userData, setUserData] = useState([]);
  const [error, setError] = useState(null);
  const [sucMessage, setSucMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(paginationDefaultCount);
  //const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const history = useHistory();

  //search related vars
  const [srchSubmit, setsrchSubmit] = useState(false);
  const [srchError, setsrchError] = useState();
  const [srchKeyword, setsrchKeyword] = useState('');
  const [srchZipCode, setsrchZipCode] = useState('');
  const [srchDiscipline, setsrchDiscipline] = useState([]);
  const [srchSpeciality, setsrchSpeciality] = useState([]);

  const fetchUsers = async () => {
    const data = {
      CurrentPage: currentPage,
      RecordsPerPage: recordsPerPage,
      ZipCode: srchZipCode,
      Keyword: srchKeyword,
      Discipline: srchDiscipline,
      Speciality: srchSpeciality
    }
    console.log('responseIpData', data);
    try {
      const response = await axios.post(`${API_BASE_URL}/facility/GetFacilities/`, data, {
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
          setSucMessage('No facility data available');
          setError(null);
        }

      }


    } catch (err) {
      console.log('responseError', err);
      setUserData([]);
      setError("An error occurred while fetching facility list");
      setSucMessage(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, srchSubmit]);


  const handleSelectChange = (value, name) => {
    if (name == 'srchDiscipline') {
      setsrchDiscipline(value);
    }
    else if (name == 'srchSpeciality') {
      setsrchSpeciality(value);
    }
  }

  const handleSearchKeyword = (e) => {
    setsrchKeyword(e.target.value);
  }

  const handleSearchZipCode = (e) => {
    setsrchZipCode(e.target.value);
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

    if (srchDiscipline.length > 0) {
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
    return false;
  }


  const clearSearchValue = () => {
    setsrchError();
    setsrchKeyword('');
    setsrchZipCode('');
    setsrchDiscipline([]);
    setsrchSpeciality([]);

    if (srchSubmit) {
      setsrchSubmit(false);
    }
    else {
      setsrchSubmit(true);
    }

  }

  const handleFacView = (email) =>{
    localStorage.setItem("adminFacEmail",btoa(email))
    history.push("/site-user/facility/profile")
  }
  //console.log("totalPages",totalPages);
  //console.log("recordsPerPage",recordsPerPage);

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
                    {/* <li className="breadcrumb-item active">Facilities</li> */}
                  </ol>
                  <h2 className="breadcrumb-title">Facilities</h2>
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
              <label className="form-label">Zip Code</label>
              <input
                type="text"
                name="srchZipCode"
                className="form-control"
                placeholder="Search Zipcode"
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
            <table className="table table-center mb-0  table-striped table-hover">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="bg-primary text-white">Name</th>
                  <th className="bg-primary text-white">Last Name</th>
                  <th className="bg-primary text-white">Email</th>
                  <th className="bg-primary text-white">Contact Number</th>
                  <th className="bg-primary text-white">Status</th>
                  <th className="bg-primary text-white">Zip Code</th>
                  <th className="bg-primary text-white">Discipline</th>
                  <th className="bg-primary text-white">Speciality</th>
                  <th className="bg-primary text-white">Action</th>
                </tr>
              </thead>
              <tbody>



                {userData.length === 0 ? (
                  <tr><td colSpan="10" style={{ fontSize: "19px", padding: "15px", }}>Loading...</td></tr>
                ) : (
                  userData.map((user) => (
                    <tr key={user.id}>
                      <td>{user.fac_first_name}</td>
                      <td>{user.fac_last_name}</td>
                      <td>{user.fac_email}</td>
                      <td>{user.fac_contact_num}</td>
                      <td>{user.fac_status}</td>
                      <td>{user.fac_zipcode}</td>
                      <td>
                        {
                        user?.Discipline?.length > 0
                          ? user.Discipline
                              .map((disp) => {
                                const option = disciplineOptions.find(option => option.value === disp);
                                return option ? (
                                  <span key={disp} style={{ backgroundColor: option.color, color:"white", padding:"5px",borderRadius:"5px" }}>
                                    {option.label}
                                  </span>
                                ) : null;
                              })
                              .filter(Boolean)
                              .reduce((acc, curr, index) => {
                                if (index === 0) return [curr];
                                return [...acc, ', ', curr];
                              }, [])
                          : 'N/A'
                        }
                      </td>
                      <td>
                        {
                          user.Speciality.map((speciality) => {
                            const option = specialtyOptions.find(option => option.value === speciality);
                            return option ? option.label : null;
                          }).join(', ') || 'N/A'
                        }
                      </td>
                      <td>
                        <div className="action-item">
                          <Link to="#">
                            <i className="isax isax-edit-2" />
                          </Link>
                          <Link to="#" onClick={()=>handleFacView(user.fac_email)}>
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

export default AdminFacilityList;
