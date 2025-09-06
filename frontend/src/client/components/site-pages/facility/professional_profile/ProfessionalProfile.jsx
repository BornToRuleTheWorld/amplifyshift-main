  import React, {useState, useEffect} from "react";
// import DashboardSidebar from "../sidebar/sidebar.jsx";
// import DashboardSidebar from "../../patients/dashboard/sidebar/sidebar.jsx";
// import IMG01 from "../../../../assets/images/patient.jpg";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import SiteFooter from "../../home/footer.jsx";
import SiteHeader from "../../home/header.jsx";
// import Header from "./header.jsx";
import { DatePicker } from "antd";
import Select from "react-select";
// import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
import ImageWithBasePath from "../../../../../core/img/imagewithbasebath.jsx";
//import ImageWithBasePath from "../../core/img/imagewithbasebath.jsx";
// import SearchProfessionalNav from "./ProfessionalNav.js";
import SearchProfessionalNav from "./ProfessionalNav.jsx";
import {AUTH_TOKEN, API_BASE_URL, fetchModules, workExperienceOptions, disciplineOptions, specialtyOptions, yearOptions, docOptions, langOptions, weeklyOptions, stateOptions, cntryOptions } from '../../config';
import { FaPen, FaPlusSquare, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import axios from "axios";

const SearchProfessionalProfile = (props) => {
  
  const email = atob(localStorage.getItem('searchProfEmail')) || "";

  const [profData, setProfData] = useState(null);
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
      .get(`${API_BASE_URL}/professional/getProf/?ProfEmail=${email}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN
        }
      })
      .then((response) => {
        setProfData(response.data);
        localStorage.setItem("RecordID", btoa(response.data.data.id))
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  }, [email,editMode]);

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
    setProfData({ ...profData });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setShowAddDoc(false);
    setShowAddLang(false);
    setFormErrors({})
    setError(null);
    setSuccess(null);
    const formValidate = await validiteFormInputs(profData.data)
    console.log("formValidate",formValidate)
    if (Object.keys(formValidate).length === 0) {
      setIsLoading(true)
      axios
        .put(`${API_BASE_URL}/professional/updateProf/${email}/`, profData.data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
          },
        })
        .then((response) => {
          setSuccess('Profile updated successfully')
          console.log('Profile updated successfully:', response.data);
          setEditMode(false);
        })
        .catch((err) => {
          setError('Error updating profile.....')
          console.error('Error updating profile:', err);
        }).finally(() => {
          setIsLoading(false);
        });
    }else{
      setFormErrors(formValidate)
      return false;
    }
  };
  
    const validiteFormInputs = async(data) => {
      console.log("validiteFormInputs",data)
      setFormErrors({})
      const errorObj = {};
      // const emailRegx = /.+@.+\.[A-Za-z]+$/
      const phoneRegx = /\d/g
     
      if (data.prof_first_name == '') {
        errorObj.prof_first_name = "First name is required";
      }

      if (data.prof_last_name == '') {
        errorObj.prof_last_name = "Last name is required";
      }

      if (data.prof_address == '') {
        errorObj.prof_address = "Address is required";
      }

      if (data.prof_city == '') {
          errorObj.prof_city = "City is required";
      }

      if (data.prof_state == '') {
        errorObj.prof_state = "Please choose a state";
      }

      if (data.prof_zip_primary == '') {
        errorObj.prof_zip_primary = "Zipcode is required";
      }

      if (data.prof_cntry == '') {
        errorObj.prof_cntry = "Please choose a country";
      }

      if (data.prof_contact == '') {
        errorObj.prof_contact = "Contact is required";
      }

      if (data.prof_contact != '') {
        if (!phoneRegx.test(data.prof_contact)) {
            errorObj.prof_contact = "Invalid contact number";
        }
      }

      if (data.prof_ein_number == '') {
        errorObj.prof_ein_number = "EIN Number is required";
      }

      if (data.prof_years_in == '') {
        errorObj.prof_years_in = "Please choose a years in business";
      }

      if (data.prof_weekly_aval == '') {
        errorObj.prof_weekly_aval = "Please choose an availability";
      }

      if (data.prof_license == '') {
        errorObj.prof_license = "License is required";
      }

      if (data.prof_license == '') {
        errorObj.prof_license = "License is required";
      }

      if (data.prof_lic_state == '') {
        errorObj.prof_lic_state = "License state is required";
      }

      if (data.prof_npi == '') {
        errorObj.prof_npi = "NPI Number is required";
      }
      
      if (data.Work_Setting.length == 0) {
          errorObj.prof_work_settings = "Please choose atleast one work setting";
      }

      if (data.Discipline.length == 0) {
        errorObj.prof_discipline = "Please choose atleast one discipline";
      }

      if (data.Languages.length == 0) {
        errorObj.prof_langs = "Please choose atleast one language";
      }

      if (data.DocSoft.length == 0) {
        errorObj.prof_doc_soft = "Please choose atleast one sotfware";
      }

      if (data.Speciality.length == 0) {
        errorObj.prof_speciality = "Please choose atleast one speciality";
      }

      return errorObj
  }

  // const quickAdd = async(name) => {
  //   let url = ""
  //   let data = {}
  //   if (name === "docSoft"){
  //     url = `${API_BASE_URL}/DocSoft/`
  //     data = {
  //       doc_soft_name:docSoft,
  //       category:1
  //     }
  //   }else{
  //     url = `${API_BASE_URL}/Language/`
  //     data = {
  //       lang_name:language,
  //       category:1
  //     }
  //   }

  //   try {
          
  //     const response = await axios.post(url, data, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': AUTH_TOKEN
  //       }
  //     });

  //     const optionData = {
  //       data : response.data,
  //       name : name
  //     }
  //     setOptionDatas(optionData)
  //   }catch(err){
  //     console.log(err)
  //   }
  // }
  const handleDocError = () => {
    setFormErrors((prev)=>({
      ...prev,
      prof_doc_soft:"",
    }))
  }

  const handleLangError = () => {
    setFormErrors((prev)=>({
      ...prev,
      prof_langs:"",
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
            errors.prof_doc_soft = "Software is requried"
          }
  
          url = `${API_BASE_URL}/DocSoft/`
          data = {
            doc_soft_name:docSoft,
            category:1
          }
        }else{
          handleLangError();
          
          if(language === null || language === ""){
            errors.prof_langs = "Language is requried"
          }
  
          url = `${API_BASE_URL}/Language/`
          data = {
            lang_name:language,
            category:1
          }
        }
         
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
      setProfData(prevState => ({
        ...prevState,
        data: {
          ...prevState.data,
          DocSoft: [...profData.data.DocSoft, docValue.value],
        },
      }));
      setShowAddDoc(false)
      setDocSoft(null)
    }
  },[docSoftOptions])

  useEffect(() => {
    if (optionDatas){
      const langValue = languageOptions.find(option => option.value === optionDatas.data.id)
      setProfData(pre => ({
        ...pre,
        data: {
          ...pre.data,
          Languages: [...profData.data.Languages, langValue.value]
          }
      }))
      setShowAddLang(false)
      setLanguage(null)
    }
  },[languageOptions])
  

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
                      <Link to="/facility/dashboard">Facility</Link>
                    </li>
                    <li className="breadcrumb-item active"><Link to="/facility/search">Search</Link></li>
                  </ol>
                  <h2 className="breadcrumb-title">Professional Profile</h2>
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
                <SearchProfessionalNav/>
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
                        <div className= {editMode ? "setting-card border border-primary" : "setting-card"}>
                          <div className="row">
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  First Name
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={profData.data.prof_first_name}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_first_name: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_first_name}</div>
                                )}
                                {formErrors.prof_first_name && <div className="form-label text-danger m-1">{formErrors.prof_first_name}</div>}
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
                                    value={profData.data.prof_middle_name}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_middle_name: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_middle_name}</div>
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
                                    value={profData.data.prof_last_name}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_last_name: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_last_name}</div>
                                )}
                                {formErrors.prof_last_name && <div className="form-label text-danger m-1">{formErrors.prof_last_name}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Email 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {/* {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={profData.data.prof_email}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_email: e.target.value } })}
                                  />
                                ) : ( */}
                                  <div className="form-control">{profData?.data?.prof_email}</div>
                                {/* )} */}
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
                                        profData.data.Work_Setting.includes(option.value)
                                    )}
                                    onChange={(selectedOptions) => setProfData({
                                        ...profData,
                                        data: {
                                        ...profData.data,
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
                                      profData?.data?.Work_Setting.map(work => {
                                      const option = workExperienceOptions.find(option => option.value === work);
                                      return option ? option.label : null;
                                      }).join(', ') || 'N/A'
                                  }
                                  </div>
                              )}
                              {formErrors.prof_work_settings && <div className="form-label text-danger m-1">{formErrors.prof_work_settings}</div>}
                              </div>
                            </div>
                            
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Years In Business 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <Select
                                    name="prof_years_in"
                                    className="select"
                                    options={yearOptions}
                                    value={yearOptions.find(option => option.value === profData?.data?.prof_years_in) || null}
                                    onChange={(selectedOption) => setProfData({ 
                                      ...profData, 
                                      data: { 
                                        ...profData.data, 
                                        prof_years_in: selectedOption ? selectedOption.value : null
                                      } 
                                    })}
                                    placeholder="Select Years"
                                    isClearable={true}
                                    isSearchable={true}
                                  />
                                ) : (
                                    <div className="form-control">
                                    {
                                        yearOptions.find(option => option.value === profData?.data?.prof_years_in)?.label || 'N/A'
                                    }
                                    </div>
                                )}
                                {formErrors.prof_years_in && <div className="form-label text-danger m-1">{formErrors.prof_years_in}</div>}
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
                                      profData.data.Discipline.includes(option.value)
                                    )}
                                    onChange={(selectedOptions) => setProfData({
                                        ...profData,
                                        data: {
                                        ...profData.data,
                                        Discipline: selectedOptions.map(option => option.value)
                                        }
                                    })}
                                    placeholder="Select Discipline"
                                    isClearable={true}
                                    isSearchable={true}
                                  />
                                ) : (
                                  <div className="form-control">
                                  {
                                    profData?.data?.Discipline.map(disp => {
                                    const option = disciplineOptions.find(option => option.value === disp);
                                    return option ? option.label : null;
                                    }).join(', ') || 'N/A'
                                  }
                                  </div>
                              )}
                              {formErrors.prof_discipline && <div className="form-label text-danger m-1">{formErrors.prof_discipline}</div>}
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
                                      profData.data.Speciality.includes(option.value)
                                    )}
                                    onChange={(selectedOptions) => setProfData({
                                        ...profData,
                                        data: {
                                        ...profData.data,
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
                                      profData?.data?.Speciality.map(work => {
                                      const option = specialtyOptions.find(option => option.value === work);
                                      return option ? option.label : null;
                                      }).join(', ') || 'N/A'
                                  }
                                  </div>
                                )}
                                {formErrors.prof_speciality && <div className="form-label text-danger m-1">{formErrors.prof_speciality}</div>}
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
                                        required = {showAddLang}
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
                                          profData.data.Languages.includes(option.value)
                                      )}
                                      onChange={(selectedOptions) => setProfData({
                                          ...profData,
                                          data: {
                                          ...profData.data,
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
                                          profData?.data?.Languages.map(lang => {
                                          const option = languageOptions.find(option => option.value === lang);
                                          return option ? option.label : null;
                                          }).join(', ') || 'N/A'
                                      }
                                      </div>
                                  )}
                                {formErrors.prof_langs && <div className="form-label text-danger m-1">{formErrors.prof_langs}</div>}
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
                                        required = {showAddDoc}
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
                                          profData.data.DocSoft.includes(option.value)
                                      )}
                                      onChange={(selectedOptions) => setProfData({
                                          ...profData,
                                          data: {
                                          ...profData.data,
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
                                          profData?.data?.DocSoft.map(software => {
                                          const option = docSoftOptions.find(option => option.value === software);
                                          return option ? option.label : null;
                                          }).join(', ') || 'N/A'
                                      }
                                      </div>
                                  )}
                                  {formErrors.prof_doc_soft && <div className="form-label text-danger m-1">{formErrors.prof_doc_soft}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                Weekly Availability 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                    <Select
                                      name="prof_weekly_aval"
                                      className="select"
                                      options={weeklyOptions}
                                      value={weeklyOptions.find(option => option.value === profData.data.prof_weekly_aval)}
                                      onChange={(e) => setProfData({ 
                                          ...profData, 
                                          data: { 
                                          ...profData.data, 
                                          prof_weekly_aval: e.value
                                          } 
                                      })}
                                      placeholder="Select Availability"
                                      isClearable={true}
                                      isSearchable={true}
                                    />
                                ) : (
                                    <div className="form-control">
                                    {
                                      weeklyOptions.find(option => option.value === profData?.data?.prof_weekly_aval)?.label || 'N/A'
                                    }
                                    </div>
                                )}
                                {formErrors.prof_weekly_aval && <div className="form-label text-danger m-1">{formErrors.prof_weekly_aval}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  License 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={profData.data.prof_license}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_license: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_license}</div>
                                )}
                              {formErrors.prof_license && <div className="form-label text-danger m-1">{formErrors.prof_license}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  License State
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={profData.data.prof_lic_state}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_lic_state: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_lic_state}</div>
                                )}
                                {formErrors.prof_lic_state && <div className="form-label text-danger m-1">{formErrors.prof_lic_state}</div>}
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
                                    value={profData.data.prof_ein_number}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_ein_number: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_ein_number}</div>
                                )}
                              {formErrors.prof_ein_number && <div className="form-label text-danger m-1">{formErrors.prof_ein_number}</div>}
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
                                    value={profData.data.prof_npi}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_npi: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_npi}</div>
                                )}
                              {formErrors.prof_npi && <div className="form-label text-danger m-1">{formErrors.prof_npi}</div>}
                              </div>
                            </div>
                            
                          </div>
                        </div>
                        <div className="setting-title">
                          <h6>Address</h6>
                        </div>
                        <div className= {editMode ? "setting-card border border-primary" : "setting-card"}>
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
                                    value={profData.data.prof_address}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_address: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_address}</div>
                                )}
                                {formErrors.prof_address && <div className="form-label text-danger m-1">{formErrors.prof_address}</div>}
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
                                    value={profData.data.prof_address_2}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_address_2: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_address_2}</div>
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
                                    value={profData.data.prof_city}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_city: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_city}</div>
                                )}
                                {formErrors.prof_city && <div className="form-label text-danger m-1">{formErrors.prof_city}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  State 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <Select
                                    name="prof_state"
                                    className="select"
                                    options={stateOptions}
                                    value={stateOptions.find(option => option.value === profData.data.prof_state)}
                                    onChange={(e) => setProfData({ 
                                        ...profData, 
                                        data: { 
                                        ...profData.data, 
                                        prof_state: e.value
                                        } 
                                    })}
                                    placeholder="Select State"
                                    isClearable={true}
                                    isSearchable={true}
                                  />
                                ) : (
                                    <div className="form-control">
                                    {
                                      stateOptions.find(option => option.value === profData?.data?.prof_state)?.label || 'N/A'
                                    }
                                    </div>
                                )}
                                {formErrors.prof_state && <div className="form-label text-danger m-1">{formErrors.prof_state}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Country 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <Select
                                    name="prof_cntry"
                                    className="select"
                                    options={cntryOptions}
                                    value={cntryOptions.find(option => option.value === profData.data.prof_cntry)}
                                    onChange={(e) => setProfData({ 
                                        ...profData, 
                                        data: { 
                                        ...profData.data, 
                                        prof_cntry: e.value
                                        } 
                                    })}
                                    placeholder="Select State"
                                    isClearable={true}
                                    isSearchable={true}
                                  />
                                ) : (
                                    <div className="form-control">
                                    {
                                      cntryOptions.find(option => option.value === profData?.data?.prof_cntry)?.label || 'N/A'
                                    }
                                    </div>
                                )}
                                {formErrors.prof_cntry && <div className="form-label text-danger m-1">{formErrors.prof_cntry}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Primary Zipcode 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={profData.data.prof_zip_primary}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_zip_primary: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_zip_primary}</div>
                                )}
                                {formErrors.prof_zip_primary && <div className="form-label text-danger m-1">{formErrors.prof_zip_primary}</div>}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Secondary Zipcode 
                                </label>
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={profData.data.prof_zip_secondary}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_zip_secondary: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_zip_secondary}</div>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                 Contact 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={profData.data.prof_contact}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_contact: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_contact}</div>
                                )}
                                {formErrors.prof_contact && <div className="form-label text-danger m-1">{formErrors.prof_contact}</div>}
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
            </div>
          </div>
        </div>
      </div>
      <SiteFooter/>
    </div>
  );
};

export default SearchProfessionalProfile;
