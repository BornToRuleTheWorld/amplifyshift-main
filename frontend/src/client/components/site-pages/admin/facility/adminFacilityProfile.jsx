import React, {useState, useEffect} from "react";
// import DashboardSidebar from "../sidebar/sidebar.jsx";
import DashboardSidebar from "../../../patients/dashboard/sidebar/sidebar.jsx";
// import IMG01 from "../../../../assets/images/patient.jpg";
import StickyBox from "react-sticky-box";
import { Link, useHistory,NavLink } from "react-router-dom";
import SiteFooter from "../../home/footer.jsx";
import SiteHeader from "../../home/header.jsx";
// import Header from "./header.jsx";
import { DatePicker } from "antd";
import Select from "react-select";
import ImageWithBasePath from "../../../../../core/img/imagewithbasebath.jsx";
import {AUTH_TOKEN, API_BASE_URL, fetchModules, workExperienceOptions, disciplineOptions, specialtyOptions, yearOptions, docOptions, langOptions, weeklyOptions, stateOptions, cntryOptions, ColourOption, MultiValueLabel } from '../../config'; 
import axios from "axios";
import { FaPen, FaPlusSquare, FaMinusCircle, FaPlusCircle} from "react-icons/fa";
//import ImageWithBasePath from "../../core/img/imagewithbasebath.jsx";

