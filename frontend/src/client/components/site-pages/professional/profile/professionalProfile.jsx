  import React, {useState, useEffect, useRef } from "react";
// import DashboardSidebar from "../sidebar/sidebar.jsx";
// import DashboardSidebar from "../../patients/dashboard/sidebar/sidebar.jsx";
// import IMG01 from "../../../../assets/images/patient.jpg";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import SiteFooter from "../../home/footer.jsx";
import SiteHeader from "../../home/header.jsx";
// import Header from "./header.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
// import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
import ImageWithBasePath from "../../../../../core/img/imagewithbasebath.jsx";
//import ImageWithBasePath from "../../core/img/imagewithbasebath.jsx";
import ProfessionalNav from "./ProfessionalNav.jsx";
import {AUTH_TOKEN, API_BASE_URL, fetchModules, workExperienceOptions, disciplineOptions, specialtyOptions, yearOptions, docOptions, langOptions, weeklyOptions, stateOptions, cntryOptions, boolOption, ColourOption, SingleValue, MultiValueLabel } from '../../config';
import { FaPen, FaPlusSquare, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import axios from "axios";
import moment from 'moment';
import convertUrlToFile from "../../convertToFile.js";
import ProfessionalSidebar from "./ProfessionalSidebar.jsx";
import { convertToUS } from "../../utils.js";

const ProfessionalProfile = (props) => {
  let profSearchEmail = null
  if (localStorage.getItem("ProfSearchResult")){
     profSearchEmail = atob(localStorage.getItem('ProfSearchResult')) || "";
  }
  const profEmail = atob(localStorage.getItem('email')) || "";
  let email = profEmail
  
  if (profSearchEmail){
    email = profSearchEmail
  }
  
  const currentTimeStamp = new Date().toISOString().replace(/[:.]/g, '-');
  const [profData, setProfData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [focus, setFocus] = useState(false)

  const [docSoftOptions, setDocSoftOptions] = useState(docOptions)
  const [languageOptions, setLanguageOptions] = useState(langOptions)
  const [showAddLang, setShowAddLang] = useState(false);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [optionDatas, setOptionDatas] = useState(null);
  const[docSoft, setDocSoft]   = useState(null); 
  const[language, setLanguage] = useState(null);
  const successMessageRef = useRef(null);
  const [citizenship, setCitizenship] = useState(false);
  //contact 
  const [phoneArea, setPhoneArea] = useState('')
  const [phonePrefix, setPhonePrefix] = useState('')
  const [phoneLine, setPhoneLine] = useState('')

  //Home contact 
  const [homeArea, setHomeArea] = useState('')
  const [homePrefix, setHomePrefix] = useState('')
  const [homeLine, setHomeLine] = useState('')

  //Alternate contact 
  const [altArea, setAltArea] = useState('')
  const [altPrefix, setAltPrefix] = useState('')
  const [altLine, setAltLine] = useState('')

  const LicenseStatus = [
    {value:"Active", label:"Active"},
    {value:"Inactive", label:"Inactive"}
  ]

  const ImmigartionStatus = [
    {value:" A citizen of the United States", label:" A citizen of the United States"},
    {value:"A noncitizen national of the United States", label:"A noncitizen national of the United States"},
    {value:"A lawful permanent resident", label:"A lawful permanent resident"},
    {value:"A non citizen", label:"A non citizen"}
  ]

  const handleSelect = (value) => {
    setProfData({ 
      ...profData, 
      data: { 
      ...profData.data, 
      prof_citizenship_status: value
      } 
    })

    if (value === "A non citizen"){
      setCitizenship(true)
    }else{
      setCitizenship(false)
    }
  }
  const handleCitizenship = (e) => {
    const value = e.target.value
    setProfData({
      ...profData,
      data: {
        ...profData.data,
        prof_citizenship_status: value,
      },
    })

    if (value === "A non citizen"){
      setCitizenship(true)
    }else{
      setCitizenship(false)
    }
  }

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
        setPhoneArea(response.data.data.prof_contact.slice(0,3))
        setPhonePrefix(response.data.data.prof_contact.slice(3,6))
        setPhoneLine(response.data.data.prof_contact.slice(6,10))

        if(response.data.data.prof_home_phone){
          setHomeArea(response.data.data.prof_home_phone.slice(0,3))
          setHomePrefix(response.data.data.prof_home_phone.slice(3,6))
          setHomeLine(response.data.data.prof_home_phone.slice(6,10))
        }

        if(response.data.data.prof_alt_phone){
          setAltArea(response.data.data.prof_alt_phone.slice(0,3))
          setAltPrefix(response.data.data.prof_alt_phone.slice(3,6))
          setAltLine(response.data.data.prof_alt_phone.slice(6,10))
        }

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
    setFocus(false)
    setShowAddDoc(false);
    setShowAddLang(false);
    setFormErrors({})
    setError(null);
    setSuccess(null);
    const formValidate = await validiteFormInputs(profData.data)
    console.log("formValidate",formValidate)
    if (Object.keys(formValidate).length === 0) {
      const updatedData = {...profData, 
                          data:{ 
                          ...profData.data, 
                          prof_contact:`${phoneArea}${phonePrefix}${phoneLine}`,
                          prof_home_phone:`${homeArea}${homePrefix}${homeLine}`,
                          prof_alt_phone:`${altArea}${altPrefix}${altLine}`,
                          prof_lic_issued: moment(profData.data.prof_lic_issued).format('YYYY-MM-DD'),
                          prof_lic_expired: moment(profData.data.prof_lic_expired).format('YYYY-MM-DD'),
                          prof_dob: profData?.data?.prof_dob ? moment(profData.data.prof_dob).format('YYYY-MM-DD') : profData.data.prof_dob
                        }}
                        const formDataObj = new FormData();
                        for (const key in updatedData.data) {
                            if ((key === "prof_proof_front" || key === "prof_proof_back") && updatedData.data[key]) {
                                let file_base_name = '';
                                let file_ext = '';
                                let file = null;
        
                                if (typeof updatedData.data[key] === 'string') {
                                    const fullFileName = updatedData.data[key].split('/').pop();
                                    const lastDotIndex = fullFileName.lastIndexOf('.');
                                    file_base_name = fullFileName.substring(0, lastDotIndex).split('-')[0];
                                    file_ext = fullFileName.substring(lastDotIndex + 1);
        
                                    const file_name = `${file_base_name}-${currentTimeStamp}.${file_ext}`;
                                    file = await convertUrlToFile(updatedData.data[key], file_name);
        
                                } else if (updatedData.data[key] instanceof File) {
                                    const originalFile = updatedData.data[key];
                                    const fullFileName = originalFile.name;
                                    const lastDotIndex = fullFileName.lastIndexOf('.');
                                    file_base_name = fullFileName.substring(0, lastDotIndex);
                                    file_ext = fullFileName.substring(lastDotIndex + 1);
        
                                    const file_name = `${file_base_name}-${currentTimeStamp}.${file_ext}`;
        
                                    file = new File([originalFile], file_name, {
                                        type: originalFile.type,
                                        lastModified: originalFile.lastModified,
                                    });
                                }
        
                                if (file) {
                                    formDataObj.append(key, file);
                                } else {
                                    console.error("File processing failed for:", updatedData.data[key]);
                                }
                            } else {
                              const value = updatedData.data[key];
                              if(Array.isArray(value)){
                                value.forEach(value => {
                                  formDataObj.append(key, value);
                                });
                              }else{
                                formDataObj.append(key, value === 'null' || value === null ? '' : value);
                              }
                            }
                        }
                        
        console.log("updatedData",updatedData.data)
      setIsLoading(true)
      axios
        .put(`${API_BASE_URL}/professional/updateProf/${email}/`, formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': AUTH_TOKEN
          },
        })
        .then((response) => {
          setSuccess('Profile updated successfully')
          console.log('Profile updated successfully:', response.data);
          setEditMode(false);
          setFocus(true)
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

      // if (data.prof_contact == '') {
      //   errorObj.prof_contact = "Contact is required";
      // }

      // if (data.prof_contact != '') {
      //   if (!phoneRegx.test(data.prof_contact)) {
      //       errorObj.prof_contact = "Invalid contact number";
      //   }
      // }
      if (phoneArea == '' || phonePrefix == '' || phoneLine == '') {
        errorObj.prof_contact = "Contact is required";
      }else{
        if (!Number.isInteger(parseInt(phoneArea)) || !Number.isInteger(parseInt(phonePrefix)) || !Number.isInteger(parseInt(phoneLine))) {
            errorObj.prof_contact = "Invalid phone number";
        }
      }

      if (phoneArea.length < 3 || phonePrefix.length < 3 || phoneLine.length < 4 ){
        errorObj.prof_contact = "Invalid phone number";
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

      if (data.prof_social_security_num == '' || data.prof_social_security_num == null) {
        errorObj.prof_social_security_num = "Social security number is required";
      }else{
        if(!Number.isInteger(parseInt(data.prof_social_security_num))){
          errorObj.prof_social_security_num = "Invalid social security number";
        } 
      }

      if (data.prof_lic_issued == '' || data.prof_lic_issued == null ) {
        errorObj.prof_lic_issued = "License issued date is required";
      }

      if (data.prof_lic_expired == '' || data.prof_lic_expired == null) {
        errorObj.prof_lic_expired = "License expire date is required";
      }

      if (data.prof_lic_status == '' || data.prof_lic_status == null) {
        errorObj.prof_lic_status = "License status is required";
      }
      
      if (data.prof_address_zip == '' || data.prof_address_zip == null) {
        errorObj.prof_address_zip = "Zipcode is required";
      }

      if (data.prof_address_years == '' || data.prof_address_years == null || data.prof_address_months == '' || data.prof_address_months == null) {
        errorObj.prof_time_to_address = "Time at above address is requried ";
      }

      if (data.prof_is_eligible == '' || data.prof_is_eligible == null) {
        errorObj.prof_is_eligible = "Eligibility is required";
      }

      if (data.prof_proof_front == '' || data.prof_proof_front == null) {
        errorObj.prof_proof_front = "Please upload a file";
      }

      if (data.prof_proof_back == '' || data.prof_proof_back == null) {
        errorObj.prof_proof_back = "Please upload a file";
      }

      if (data.prof_citizenship_status == '' || data.prof_citizenship_status == null) {
        errorObj.prof_citizenship_status = "Please select a option";
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
  
  console.log("profData",profData)
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
                      <Link to="/">
                        <i className="isax isax-home-15" />
                      </Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                        <Link to="/professional/dashboard">Professional</Link>
                    </li>
                    <li className="breadcrumb-item active">
                        <Link to="/professional/myprofile">Profile</Link>
                    </li>
                  </ol>
                  <h2 className="breadcrumb-title">My Profile</h2>
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
            <div className="col-md-5 col-lg-4 col-xl-3 theiaStickySidebar">
              <StickyBox offsetTop={20} offsetBottom={20}>
                <ProfessionalSidebar />
              </StickyBox>
            </div>

            <div className="col-lg-8 col-xl-9">
                {/* <ProfessionalNav/> */}
                  <div className="card">
                    <div className="card-body">
                      <div className="border-bottom pb-3 mb-3 text-end">
                        <button className="btn btn-primary text-white" onClick={handleFormEdit}><FaPen className="text-white"/>&nbsp;Edit</button>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="setting-title">
                          <h6>Personal Information</h6>
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
                                Other names
                                </label>
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={profData?.data?.prof_alias_name}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_alias_name: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_alias_name ? profData?.data?.prof_alias_name : "N/A"}</div>
                                )}
                                {formErrors.prof_alias_name && <div className="form-label text-danger m-1">{formErrors.prof_alias_name}</div>}
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                Social Security Number 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <input
                                    type="text"
                                    maxLength={9}
                                    className="form-control"
                                    value={profData?.data?.prof_social_security_num}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_social_security_num: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_social_security_num ? profData?.data?.prof_social_security_num : "N/A"}</div>
                                )}
                                {formErrors.prof_social_security_num && <div className="form-label text-danger m-1">{formErrors.prof_social_security_num}</div>}
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
                              <div className="form-wrap">
                                <label className="form-label">
                                DOB&nbsp;(IF YOUNGER THAN 18)
                                </label>
                                {editMode ? (
                                <div className="form-icon">
                                <DatePicker
                                className="form-control datetimepicker"
                                name="start_date"
                                selected={profData?.data?.prof_dob}
                                onChange={(date) => setProfData({ ...profData, data: { ...profData.data, prof_dob: date } })}
                                dateFormat="MM/dd/yyyy"
                                showDayMonthYearPicker
                                autoComplete='off'
                                />
                                  <span className="icon">
                                    <i className="fa-regular fa-calendar-days" />
                                  </span>
                                </div>
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_dob ?moment(profData.data.prof_dob).format('MM-DD-YYYY') : "N/A"}</div>
                                )}
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                Time at above address&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                </label>
                                {editMode ? (
                                  <div className="row">
                                    <div className="col-6">
                                    <input
                                      type="text"
                                      name="prof_address_years"
                                      value={profData?.data?.prof_address_years}
                                      onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_address_years: e.target.value } })}
                                      className="form-control"
                                      placeholder="Years"
                                    />
                                    </div>
                                    <div className="col-6">
                                    <input
                                      type="text"
                                      name="prof_address_months"
                                      value={profData?.data?.prof_address_months}
                                      onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_address_months: e.target.value } })}
                                      className="form-control"
                                      placeholder="Months"
                                    />
                                    </div>&nbsp;
                                    <div className="form-label">(IF LESS THAN 2 years, PLEASE LIST PREVIOUS ADDRESS)</div>
                                  </div>
                                  
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_address_years && profData?.data?.prof_address_months  ?  `${profData?.data?.prof_address_years}Years ${profData?.data?.prof_address_months}Months` : "N/A"}</div>
                                )}
                                {formErrors.prof_time_to_address && <div className="form-label text-danger m-1">{formErrors.prof_time_to_address}</div>}
                              </div>
                            </div>

                            <div className="row mt-2 mb-2">
                              <div className="col-lg-12 col-md-6">
                                <div className="setting-title">
                                  <h6>Current Address</h6>
                                </div>
                              </div>
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
                                      // onChange={(e) => setProfData({ 
                                      //     ...profData, 
                                      //     data: { 
                                      //     ...profData.data, 
                                      //     prof_cntry: e.value
                                      //     } 
                                      // })}
                                      placeholder="Select State"
                                      isClearable={true}
                                      isSearchable={true}
                                      isDisabled={true}
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
                                  Zipcode 
                                  </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                  {editMode ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={profData?.data?.prof_address_zip}
                                      onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_address_zip: e.target.value, prof_zip_primary: e.target.value } })}
                                    />
                                  ) : (
                                    <div className="form-control">{profData?.data?.prof_address_zip}</div>
                                  )}
                                  {formErrors.prof_address_zip && <div className="form-label text-danger m-1">{formErrors.prof_address_zip}</div>}
                                </div>
                              </div>
                            </div>
                            
                            <div className="row  mt-2 mb-2">
                              <div className="col-lg-12 col-md-6">
                                <div className="setting-title">
                                  <h6>Previous Address</h6>
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">
                                  Previous Address 
                                  </label>
                                  {editMode ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={profData?.data?.prof_prev_address}
                                      onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_prev_address: e.target.value } })}
                                    />
                                  ) : (
                                    <div className="form-control">{profData?.data?.prof_prev_address}</div>
                                  )}
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">
                                  Previous Address2 
                                  </label>
                                  {editMode ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={profData?.data?.prof_prev_address_2}
                                      onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_prev_address_2: e.target.value } })}
                                    />
                                  ) : (
                                    <div className="form-control">{profData?.data?.prof_prev_address_2}</div>
                                  )}
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">
                                  Previous City 
                                  </label>
                                  {editMode ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={profData?.data?.prof_prev_city}
                                      onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_prev_city: e.target.value } })}
                                    />
                                  ) : (
                                    <div className="form-control">{profData?.data?.prof_prev_city}</div>
                                  )}
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">
                                  Previous State 
                                  </label>
                                  {editMode ? (
                                    <Select
                                      name="prof_state"
                                      className="select"
                                      options={stateOptions}
                                      value={profData?.data?.prof_prev_state ? stateOptions.find(option => option.value === profData?.data?.prof_prev_state):null}
                                      onChange={(e) => setProfData({ 
                                          ...profData, 
                                          data: { 
                                          ...profData.data, 
                                          prof_prev_state: e.value
                                          } 
                                      })}
                                      placeholder="Select State"
                                      isClearable={true}
                                      isSearchable={true}
                                    />
                                  ) : (
                                      <div className="form-control">
                                      {
                                        stateOptions.find(option => option.value === profData?.data?.prof_prev_state)?.label || 'N/A'
                                      }
                                      </div>
                                  )}
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">
                                  Previous Country 
                                  </label>
                                  {editMode ? (
                                    <Select
                                      name="prof_cntry"
                                      className="select"
                                      options={cntryOptions}
                                      value={profData?.data?.prof_prev_cntry ? cntryOptions.find(option => option.value === profData.data.prof_prev_cntry) : null}
                                      onChange={(e) => setProfData({ 
                                          ...profData, 
                                          data: { 
                                          ...profData.data, 
                                          prof_prev_cntry: e.value
                                          } 
                                      })}
                                      placeholder="Select Country"
                                      isClearable={true}
                                      isSearchable={true}
                                      // isDisabled={true}
                                    />
                                  ) : (
                                      <div className="form-control">
                                      {
                                        cntryOptions.find(option => option.value === profData?.data?.prof_prev_cntry)?.label || 'N/A'
                                      }
                                      </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="row mt-2 mb-2">
                              <div className="col-lg-12 col-md-6">
                                <div className="setting-title">
                                  <h6>Billing Address</h6>
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">
                                  Billing Address 
                                  </label>
                                  {editMode ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={profData?.data?.prof_bill_address}
                                      onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_bill_address: e.target.value } })}
                                    />
                                  ) : (
                                    <div className="form-control">{profData?.data?.prof_bill_address}</div>
                                  )}
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">
                                  Billing Address2 
                                  </label>
                                  {editMode ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={profData?.data?.prof_bill_address_2}
                                      onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_bill_address_2: e.target.value } })}
                                    />
                                  ) : (
                                    <div className="form-control">{profData?.data?.prof_bill_address_2}</div>
                                  )}
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">
                                  Billing City 
                                  </label>
                                  {editMode ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={profData?.data?.prof_bill_city}
                                      onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_bill_city: e.target.value } })}
                                    />
                                  ) : (
                                    <div className="form-control">{profData?.data?.prof_bill_city}</div>
                                  )}
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">
                                  Billing State 
                                  </label>
                                  {editMode ? (
                                    <Select
                                      name="prof_state"
                                      className="select"
                                      options={stateOptions}
                                      value={profData?.data?.prof_bill_state ? stateOptions.find(option => option.value === profData?.data?.prof_bill_state):null}
                                      onChange={(e) => setProfData({ 
                                          ...profData, 
                                          data: { 
                                          ...profData.data, 
                                          prof_bill_state: e.value
                                          } 
                                      })}
                                      placeholder="Select State"
                                      isClearable={true}
                                      isSearchable={true}
                                    />
                                  ) : (
                                      <div className="form-control">
                                      {
                                        stateOptions.find(option => option.value === profData?.data?.prof_bill_state)?.label || 'N/A'
                                      }
                                      </div>
                                  )}
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">
                                  Billing Country 
                                  </label>
                                  {editMode ? (
                                    <Select
                                      name="prof_cntry"
                                      className="select"
                                      options={cntryOptions}
                                      value={profData?.data?.prof_bill_cntry ? cntryOptions.find(option => option.value === profData.data.prof_bill_cntry) : null}
                                      onChange={(e) => setProfData({ 
                                          ...profData, 
                                          data: { 
                                          ...profData.data, 
                                          prof_bill_cntry: e.value
                                          } 
                                      })}
                                      placeholder="Select Country"
                                      isClearable={true}
                                      isSearchable={true}
                                      // isDisabled={true}
                                    />
                                  ) : (
                                      <div className="form-control">
                                      {
                                        cntryOptions.find(option => option.value === profData?.data?.prof_bill_cntry)?.label || 'N/A'
                                      }
                                      </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-6 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                CellPhone 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <div className="row g-2">
                                    <div className="col-auto d-flex align-items-center">
                                      <span>(+1)</span>
                                    </div>
                                    <div className="col-3">
                                    <input
                                      type="text"
                                      maxLength={3}
                                      name="contact_phone_area"
                                      value={phoneArea}
                                      onChange={(e) => setPhoneArea(e.target.value)}
                                      className="form-control"
                                    />
                                    </div>
                                    <div className="col-3">
                                    <input
                                      type="text"
                                      maxLength={3}
                                      name="contact_phone_prefix"
                                      value={phonePrefix}
                                      onChange={(e) => setPhonePrefix(e.target.value)}
                                      className="form-control"
                                    />
                                    </div>
                                    <div className="col-3">
                                    <input
                                      type="text"
                                      maxLength={4}
                                      name="contact_phone_line"
                                      value={phoneLine}
                                      onChange={(e) => setPhoneLine(e.target.value)}
                                      className="form-control"
                                    />
                                    </div>
                                  </div>
                                  // <input
                                  //   type="text"
                                  //   className="form-control"
                                  //   value={profData.data.prof_contact}
                                  //   onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_contact: e.target.value } })}
                                  // />
                                ) : (
                                  <div className="form-control">({phoneArea})-{phonePrefix}-{phoneLine}</div>
                                )}
                                {formErrors.prof_contact && <div className="form-label text-danger m-1">{formErrors.prof_contact}</div>}
                              </div>
                            </div>
                            
                            <div className="col-lg-6 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                 Home Contact 
                                </label>
                                {editMode ? (
                                  <div className="row g-2">
                                    <div className="col-auto d-flex align-items-center">
                                      <span>(+1)</span>
                                    </div>
                                    <div className="col-3">
                                    <input
                                      type="text"
                                      maxLength={3}
                                      name="contact_phone_area"
                                      value={homeArea}
                                      onChange={(e) => setHomeArea(e.target.value)}
                                      className="form-control"
                                    />
                                    </div>
                                    <div className="col-3">
                                    <input
                                      type="text"
                                      maxLength={3}
                                      name="contact_phone_prefix"
                                      value={homePrefix}
                                      onChange={(e) => setHomePrefix(e.target.value)}
                                      className="form-control"
                                    />
                                    </div>
                                    <div className="col-3">
                                    <input
                                      type="text"
                                      maxLength={4}
                                      name="contact_phone_line"
                                      value={homeLine}
                                      onChange={(e) => setHomeLine(e.target.value)}
                                      className="form-control"
                                    />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_home_phone ? (homeArea)-homePrefix-homeLine : "N/A"}</div>
                                )}
                                
                              </div>
                            </div>

                            <div className="col-lg-6 col-md-6">
                              <div className="mb-4">
                                <label className="form-label">
                                 Alternate Contact 
                                </label>
                                {editMode ? (
                                  <div className="row g-2">
                                   <div className="col-auto d-flex align-items-center">
                                    <span>(+1)</span>
                                  </div>
                                  <div className="col-3">
                                    <input
                                      type="text"
                                      maxLength={3}
                                      name="contact_phone_area"
                                      value={altArea}
                                      onChange={(e) => setAltArea(e.target.value)}
                                      className="form-control"
                                    />
                                  </div>
                                  <div className="col-3">
                                    <input
                                      type="text"
                                      maxLength={3}
                                      name="contact_phone_prefix"
                                      value={altPrefix}
                                      onChange={(e) => setAltPrefix(e.target.value)}
                                      className="form-control"
                                    />
                                  </div>
                                  <div className="col-3">
                                    <input
                                      type="text"
                                      maxLength={4}
                                      name="contact_phone_line"
                                      value={altLine}
                                      onChange={(e) => setAltLine(e.target.value)}
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                                
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_alt_phone ?  (altArea)-altPrefix-altLine : "N/A"}</div>
                                )}
                                
                              </div>
                            </div>
                            
                            <div className="col-lg-12 col-md-6">
                              <div className="mb-4">
                                  <label className="form-label">
                                    Green Card / US Passport&nbsp;(Front)&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                  </label>
                                  {profData?.data?.prof_proof_front && typeof profData?.data?.prof_proof_front === 'string' ? (
                                      <div className={editMode ? null : "form-control"}>
                                          {editMode ? <label>Currently: </label> : null}
                                          <a href={profData.data.prof_proof_front} target="_blank" rel="noopener noreferrer">
                                              {profData.data.prof_proof_front.split("/").pop()}
                                          </a>
                                          {editMode ?
                                          <button 
                                              type="button" 
                                              className="btn btn-danger m-1" 
                                              onClick={() => setProfData({ ...profData, data: { ...profData.data, prof_proof_front: "" } })}
                                          >
                                              Delete
                                          </button>
                                          :null}
                                      </div>
                                  ) : null}
                                  
                                  {editMode &&
                                  <input
                                      type="file"
                                      name="prof_proof_front"
                                      className="form-control"
                                      onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_proof_front: e.target.files[0] } })}
                                      readOnly={editMode ? true : false}
                                  />
                                }
                                  {formErrors.prof_proof_front && <div className="form-label text-danger m-1">{formErrors.prof_proof_front}</div>}
                              </div>
                            </div>

                            <div className="col-lg-12 col-md-6">
                              <div className="mb-4">
                                  <label className="form-label">
                                    Green Card / US Passport&nbsp;(Back)&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                  </label>
                                  {profData?.data?.prof_proof_back && typeof profData?.data?.prof_proof_back === 'string' ? (
                                      <div className={editMode ? null : "form-control"}>
                                          {editMode ? <label>Currently: </label> : null }
                                          <a href={profData.data.prof_proof_back} target="_blank" rel="noopener noreferrer">
                                              {profData.data.prof_proof_back.split("/").pop()}
                                          </a>
                                          {editMode ?
                                          <button 
                                              type="button" 
                                              className="btn btn-danger m-1" 
                                              onClick={() => setProfData({ ...profData, data: { ...profData.data, prof_proof_back: "" } })}
                                          >
                                              Delete
                                          </button>
                                          :
                                          null}
                                      </div>
                                  ) : null}
                                  {editMode &&
                                  <input
                                      type="file"
                                      name="prof_proof_back"
                                      className="form-control"
                                      onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_proof_back: e.target.files[0] } })}
                                      readOnly={editMode ? true : false}
                                  />
                                  }
                                  {formErrors.prof_proof_back && <div className="form-label text-danger m-1">{formErrors.prof_proof_back}</div>}
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                Legally Eligible Work in U.S.A?  
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <Select
                                    name="prof_state"
                                    className="select"
                                    options={boolOption}
                                    value={profData?.data?.prof_is_eligible ? boolOption.find(option => option.value === profData?.data?.prof_is_eligible):null}
                                    onChange={(e) => setProfData({ 
                                        ...profData, 
                                        data: { 
                                        ...profData.data, 
                                        prof_is_eligible: e.value
                                        } 
                                    })}
                                    placeholder="Select Eligibility"
                                    isClearable={true}
                                    isSearchable={true}
                                  />
                                ) : (
                                    <div className="form-control">
                                    {
                                      boolOption.find(option => option.value === profData?.data?.prof_is_eligible)?.label || 'N/A'
                                    }
                                    </div>
                                )}
                                {formErrors.prof_is_eligible && <div className="form-label text-danger m-1">{formErrors.prof_is_eligible}</div>}
                              </div>
                            </div>

                            <div className="col-lg-12 col-md-6">
                              <div className="col-lg-6 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">
                                  Citizenship Status&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                  </label>
                                  {editMode ? (
                                    <Select
                                      name="prof_citizenship_status"
                                      className="select"
                                      options={ImmigartionStatus}
                                      value={profData?.data?.prof_citizenship_status ? ImmigartionStatus.find(option => option.value.trim() === profData?.data?.prof_citizenship_status.trim()) : null}
                                      onChange={(e) => handleSelect(e.value)}
                                      placeholder="Select Citizenship Status"
                                      // isClearable={true}
                                      isSearchable={true}
                                      // isDisabled={true}
                                    />
                                  ) : (
                                      <div className="form-control">
                                        {profData?.data?.prof_citizenship_status || 'N/A'}
                                      </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* <div className="col-lg-12 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Citizenship Status&nbsp;{editMode ? <span className="text-danger">*</span> : null }</label>
                                {editMode ? (
                                  <div className="row">
                                    {ImmigartionStatus.map((status) => (
                                      <div className="col-auto form-check" key={status.value}>
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name="citizenshipStatus"
                                          value={status.value}
                                          checked={profData?.data?.prof_citizenship_status === status.value}
                                          onChange={(e) =>handleCitizenship(e)}
                                        />
                                        <label className="form-check-label">{status.label}</label>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="form-control">
                                    {ImmigartionStatus.find(
                                      (status) => status.value === profData?.data?.prof_citizenship_status
                                    )?.label || "Not specified"}
                                  </div>
                                )}
                                {formErrors.prof_citizenship_status && <div className="form-label text-danger m-1">{formErrors.prof_citizenship_status}</div>}
                              </div>
                            </div> */}
                            {citizenship ?
                            <>
                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  USCIS A-Number 
                                </label>
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={profData?.data?.prof_uscis_number}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_uscis_number: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_uscis_number}</div>
                                )}
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                Form I-94 Admission Number 
                                </label>
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={profData?.data?.prof_admission_number}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_admission_number: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_admission_number}</div>
                                )}
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                Foreign Passport Number / country of insurance 
                                </label>
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={profData?.data?.prof_passport_insurance}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_passport_insurance: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_passport_insurance}</div>
                                )}
                              </div>
                            </div>
                            </>
                          :
                          null
                          }
                          </div>
                        </div>
                        
                        <div className="setting-title">
                          <h6>Professional Information</h6>
                        </div>
                        <div className={editMode ? "setting-card border border-primary" : "setting-card"}>
                          <div className="row">
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
                                    components={{ Option : ColourOption, SingleValue, MultiValueLabel }}
                                  />
                                ) : (
                                  <div className="form-control">
                                  {
                                    profData?.data?.Discipline?.length > 0
                                      ? profData.data.Discipline
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
                              {formErrors.prof_discipline && <div className="form-label text-danger m-1">{formErrors.prof_discipline}</div>}
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
                              <div className="form-wrap">
                                <label className="form-label">
                                Date of Initial Issue&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                </label>
                                {editMode ? (
                                <div className="form-icon">
                                <DatePicker
                                className="form-control datetimepicker"
                                name="start_date"
                                selected={profData?.data?.prof_lic_issued}
                                onChange={(date) => setProfData({ ...profData, data: { ...profData.data, prof_lic_issued: date } })}
                                dateFormat="MM/dd/yyyy"
                                showDayMonthYearPicker
                                autoComplete='off'
                                />
                                  <span className="icon">
                                    <i className="fa-regular fa-calendar-days" />
                                  </span>
                                </div>
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_lic_issued ?convertToUS(profData.data.prof_lic_issued, 'Date') : "N/A"}</div>
                                )}
                                {formErrors.prof_lic_issued && <div className="form-label text-danger m-1">{formErrors.prof_lic_issued}</div>}
                              </div>
                            </div>
                            
                            <div className="col-lg-4 col-md-6">
                              <div className="form-wrap">
                                <label className="form-label">
                                Date of Expiration&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                </label>
                                {editMode ? (
                                <div className="form-icon">
                                <DatePicker
                                className="form-control datetimepicker"
                                name="end_date"
                                selected={profData?.data?.prof_lic_expired}
                                onChange={(date) => setProfData({ ...profData, data: { ...profData.data, prof_lic_expired: date } })}
                                dateFormat="MM/dd/yyyy"
                                showDayMonthYearPicker
                                autoComplete='off'
                              />
                                  <span className="icon">
                                    <i className="fa-regular fa-calendar-days" />
                                  </span>
                                </div>
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_lic_expired ? convertToUS(profData.data.prof_lic_expired, 'Date'): "N/A"}</div>
                                )}
                                {formErrors.prof_lic_expired && <div className="form-label text-danger m-1">{formErrors.prof_lic_expired}</div>}
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                License Status 
                                </label>&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                {editMode ? (
                                  <Select
                                    name="prof_lic_status"
                                    className="select"
                                    options={LicenseStatus}
                                    value={profData?.data?.prof_lic_status ? LicenseStatus.find(option => option.value === profData?.data?.prof_lic_status) : null}
                                    onChange={(e) => setProfData({ 
                                        ...profData, 
                                        data: { 
                                        ...profData.data, 
                                        prof_lic_status: e.value
                                        } 
                                    })}
                                    placeholder="Select Status"
                                    isClearable={true}
                                    isSearchable={true}
                                  />
                                ) : (
                                    <div className="form-control">
                                    {
                                      LicenseStatus.find(option => option.value === profData?.data?.prof_lic_status)?.label || 'N/A'
                                    }
                                    </div>
                                )}
                                {formErrors.prof_lic_status && <div className="form-label text-danger m-1">{formErrors.prof_lic_status}</div>}
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  EIN/SSN Number 
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

                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  LinkedIn
                                </label>
                                {editMode ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={profData?.data?.prof_linkedin}
                                    onChange={(e) => setProfData({ ...profData, data: { ...profData.data, prof_linkedin: e.target.value } })}
                                  />
                                ) : (
                                  <div className="form-control">{profData?.data?.prof_linkedin ? profData?.data?.prof_linkedin : "N/A"}</div>
                                )}
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Work Setting Experience 
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
                            <div className="row">
                              <div className="col-lg-4 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">
                                    Preferred Zipcode of practice (Primary)&nbsp;{editMode ? <span className="text-danger">*</span> : null }
                                  </label>
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
                                  Preferred Zipcode of practice (Secondary)
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

export default ProfessionalProfile;
