import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN, disciplineOptions, specialtyOptions, visitType, jobTypeOptions, paginationDefaultCount, workSettingOptions, langOptions, docOptions, ColourOption, MultiValueLabel, SingleValue } from "../../config.js";
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


const AdminProfessionalList = (props) => {

  const [userData, setUserData] = useState([]);
  const [error, setError] = useState(null);
  const [sucMessage, setSucMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(paginationDefaultCount);
  //const [recordsPerPage, setRecordsPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  //search related vars
  const [srchSubmit, setsrchSubmit] = useState(false);
  const [srchError, setsrchError] = useState();
  const [srchLanguage, setSearchLanguage] = useState([]);
  const [srchKeyword, setsrchKeyword] = useState('');
  const [srchSoftware, setsrchSoftware] = useState([]);
  const [srchWorkSetting, setsrchWorkSetting] = useState([]);
  const [srchDiscipline, setsrchDiscipline] = useState([]);
  const [srchSpeciality, setsrchSpeciality] = useState([]);

  const history = useHistory()
  
  const fetchUsers = async () => {
    console.log('Language', langOptions);

    const data = {
      CurrentPage: currentPage,
      RecordsPerPage: recordsPerPage,
      Languages : srchLanguage,
      Keyword : srchKeyword,
      Software : srchSoftware,
      WorkSetting : srchWorkSetting,
      Discipline : srchDiscipline,
      Speciality : srchSpeciality
    }

    console.log('responseIpData', data);
    try {
      const response = await axios.post(`${API_BASE_URL}/professional/GetProfessionals/`, data, {
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
          setSucMessage('No professional data available');
          setError(null);
        }

      }


    } catch (err) {      
      console.log('responseError', err);
      setUserData([]);
      setError("An error occurred while fetching professionals list");
      setSucMessage(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage,srchSubmit]);


  const sendVerifyEmail = async (prof_id) => {
    setError(null);
    setSucMessage(null);
    const data = {
      ProfID: prof_id
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/professional/SendVerifyEmail/`, data, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': AUTH_TOKEN
        },
      });
      console.log(response)
      setSucMessage("Mail has been sent to your registered mail");
    } catch (err) {
      setError(err.response?.data?.Result || "An error occurred");
    }
  }

  const handleSelectChange = (value, name) => {
    if (name == 'srchLanguage') {
      setSearchLanguage(value);
    }
    else if (name == 'srchSoftware') {
      setsrchSoftware(value);
    }  
    else if (name == 'srchWorkSetting') {
      setsrchWorkSetting(value);
    }        
    else if (name == 'srchDiscipline') {
      setsrchDiscipline(value);
    }      
    else if (name == 'srchSpeciality') {
      setsrchSpeciality(value);
    }        
  }

  const handleSearchKeyword = (e) => {
    setsrchKeyword(e.target.value);
  }

  const handleSearchSubmit =(e)=>{
    e.preventDefault();
    const validateResult = validateSearchInputs();
    console.log('srchResult', validateResult);
    if(validateResult){
      setsrchError();
      if(srchSubmit){
        setsrchSubmit(false);
      }
      else{
        setsrchSubmit(true);
      }      
    }
    else{
      setsrchError('Please provide atleast one search data');  
      if(srchSubmit){
        setsrchSubmit(false);
      }
      else{
        setsrchSubmit(true);
      }       
    }
  }

  const validateSearchInputs = () =>{
    console.log('srchLength', srchLanguage.length);
    if(srchLanguage.length>0){
      return true;
    }
    else if(srchSoftware.length>0){
      return true;
    }    
    else if(srchWorkSetting.length>0){
      return true;
    }    
    else if(srchDiscipline.length>0){
      return true;
    }   
    else if(srchSpeciality.length>0){
      return true;
    }                
    else if(srchKeyword){
      return true;
    }
    return false;
  }


  const clearSearchValue = () =>{    
    setsrchError();
    setSearchLanguage([]);
    setsrchKeyword('');
    setsrchSoftware([]);
    setsrchWorkSetting([]);
    setsrchDiscipline([]);
    setsrchSpeciality([]);

    if(srchSubmit){
      setsrchSubmit(false);
    }
    else{
      setsrchSubmit(true);
    }

  }


  const handleProfView = (email,id) =>{
    localStorage.setItem("adminProfEmail",btoa(email))
    localStorage.setItem("adminProfID",btoa(id))
    history.push("/site-user/professional/profile")
  }

  
  console.log('srchLanguage', srchLanguage);
  console.log('srchKeyword', srchKeyword);
  console.log('sucMessage', sucMessage);
  
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
                      Admin
                    </li>
                    {/* <li className="breadcrumb-item active">Professionals</li> */}
                  </ol>
                  <h2 className="breadcrumb-title">Professionals</h2>
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
            <div  className="alert alert-danger alert-dismissible fade show" role="alert">
              {srchError} 
            </div>
          ) : ''}

        <form onSubmit={handleSearchSubmit}>
          <div className="row my-5 px-2">
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
              <label className="form-label">Softwares</label>
              <Select
                  isMulti
                  name="srchSoftware"
                  //className="form-control"
                  classNamePrefix="react-select"
                  placeholder="Select Softwares"
                  value={srchSoftware}
                  options={docOptions}
                  onChange={(selected) => handleSelectChange(selected, 'srchSoftware')}
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
              <input type='submit' className="btn btn-primary mt-4 mx-2" value='Search' style={{zIndex: "0", pointerEvents:"auto"}}/>              
              <input type='button' className="btn btn-primary mt-4" value='Clear'  onClick={clearSearchValue} style={{zIndex: "0"}}/>
            </div>


            

          </div>
        </form>
        {/*search form*/}

        {/* <div className="custom-table border rounded"> */}

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
                  <th className="bg-primary text-white">Name</th>
                  <th className="bg-primary text-white">Last Name</th>
                  <th className="bg-primary text-white">Email</th>
                  <th className="bg-primary text-white">Status</th>
                  <th className="bg-primary text-white">Language</th>
                  <th className="bg-primary text-white">Software</th>
                  <th className="bg-primary text-white">Work Setting</th>
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
                      <td>{user.prof_first_name}</td>
                      <td>{user.prof_last_name}</td>
                      <td>{user.prof_email}</td>
                      <td>{user.prof_status}</td>
                      <td>
                        {
                          user.Languages.map((lang) => {
                            const option = langOptions.find(option => option.value === lang);
                            return option ? option.label : null;
                          }).join(', ') || 'N/A'
                        }
                      </td>
                      <td>
                        {
                          user.DocSoft.map((soft) => {
                            const option = docOptions.find(option => option.value === soft);
                            return option ? option.label : null;
                          }).join(', ') || 'N/A'
                        }
                      </td>
                      <td>
                        {
                          user.Work_Setting.map((work) => {
                            const option = workSettingOptions.find(option => option.value === work);
                            return option ? option.label : null;
                          }).join(', ') || 'N/A'
                        }
                      </td>      
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
                          <Link to="#" onClick={()=>handleProfView(user.prof_email,user.id)}>
                            <i className="isax isax-eye4" />
                          </Link>
                          <Link to="#">
                            <i className="isax isax-trash" />
                          </Link>
                          {(user.prof_status === "Waiting for Referral Approval") ? (
                            <button onClick={() => sendVerifyEmail(user.id)} className="btn btn-success"> Send mail</button>
                          ) : null}
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

export default AdminProfessionalList;