const AdminFacilityProfile = (props) => {
  const userEmail = atob(localStorage.getItem('adminFacEmail')) || ""
  
  const [facData, setfacData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [docSoftOptions, setDocSoftOptions] = useState(docOptions)
  const [languageOptions, setLanguageOptions] = useState(langOptions)
  const [showAddLang, setShowAddLang] = useState(false);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [optionDatas, setOptionDatas] = useState(null);
  const[docSoft, setDocSoft]   = useState(null); 
  const[language, setLanguage] = useState(null);
  
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/facility/GetFacility/?FacEmail=${userEmail}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN,
        }
      })
      .then((response) => {
        setfacData(response.data);
        localStorage.setItem("RecordID", btoa(response.data.data.id))
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  }, [userEmail,editMode]);

  const handleFormEdit = () => {
    setEditMode(true);
    setError(null);
    setSuccess(null);
    setFormErrors({})
  };

  const handleCancel = () => {
    setEditMode(false);
    setError(null);
    setSuccess(null);
    setFormErrors({})
    setfacData({ ...facData });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setShowAddDoc(false);
    setShowAddLang(false);
    setFormErrors({})
    setError(null);
    setSuccess(null);
    const formValidate = await validiteFormInputs(facData.data)
    if (Object.keys(formValidate).length === 0) {
      setIsLoading(true)
      axios
        .put(`${API_BASE_URL}/facility/UpdateFacility/${userEmail}/`, facData.data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN,
          },
        })
        .then((response) => {
          setSuccess('Facility updated successfully')
          console.log('Facility updated successfully:', response.data);
          setEditMode(false);
        })
        .catch((err) => {
          setError('Error updating facility.....')
          console.error('Error updating Facility:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }else{
      setFormErrors(formValidate)
      return false;
    }
  };

  const validiteFormInputs = async (data) => {
    console.log('errorValidateSecond',data)
    setFormErrors({});
    let errorObj = {};
    //const emailRegx = /.+@.+\.[A-Za-z]+$/
    const phoneRegx = /\d/g

    if (data.fac_title == '') {
      errorObj.fac_title = "Title is required";
    }

    if (data.fac_business_name == '') {
      errorObj.fac_business_name = "Business name is required";
    }

    if (data.fac_first_name == '') {
      errorObj.fac_first_name = "First name is required";
    }

    if (data.fac_last_name == '') {
      errorObj.fac_last_name = "Last name is required";
    }

    if (data.fac_address == '') {
      errorObj.fac_address = "Address is required";
    }

    if (data.fac_city == '') {
      errorObj.fac_city = "City is required";
    }

    if (data.fac_state == '') {
      errorObj.fac_state = "Please choose a state";
    }

    if (data.fac_zipcode == '') {
      errorObj.fac_zipcode = "Zipcode is required";
    }

    if (data.fac_cntry == '') {
      errorObj.fac_cntry = "Please choose a country";
    }

    if (data.fac_contact_num == '') {
      errorObj.fac_contact_num = "Contact is required";
    }

    if (data.fac_contact_num != '') {
      if (!phoneRegx.test(data.fac_contact_num)) {
        errorObj.fac_contact_num = "Invalid contact number";
      }
    }


    if (data.fac_ein_number == '') {
      errorObj.fac_ein_number = "EIN Number is required";
    }

    if (data.fac_wrk_exp == '') {
      errorObj.fac_wrk_exp = "Please choose a years in business";
    }

    if (data.fac_weekly_visit == '') {
      errorObj.fac_weekly_visit = "Please choose an availability";
    }

    if (data.fac_npi == '') {
      errorObj.fac_npi = "NPI Number is required";
    }

    if (data.Work_Setting.length == 0) {
      errorObj.fac_wrk_setting = "Please choose atleast one experience";
    }

    if (data.Discipline.length == 0) {
      errorObj.fac_discipline = "Please choose atleast one discipline";
    }

    if (data.Languages.length == 0) {
      errorObj.fac_langs = "Please choose atleast one language";
    }

    if (data.DocSoft.length == 0) {
      errorObj.fac_doc_soft = "Please choose atleast one sotfware";
    }

    if (data.Speciality.length == 0) {
      errorObj.fac_speciality = "Please choose atleast one speciality";
    }
    console.log('errorValidateLocalObject', errorObj)      
    return errorObj
  }

  const handleDocError = () => {
    setFormErrors((prev)=>({
      ...prev,
        fac_doc_soft:"",
    }))
  }

  const handleLangError = () => {
    setFormErrors((prev)=>({
      ...prev,
      fac_langs:"",
    }))
  }

  const handleDocDisplay = (value) => {
    setShowAddDoc(value);
    handleDocError();
  }

  const handleLangDisplay = (value) => {
    setShowAddLang(value);
    handleLangError();
  }

  const quickAdd = async(name) => {
    let url = ""
    let data = {}
    let errors = {}
    
    if (name === "docSoft"){
      handleDocError();
      if(docSoft === null || docSoft === ""){
        errors.fac_doc_soft = "Software is requried"
      }
      url = `${API_BASE_URL}/DocSoft/`
      data = {
        doc_soft_name:docSoft,
        category:1
      }
    }else{
      handleLangError();
      if(language === null || language === ""){
        errors.fac_langs = "Language is requried"
      }
      url = `${API_BASE_URL}/Language/`
      data = {
        lang_name:language,
        category:1
      }
    }
     console.log("quick add data",data)
    if (Object.keys(errors).length === 0){
      try {
        const response = await axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
          }
        });
  
        const optionData = {
          data : response.data,
          name : name
        }
        setOptionDatas(optionData)
      }catch(err){
        console.log(err)
      }
    }else{
      setFormErrors((prev) => ({
        ...prev,
        ...errors
      }))
    }
  }

  useEffect(()=> {
    const setOptionData = async() =>{
      let optionName = null
      let nameField  = null
      
      if (optionDatas){
        const data = await fetchModules()
        if (optionDatas.name === "docSoft"){
          optionName = "DocSoftware"
          nameField = "doc_soft_name"
        }else{
          optionName = "Language"
          nameField = "lang_name"
        }
        
        if (Array.isArray(data[optionName])) {
          const updatedOptions = data[optionName].map((option) => {
            return {
              value: option.id,
              label: option[nameField],
            };
          });
          (optionDatas.name === "docSoft") ? setDocSoftOptions(updatedOptions) : setLanguageOptions(updatedOptions)
        }
      }
    }
    setOptionData()
  },[optionDatas])

  useEffect(() => {
    if (optionDatas){
      const docValue = docSoftOptions.find(option => option.value === optionDatas.data.id)
      setfacData(prevState => ({
        ...prevState,
        data: {
          ...prevState.data,
          DocSoft: [...facData.data.DocSoft, docValue.value],
        },
      }));
      setShowAddDoc(false)
      setDocSoft(null)
    }
  },[docSoftOptions])

  useEffect(() => {
    if (optionDatas){
      const langValue = languageOptions.find(option => option.value === optionDatas.data.id)
      setfacData(pre => ({
        ...pre,
        data: {
          ...pre.data,
          Languages: [...facData.data.Languages, langValue.value]
        }
      }))
      setShowAddLang(false)
      setLanguage(null)
    }
  },[languageOptions])

  console.log(facData)
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
                      <Link to="/home">
                        <i className="isax isax-home-15" />
                      </Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      <Link to="/site-user/dashboard">Admin</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      <Link to="/site-user/facility">Facilities</Link></li>
                  </ol>
                  <h2 className="breadcrumb-title">Facility Profile</h2>
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
            {/* <div className="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar">
              <StickyBox offsetTop={20} offsetBottom={20}>
                <DashboardSidebar />
              </StickyBox>
            </div> */}

            <div className="col-lg-12 col-xl-12">
                <>
                  <nav className="settings-tab mb-1">
                    <ul className="nav nav-tabs-bottom" role="tablist">
                      <li className="nav-item" role="presentation">
                        <NavLink className="nav-link" to='#'>
                          Profile
                        </NavLink>
                      </li>
                    </ul>
                  </nav>
                  <div className="card">
                    <div className="card-body">
                      <div className="border-bottom pb-3 mb-3">
                        <h5>Profile Information &nbsp; <FaPen className="text-primary fs-3" onClick={handleFormEdit}/></h5>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="setting-title">
                          <h6>Information</h6>
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
                        <div className={editMode ? "setting-card border border-primary" : "setting-card"}>
                          <div className="row">
                          <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Title </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  value={facData.data.fac_title}
                                  onChange={(e) => setfacData({ ...facData, data: { ...facData.data, fac_title: e.target.value } })} 
                                />
                                ):(
                                  <div className="form-control">{facData?.data?.fac_title}</div>
                                )}
                                {formErrors.fac_title && <div className="form-label text-danger m-1">{formErrors.fac_title}</div>}

                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Business Name </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  value={facData.data.fac_business_name}
                                  onChange={(e) => setfacData({ ...facData, data: { ...facData.data, fac_business_name: e.target.value } })} 
                                />
                                ):(
                                  <div className="form-control">{facData?.data?.fac_business_name}</div>
                                )}
                                {formErrors.fac_business_name && <div className="form-label text-danger m-1">{formErrors.fac_business_name}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Email Address 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {/* {editMode ? (
                                <input 
                                  type="email" 
                                  className="form-control"  
                                  value={facData.data.fac_email}
                                  onChange={(e) => setfacData({ ...facData, data: { ...facData.data, fac_email: e.target.value } })}
                                />
                                ):( */}
                                  <div className="form-control">{facData?.data?.fac_email}</div>
                                {/* )} */}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  First Name 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={facData.data.fac_first_name}
                                    onChange={(e) => setfacData({ ...facData, data: { ...facData.data, fac_first_name: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control" >{facData?.data?.fac_first_name}</div>
                                )}
                                {formErrors.fac_first_name && <div className="form-label text-danger m-1">{formErrors.fac_first_name}</div>}
                              </div>
                            </div>
                            
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Middle Name 
                                </label>
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={facData.data.fac_middle_name}
                                    onChange={(e) => setfacData({ ...facData, data: { ...facData.data, fac_middle_name: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control" >{facData?.data?.fac_middle_name}</div>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Last Name
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={facData.data.fac_last_name}
                                    onChange={(e) => setfacData({ ...facData, data: { ...facData.data, fac_last_name: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control" >{facData?.data?.fac_last_name}</div>
                                )}
                                {formErrors.fac_last_name && <div className="form-label text-danger m-1">{formErrors.fac_last_name}</div>}
                              </div>
                            </div>
                            
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Work Experience 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <Select
                                    isMulti
                                    className="select"
                                    options={workExperienceOptions}
                                    value={workExperienceOptions.filter(option =>
                                      facData.data.Work_Setting.includes(option.value)
                                    )}
                                    onChange={(selectedOptions) => setfacData({
                                        ...facData,
                                        data: {
                                        ...facData.data,
                                        Work_Setting: selectedOptions.map(option => option.value)
                                        }
                                    })}
                                    placeholder="Select Experience"
                                    isClearable={true}
                                    isSearchable={true}
                                  />
                                ) : (
                                  <div className="form-control">
                                  {
                                      facData?.data?.Work_Setting.map(work => {
                                      const option = workExperienceOptions.find(option => option.value === work);
                                      return option ? option.label : null;
                                      }).join(', ') || 'N/A'
                                  }
                                  </div>
                              )}
                            {formErrors.fac_wrk_setting && <div className="form-label text-danger m-1">{formErrors.fac_wrk_setting}</div>}
                              </div>
                            </div>
                            
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Years In Business 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <Select
                                    name="fac_wrk_exp"
                                    className="select"
                                    options={yearOptions}
                                    value={yearOptions.find(option => option.value === facData.data.fac_wrk_exp)}
                                    onChange={(e) => setfacData({ 
                                        ...facData, 
                                        data: { 
                                        ...facData.data, 
                                        fac_wrk_exp: e.target.value
                                        } 
                                    })}
                                    placeholder="Select Years"
                                    isClearable={true}
                                    isSearchable={true}
                                  />
                                ) : (
                                    <div className="form-control">
                                    {
                                        yearOptions.find(option => option.value === facData?.data?.fac_wrk_exp)?.label || 'N/A'
                                    }
                                    </div>
                                )}
                              {formErrors.fac_wrk_exp && <div className="form-label text-danger m-1">{formErrors.fac_wrk_exp}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Discipline 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <Select
                                  isMulti
                                    className="select"
                                    options={disciplineOptions}
                                    value={disciplineOptions.filter(option =>
                                      facData.data.Discipline.includes(option.value)
                                    )}
                                    onChange={(selectedOptions) => setfacData({
                                        ...facData,
                                        data: {
                                        ...facData.data,
                                        Discipline: selectedOptions.map(option => option.value)
                                        }
                                    })}
                                    placeholder="Select Discipline"
                                    isClearable={true}
                                    isSearchable={true}
                                    components={{ Option : ColourOption, MultiValueLabel }}                                    
                                  />
                                ) : (
                                  <div className="form-control">
                                  {
                                    facData?.data?.Discipline?.length > 0
                                      ? facData.data.Discipline
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
                                  </div>
                              )}
                            {formErrors.fac_discipline && <div className="form-label text-danger m-1">{formErrors.fac_discipline}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Speciality 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <Select
                                    isMulti
                                    className="select"
                                    options={specialtyOptions}
                                    value={specialtyOptions.filter(option =>
                                      facData.data.Speciality.includes(option.value)
                                    )}
                                    onChange={(selectedOptions) => setfacData({
                                        ...facData,
                                        data: {
                                        ...facData.data,
                                        Speciality: selectedOptions.map(option => option.value)
                                        }
                                    })}
                                    placeholder="Select Speciality"
                                    isClearable={true}
                                    isSearchable={true}
                                  />
                                ) : (
                                  <div className="form-control">
                                  {
                                      facData?.data?.Speciality.map(work => {
                                      const option = specialtyOptions.find(option => option.value === work);
                                      return option ? option.label : null;
                                      }).join(', ') || 'N/A'
                                  }
                                  </div>
                                )}
                              {formErrors.fac_speciality && <div className="form-label text-danger m-1">{formErrors.fac_speciality}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Languages 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                    showAddLang ?
                                      <>
                                        <input
                                        type="text"
                                        name="fac_langs"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        placeholder="Enter Language"
                                        // required = {showAddLang}
                                        className="form-control"
                                      />
                                        <FaPlusCircle style={{fontSize:"17px"}} className="text-success mt-1" onClick={() => quickAdd('language')}/>
                                        <FaMinusCircle style={{fontSize:"17px"}} className="text-danger mt-1" onClick={() => handleLangDisplay(false)}/>
                                      </>
                                    :
                                      <>
                                      <Select
                                      isMulti
                                      className="select"
                                      name="Languages"
                                      options={languageOptions}
                                      value={languageOptions.filter(option =>
                                          facData.data.Languages.includes(option.value)
                                      )}
                                      onChange={(selectedOptions) => setfacData({
                                          ...facData,
                                          data: {
                                          ...facData.data,
                                          Languages: selectedOptions.map(option => option.value)
                                          }
                                      })}
                                      placeholder="Select language"
                                      isClearable={true}
                                      isSearchable={true}
                                      />
                                      <FaPlusSquare style={{fontSize:"17px"}} className="text-success mt-1" onClick={() => handleLangDisplay(true)}/>
                                      </>
                                  ) : (
                                      <div className="form-control">
                                      {
                                          facData?.data?.Languages.map(lang => {
                                          const option = languageOptions.find(option => option.value === lang);
                                          return option ? option.label : null;
                                          }).join(', ') || 'N/A'
                                      }
                                      </div>
                                  )}
                                {formErrors.fac_langs && <div className="form-label text-danger m-1">{formErrors.fac_langs}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                Documentation Software 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  showAddDoc ?
                                    <>
                                      <input
                                        type="text"
                                        name="fac_doc_soft"
                                        value={docSoft}
                                        onChange={(e) => setDocSoft(e.target.value)}
                                        placeholder="Enter documentation software"
                                        // required = {showAddDoc}
                                        className="form-control"
                                      />
                                      <FaPlusCircle style={{fontSize:"17px"}} className="text-success mt-1" onClick={() => quickAdd('docSoft')}/>
                                      <FaMinusCircle style={{fontSize:"17px"}} className="text-danger mt-1" onClick={() => handleDocDisplay(false)}/>
                                    </>
                                    :
                                    <>
                                    <Select
                                      isMulti
                                      className="select"
                                      name="DocSoft"
                                      options={docSoftOptions}
                                      value={docSoftOptions.filter(option =>
                                          facData.data.DocSoft.includes(option.value)
                                      )}
                                      onChange={(selectedOptions) => setfacData({
                                          ...facData,
                                          data: {
                                          ...facData.data,
                                          DocSoft: selectedOptions.map(option => option.value)
                                          }
                                      })}
                                      placeholder="Select Software"
                                      isClearable={true}
                                      isSearchable={true}
                                      />
                                      <FaPlusSquare style={{fontSize:"17px"}} className="text-success mt-1" onClick={() => handleDocDisplay(true)}/>
                                    </>
                                    ) : (
                                      <div className="form-control">
                                      {
                                          facData?.data?.DocSoft.map(software => {
                                          const option = docSoftOptions.find(option => option.value === software);
                                          return option ? option.label : null;
                                          }).join(', ') || 'N/A'
                                      }
                                      </div>
                                  )}
                                {formErrors.fac_doc_soft && <div className="form-label text-danger m-1">{formErrors.fac_doc_soft}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                Weekly Availability 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                    <Select
                                      name="fac_weekly_visit"
                                      className="select"
                                      options={weeklyOptions}
                                      value={weeklyOptions.find(option => option.value === facData.data.fac_weekly_visit)}
                                      onChange={(e) => setfacData({ 
                                          ...facData, 
                                          data: { 
                                          ...facData.data, 
                                          fac_weekly_visit: e.value
                                          } 
                                      })}
                                      placeholder="Select Availability"
                                      isClearable={true}
                                      isSearchable={true}
                                    />
                                ) : (
                                    <div className="form-control">
                                    {
                                      weeklyOptions.find(option => option.value === facData?.data?.fac_weekly_visit)?.label || 'N/A'
                                    }
                                    </div>
                                )}
                                {formErrors.fac_weekly_visit && <div className="form-label text-danger m-1">{formErrors.fac_weekly_visit}</div>}
                              </div>
                            </div>
                            
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  EIN Number 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={facData.data.fac_ein_number}
                                    onChange={(e) => setfacData({ ...facData, data: { ...facData.data, fac_ein_number: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{facData?.data?.fac_ein_number}</div>
                                )}
                                 {formErrors.fac_ein_number && <div className="form-label text-danger m-1">{formErrors.fac_ein_number}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  NPI Number 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={facData.data.fac_npi}
                                    onChange={(e) => setfacData({ ...facData, data: { ...facData.data, fac_npi: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{facData?.data?.fac_npi}</div>
                                )}
                                {formErrors.fac_npi && <div className="form-label text-danger m-1">{formErrors.fac_npi}</div>}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="setting-title">
                          <h6>Address</h6>
                        </div>
                        <div className={editMode ? "setting-card border border-primary" : "setting-card"}>
                          <div className="row">
                            
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Address 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={facData.data.fac_address}
                                    onChange={(e) => setfacData({ ...facData, data: { ...facData.data, fac_address: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{facData?.data?.fac_address}</div>
                                )}
                                {formErrors.fac_address && <div className="form-label text-danger m-1">{formErrors.fac_address}</div>}
                              </div>
                            </div>
                            
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Address2 
                                </label>
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={facData.data.fac_address_2}
                                    onChange={(e) => setfacData({ ...facData, data: { ...facData.data, fac_address_2: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{facData?.data?.fac_address_2}</div>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  City 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={facData.data.fac_city}
                                    onChange={(e) => setfacData({ ...facData, data: { ...facData.data, fac_city: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{facData?.data?.fac_city}</div>
                                )}
                              {formErrors.fac_city && <div className="form-label text-danger m-1">{formErrors.fac_city}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  State 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <Select
                                    name="fac_state"
                                    className="select"
                                    options={stateOptions}
                                    value={stateOptions.find(option => option.value === facData.data.fac_state)}
                                    onChange={(e) => setfacData({ 
                                        ...facData, 
                                        data: { 
                                        ...facData.data, 
                                        fac_state: e.value
                                        } 
                                    })}
                                    placeholder="Select State"
                                    isClearable={true}
                                    isSearchable={true}
                                  />
                                ) : (
                                    <div className="form-control">
                                    {
                                      stateOptions.find(option => option.value === facData?.data?.fac_state)?.label || 'N/A'
                                    }
                                    </div>
                                )}
                              {formErrors.fac_state && <div className="form-label text-danger m-1">{formErrors.fac_state}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Country 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <Select
                                    name="fac_cntry"
                                    className="select"
                                    options={cntryOptions}
                                    value={cntryOptions.find(option => option.value === facData.data.fac_cntry)}
                                    onChange={(e) => setfacData({ 
                                        ...facData, 
                                        data: { 
                                        ...facData.data, 
                                        fac_cntry: e.value
                                        } 
                                    })}
                                    placeholder="Select State"
                                    isClearable={true}
                                    isSearchable={true}
                                  />
                                ) : (
                                    <div className="form-control">
                                    {
                                      cntryOptions.find(option => option.value === facData?.data?.fac_cntry)?.label || 'N/A'
                                    }
                                    </div>
                                )}
                                 {formErrors.fac_cntry && <div className="form-label text-danger m-1">{formErrors.fac_cntry}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Zipcode 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={facData.data.fac_zipcode}
                                    onChange={(e) => setfacData({ ...facData, data: { ...facData.data, fac_zipcode: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{facData?.data?.fac_zipcode}</div>
                                )}
                               {formErrors.fac_zipcode && <div className="form-label text-danger m-1">{formErrors.fac_zipcode}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Phone Number 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={facData.data.fac_contact_num}
                                    onChange={(e) => setfacData({ ...facData, data: { ...facData.data, fac_contact_num: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{facData?.data?.fac_contact_num}</div>
                                )}
                              {formErrors.fac_contact_num && <div className="form-label text-danger m-1">{formErrors.fac_contact_num}</div>}
                              </div>
                            </div>
                          </div>
                        </div>
                        {editMode 
                        ?
                          <div className="modal-btn text-end">
                            <Link to="#" className="btn btn-md btn-light rounded-pill" onClick={handleCancel}>
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
                                      
                              : "Save Changes"}
                            </button>
                          </div>
                        :
                          null
                        }
                      </form>
                    </div>
                  </div>
                </>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter/>
    </div>
  );
};

export default AdminFacilityProfile;
