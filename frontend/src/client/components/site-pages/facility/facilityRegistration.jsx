import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import Select from "react-select";
import SiteHeader from '../home/header';
import { submitForm } from '../submitForm';
import { API_BASE_URL, AUTH_TOKEN, fetchModules, workExperienceOptions, disciplineOptions, specialtyOptions, yearOptions, docOptions, langOptions, weeklyOptions, cntryOptions, stateOptions,ColourOption, SingleValue, MultiValueLabel  } from "../config";
import { FaPlusSquare, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import axios from "axios";

const FacilityRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formErrors, setFormErrors] = useState({});

  const userGroup = atob(localStorage.getItem('group'))
  const groupLinkID = atob(localStorage.getItem('FacilityGrpID'))

  const [linkCreated, setLinkCreated] = useState(false);
  const [linkData, setLinkData] = useState({
    fac_id: '',
    fac_grp_id: groupLinkID
  })

  const [docSoftOptions, setDocSoftOptions] = useState(docOptions)
  const [languageOptions, setLanguageOptions] = useState(langOptions)
  const [showAddLang, setShowAddLang] = useState(false);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [optionDatas, setOptionDatas] = useState(null);
  const [docSoft, setDocSoft] = useState(null);
  const [language, setLanguage] = useState(null);

  const [errorValidateNew, setErrorValidateNew] = useState({});
  
  //contact 
  const [phoneArea, setPhoneArea] = useState('')
  const [phonePrefix, setPhonePrefix] = useState('')
  const [phoneLine, setPhoneLine] = useState('')


  const [formData, setFormData] = useState({
    fac_title: '',
    fac_business_name: '',
    fac_first_name: '',
    fac_middle_name: '',
    fac_last_name: '',
    fac_email: '',
    fac_password: '',
    fac_confirm_password: '',
    fac_address: '',
    fac_address_2: '',
    fac_city: '',
    fac_state: '',
    fac_cntry: cntryOptions[0],
    fac_zipcode: '',
    fac_contact_num: '',
    // fac_ein_number: '',
    fac_wrk_exp: '',
    fac_weekly_visit: '',
    fac_npi: '',
    fac_status: 'Waiting for Confirmation',
    fac_wrk_setting: [],
    fac_discipline: [],
    fac_langs: [langOptions.find(lang => lang.label === "English")],
    fac_doc_soft: [],
    fac_speciality: []
  });

  var userFormData = {
    username: formData.fac_email,
    first_name: formData.fac_first_name,
    last_name: formData.fac_last_name,
    email: formData.fac_email,
    password: formData.fac_password,
    group_name: 'Facility',
    method: 'create'
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

  const validateEmail = async (email) => {
    const emailData = {
      Email: email
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/ValidateEmail/`, emailData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN
        }
      });

      //console.log('errorValidatecurlresponse',response);
      //console.log('errorValidatethird')
      return null
    } catch (err) {
      return err.response.data.Result;
    }
  }

  const validiteFormInputs = async (data) => {


    console.log('errorValidateSecond')

    setFormErrors({});
    let errorObj = {};

    
    const emailRegx = /.+@.+\.[A-Za-z]+$/
    const phoneRegx = /\d/g

    if (currentStep === 1) {

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

      if (data.fac_email == '') {
        errorObj.fac_email = "Email is required";
      }

      if (data.fac_password == '') {
        errorObj.fac_password = "Password is required";
      }

      if (data.fac_confirm_password == '') {
        errorObj.fac_confirm_password = "Confirm password is required";
      }

      if ((data.fac_password != '') && (data.fac_confirm_password != '')) {
        if (JSON.stringify(data.fac_password) != JSON.stringify(data.fac_confirm_password)) {
          errorObj.fac_confirm_password = "Password and confirm password should be the same";
        }
      }

      if (data.fac_email != '') {
        if (!emailRegx.test(data.fac_email)) {
          errorObj.fac_email = "Invalid email";
        } else {         
         const emailResult = await validateEmail(data.fac_email)
         console.log('errorValidatedata',emailResult)
         if (emailResult) {
           errorObj.fac_email = emailResult;           
         }      
        }
      }

    }

    if (currentStep === 2) {
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

      // if (data.fac_contact_num == '') {
      //   errorObj.fac_contact_num = "Contact is required";
      // }

      // if (data.fac_contact_num != '') {
      //   if (!phoneRegx.test(data.fac_contact_num)) {
      //     errorObj.fac_contact_num = "Invalid contact number";
      //   }
      // }
      if (phoneArea == '' || phonePrefix == '' || phoneLine == '') {
        errorObj.fac_contact_num = "Contact is required";
      }else{
        if (!Number.isInteger(parseInt(phoneArea)) || !Number.isInteger(parseInt(phonePrefix)) || !Number.isInteger(parseInt(phoneLine))) {
            errorObj.fac_contact_num = "Invalid phone number";
        }
      }

      if (phoneArea.length < 3 || phonePrefix.length < 3 || phoneLine.length < 4 ){
        errorObj.fac_contact_num = "Invalid phone number";
      }
    }


    if (currentStep === 3) {
      // if (data.fac_ein_number == '') {
      //   errorObj.fac_ein_number = "EIN Number is required";
      // }

      if (data.fac_wrk_exp == '') {
        errorObj.fac_wrk_exp = "Please choose a years in business";
      }

      if (data.fac_weekly_visit == '') {
        errorObj.fac_weekly_visit = "Please choose an availability";
      }

      // if (data.fac_npi == '') {
      //   errorObj.fac_npi = "NPI Number is required";
      // }

      if (data.fac_wrk_setting.length == 0) {
        errorObj.fac_wrk_setting = "Please choose atleast one experience";
      }

      if (data.fac_discipline.length == 0) {
        errorObj.fac_discipline = "Please choose atleast one discipline";
      }

      if (data.fac_langs.length == 0) {
        errorObj.fac_langs = "Please choose atleast one language";
      }

      if (data.fac_doc_soft.length == 0) {
        errorObj.fac_doc_soft = "Please choose atleast one sotfware";
      }

      if (data.fac_speciality.length == 0) {
        errorObj.fac_speciality = "Please choose atleast one speciality";
      }
    }

    console.log('errorValidateLocalObject', errorObj)      
    return errorObj
    
    
  }

  const handleNext = async () => {
    console.log('errorValidateFirst')
    //let errorValidate = {};
    const errorValidateResult = await validiteFormInputs(formData)
    //setErrorValidateNew(errorValidateResult);
    //validiteFormInputs(formData)
    console.log('errorValidateObject', errorValidateResult)
    //console.log('errorValidateObjectNew', errorValidateNew)    
    console.log('errorValidateLength', Object.keys(errorValidateResult).length)
    //console.log('errorValidateForms', formErrors)
    //setFormErrors(errorValidateResult)
    
    if (Object.keys(errorValidateResult).length === 0) {
      setCurrentStep(currentStep + 1);
    } else {
      setFormErrors(errorValidateResult)
    }
    
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectChange = (selectedOptions, fieldName) => {
    setFormData(prevState => ({
      ...prevState,
      [fieldName]: selectedOptions
    }));
  };

  useEffect(() => {
    if (linkCreated) {
      const createFacilityLink = async () => {
        try {
          const facilityLink = await submitForm(`${API_BASE_URL}/facility/CreateFacilityGrpLink/`, linkData, AUTH_TOKEN, setIsLoading, setError);
          navigate('/facility-group-view');
        } catch (err) {
          setError(err.response.data.Result || 'An error occurred during facility group creation.');
        } finally {
          setIsLoading(false);
        }
      };

      createFacilityLink();
    }
  }, [linkCreated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAddDoc(false);
    setShowAddLang(false);
    const formValidate = await validiteFormInputs(formData)
    if (Object.keys(formValidate).length === 0) {
      setIsLoading(true);
      setError(null);
      try {
        const userData = await submitForm(`${API_BASE_URL}/GenerateUserOrLink/`, userFormData, AUTH_TOKEN, setIsLoading, setError);

        if (userData && userData.Status && userData.Status === 'Success') {
          const updatedFormData = { ...formData, user: parseInt(userData.Result.UserID), fac_contact_num:`${phoneArea}${phonePrefix}${phoneLine}` };
          let facilityData = await submitForm(`${API_BASE_URL}/facility/CreateFacility/`, updatedFormData, AUTH_TOKEN, setIsLoading, setError);

          setLinkData({ ...linkData, fac_id: facilityData.ID })
          if (facilityData.Status.Code === "Success") {
            console.log(userGroup)
            if (userGroup === "FacilityGroup") {
              setLinkData(prevFormData => ({
                ...prevFormData,
                fac_id: facilityData.ID
              }));
              setLinkCreated(true);
            }
            else {
              const facility = facilityData.Email;
              localStorage.setItem('facEmail', btoa(facility));
              handleNext();
            }
          }
        } else {
          setError(userData.data.Result || 'Failed to create user.');
        }
      } catch (err) {
        setError(err.response.data.Result || 'An error occurred during form submission.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setFormErrors(formValidate)
      return false;
    }
  };

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

  useEffect(() => {
    const setOptionData = async () => {
      let optionName = null
      let nameField = null

      if (optionDatas) {
        const data = await fetchModules()
        if (optionDatas.name === "docSoft") {
          optionName = "DocSoftware"
          nameField = "doc_soft_name"
        } else {
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
  }, [optionDatas])

  useEffect(() => {
    if (optionDatas) {
      const docValue = docSoftOptions.find(option => option.value === optionDatas.data.id)
      setFormData(pre => ({
        ...pre,
        fac_doc_soft: [docValue]
      }))
      setShowAddDoc(false)
      setDocSoft(null)
    }
  }, [docSoftOptions])

  useEffect(() => {
    if (optionDatas) {
      const langValue = languageOptions.find(option => option.value === optionDatas.data.id)
      setFormData(pre => ({
        ...pre,
        fac_langs: [langValue]
      }))
      setShowAddLang(false)
      setLanguage(null)
    }
  }, [languageOptions])

  console.log("formData",formData)

  return (
    <div className="main-wrapper">
      <SiteHeader />
      <div className="doctor-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-9 mx-auto">
              <div className="booking-wizard">
                <ul
                  className="form-wizard-steps d-sm-flex align-items-center justify-content-center"
                  id="progressbar2"
                >
                  <li className={
                    currentStep === 1
                      ? 'progress-active'
                      : currentStep > 1
                        ? 'progress-activated'
                        : ''
                  }>
                    <div className="profile-step">
                      <span className="multi-steps">1</span>
                      <div className="step-section">
                        <h6>Authentication Information</h6>
                      </div>
                    </div>
                  </li>
                  <li className={
                    currentStep === 2
                      ? 'progress-active'
                      : currentStep > 2
                        ? 'progress-activated'
                        : ''
                  }>
                    <div className="profile-step">
                      <span className="multi-steps">2</span>
                      <div className="step-section">
                        <h6>Basic Information</h6>
                      </div>
                    </div>
                  </li>
                  <li className={
                    currentStep === 3
                      ? 'progress-active'
                      : currentStep > 3
                        ? 'progress-activated'
                        : ''
                  }>
                    <div className="profile-step">
                      <span className="multi-steps">3</span>
                      <div className="step-section">
                        <h6>Work Information</h6>
                      </div>
                    </div>
                  </li>
                  <li className={
                    currentStep === 4
                      ? 'progress-active'
                      : currentStep > 4
                        ? 'progress-activated'
                        : ''
                  }>
                    <div className="profile-step">
                      <span className="multi-steps">4</span>
                      <div className="step-section">
                        <h6>Confirmation</h6>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="booking-widget multistep-form mb-5">
                <form onSubmit={handleSubmit}>
                  {currentStep === 1 && (
                    <fieldset id="first">
                      <div className="card booking-card mb-0">
                        <div className="card-header">
                          <h3>Facility Registration</h3>
                          {error && <div className="form-label text-danger m-1">{error}</div>}
                        </div>
                        <div className="card-body booking-body">
                          <div className="card mb-0">
                            <div className="card-body pb-1">
                              <div className="row">
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Business Name <span className="text-danger">*</span></label>
                                    <input type="text" name="fac_business_name" value={formData.fac_business_name} onChange={handleInputChange} className="form-control" />
                                    {formErrors.fac_business_name && <div className="form-label text-danger m-1">{formErrors.fac_business_name}</div>}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Title <span className="text-danger">*</span></label>
                                    <input type="text" name="fac_title" value={formData.fac_title} onChange={handleInputChange} className="form-control" />
                                    {formErrors.fac_title && <div className="form-label text-danger m-1">{formErrors.fac_title}</div>}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">First Name <span className="text-danger">*</span></label>
                                    <input type="text" name="fac_first_name" value={formData.fac_first_name} onChange={handleInputChange} className="form-control" />
                                    {formErrors.fac_first_name && <div className="form-label text-danger m-1">{formErrors.fac_first_name}</div>}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Middle Name</label>
                                    <input type="text" name="fac_middle_name" value={formData.fac_middle_name} onChange={handleInputChange} className="form-control" /></div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Last Name <span className="text-danger">*</span></label>
                                    <input type="text" name="fac_last_name" value={formData.fac_last_name} onChange={handleInputChange} className="form-control" />
                                    {formErrors.fac_last_name && <div className="form-label text-danger m-1">{formErrors.fac_last_name}</div>}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Email Address <span className="text-danger">*</span></label>
                                    <input type="text" name="fac_email" value={formData.fac_email} onChange={handleInputChange} className="form-control" />
                                    {formErrors.fac_email && <div className="form-label text-danger m-1">{formErrors.fac_email}</div>}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Password <span className="text-danger">*</span></label>
                                    <input type="password" name="fac_password" value={formData.fac_password} onChange={handleInputChange} className="form-control" />
                                    {formErrors.fac_password && <div className="form-label text-danger m-1">{formErrors.fac_password}</div>}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
                                    <input type="password" name="fac_confirm_password" value={formData.fac_confirm_password} onChange={handleInputChange} className="form-control" />
                                    {formErrors.fac_confirm_password && <div className="form-label text-danger m-1">{formErrors.fac_confirm_password}</div>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer">
                          <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                            <Link
                              to="#"
                              // className="btn btn-md btn-dark inline-flex align-items-center rounded-pill"
                            >
                              {/* <i className="isax isax-arrow-left-2 me-1" />
                              Back */}
                            </Link>
                            <Link
                              to="#"
                              className="btn btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                              onClick={handleNext}
                            >
                              Add Basic Information
                              <i className="isax isax-arrow-right-3 ms-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  )}
                  {currentStep === 2 && (
                    <fieldset style={{ display: 'block' }}>
                      <div className="card booking-card mb-0">
                        <div className="card-header">
                          <h3>Facility Registration</h3>
                        </div>
                        <div className="card-body booking-body">
                          <div className="card mb-0">
                            <div className="card-body pb-1">
                              <div className="row">
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Address <span className="text-danger">*</span></label>
                                    <input type="text" name="fac_address" value={formData.fac_address} onChange={handleInputChange} className="form-control" />
                                    {formErrors.fac_address && <div className="form-label text-danger m-1">{formErrors.fac_address}</div>}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Address 2</label>
                                    <input type="text" name="fac_address_2" value={formData.fac_address_2} onChange={handleInputChange} className="form-control" />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">City <span className="text-danger">*</span></label>
                                    <input type="text" name="fac_city" value={formData.fac_city} onChange={handleInputChange} className="form-control" />
                                    {formErrors.fac_city && <div className="form-label text-danger m-1">{formErrors.fac_city}</div>}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Select State <span className="text-danger">*</span></label>
                                    <Select
                                      className="select"
                                      name="fac_state"
                                      options={stateOptions}
                                      value={formData.fac_state}
                                      onChange={(selected) => handleSelectChange(selected, 'fac_state')}
                                      placeholder="Select"
                                      isClearable={true}
                                      isSearchable={true}
                                    />
                                    {formErrors.fac_state && <div className="form-label text-danger m-1">{formErrors.fac_state}</div>}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Select Country <span className="text-danger">*</span></label>

                                    <Select
                                      className="select"
                                      name="fac_cntry"
                                      options={cntryOptions}
                                      value={cntryOptions[0]}
                                      //onChange={(selected) => handleSelectChange(selected, 'fac_cntry')}
                                      placeholder="Select"
                                      isClearable={true}
                                      isSearchable={true}
                                      isDisabled={true}
                                    />
                                    {formErrors.fac_cntry && <div className="form-label text-danger m-1">{formErrors.fac_cntry}</div>}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Zipcode <span className="text-danger">*</span></label>
                                    <input type="text" name="fac_zipcode" value={formData.fac_zipcode} onChange={handleInputChange} className="form-control" />
                                    {formErrors.fac_zipcode && <div className="form-label text-danger m-1">{formErrors.fac_zipcode}</div>}
                                  </div>
                                </div>
                                {/* <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Contact <span className="text-danger">*</span></label>
                                    <input type="text" name="fac_contact_num" value={formData.fac_contact_num} onChange={handleInputChange} className="form-control" />
                                    {formErrors.fac_contact_num && <div className="form-label text-danger m-1">{formErrors.fac_contact_num}</div>}
                                  </div>
                                </div> */}
                                <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Phone Number 
                                </label>&nbsp;<span className="text-danger">*</span>
                                  <div className="row g-2">
                                  <div className="col-4">
                                  <input
                                    type="text"
                                    maxLength={3}
                                    name="contact_phone_area"
                                    value={phoneArea}
                                    onChange={(e) => setPhoneArea(e.target.value)}
                                    className="form-control"
                                  />
                                  </div>
                                  <div className="col-4">
                                  <input
                                    type="text"
                                    maxLength={3}
                                    name="contact_phone_prefix"
                                    value={phonePrefix}
                                    onChange={(e) => setPhonePrefix(e.target.value)}
                                    className="form-control"
                                  />
                                  </div>
                                  <div className="col-4">
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
                              {formErrors.fac_contact_num && <div className="form-label text-danger m-1">{formErrors.fac_contact_num}</div>}
                              </div>
                            </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer">
                          <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                            <Link
                              to="#"
                              className="btn btn-md btn-dark prev_btns inline-flex align-items-center rounded-pill"
                              onClick={handlePrev}
                            >
                              <i className="isax isax-arrow-left-2 me-1" />
                              Back
                            </Link>
                            <Link
                              to="#"
                              className="btn btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                              onClick={handleNext}
                            >
                              Add Work Information
                              <i className="isax isax-arrow-right-3 ms-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  )}
                  {currentStep === 3 && (
                    <fieldset style={{ display: 'block' }}>
                      <div className="card booking-card mb-0">
                        <div className="card-header">
                          <h3>Facility Registration</h3>
                        </div>
                        <div className="card-body booking-body">
                          <div className="card mb-0">
                            <div className="card-body pb-1">
                              <div className="row">
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Work Experience <span className="text-danger">*</span></label>

                                    <Select
                                      className="select"
                                      isMulti
                                      name="fac_wrk_setting"
                                      options={workExperienceOptions}
                                      value={formData.fac_wrk_setting}
                                      onChange={(selected) => handleSelectChange(selected, 'fac_wrk_setting')}
                                      placeholder="Select"
                                      isClearable={true}
                                      isSearchable={true}
                                    />
                                    {formErrors.fac_wrk_setting && <div className="form-label text-danger m-1">{formErrors.fac_wrk_setting}</div>}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Discipline <span className="text-danger">*</span></label>

                                    <Select
                                      className="select"
                                      isMulti
                                      name="fac_discipline"
                                      options={disciplineOptions}
                                      value={formData.fac_discipline}
                                      onChange={(selected) => handleSelectChange(selected, 'fac_discipline')}
                                      placeholder="Select"
                                      isClearable={true}
                                      isSearchable={true}
                                      components={{ Option : ColourOption, SingleValue, MultiValueLabel }}
                                    />
                                    {formErrors.fac_discipline && <div className="form-label text-danger m-1">{formErrors.fac_discipline}</div>}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Years in Business <span className="text-danger">*</span></label>

                                    <Select
                                      className="select"
                                      name="fac_wrk_exp"
                                      options={yearOptions}
                                      value={formData.fac_wrk_exp}
                                      onChange={(selected) => handleSelectChange(selected, 'fac_wrk_exp')}
                                      placeholder="Select"
                                      isClearable={true}
                                      isSearchable={true}
                                    />
                                    {formErrors.fac_wrk_exp && <div className="form-label text-danger m-1">{formErrors.fac_wrk_exp}</div>}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Specialty <span className="text-danger">*</span></label>

                                    <Select
                                      className="select"
                                      isMulti
                                      name="fac_speciality"
                                      options={specialtyOptions}
                                      value={formData.fac_speciality}
                                      onChange={(selected) => handleSelectChange(selected, 'fac_speciality')}
                                      placeholder="Select"
                                      isClearable={true}
                                      isSearchable={true}
                                    />
                                    {formErrors.fac_speciality && <div className="form-label text-danger m-1">{formErrors.fac_speciality}</div>}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Documentation software <span className="text-danger">*</span></label>

                                    {showAddDoc ?
                                      <>
                                        <input type="text" name="fac_doc_soft" value={docSoft} onChange={(e) => setDocSoft(e.target.value)} className="form-control" />
                                        <FaPlusCircle className='text-success' onClick={() => quickAdd('docSoft')} />
                                        <FaMinusCircle className='text-danger' onClick={()=>handleDocDisplay(false)} />
                                      </>
                                      :
                                      <>
                                        <Select
                                          isMulti
                                          className="select"
                                          name="fac_doc_soft"
                                          options={docSoftOptions}
                                          value={formData.fac_doc_soft}
                                          onChange={(selected) => handleSelectChange(selected, 'fac_doc_soft')}
                                          placeholder="Select"
                                          isClearable={true}
                                          isSearchable={true}
                                        />
                                        <FaPlusSquare className='text-success' onClick={() => handleDocDisplay(true)} />
                                      </>

                                    }
                                    {formErrors.fac_doc_soft && <div className="form-label text-danger m-1">{formErrors.fac_doc_soft}</div>}

                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Languages <span className="text-danger">*</span></label>

                                    {showAddLang ?
                                      <>
                                        <input type="text" name="fac_langs" value={language} onChange={(e) => setLanguage(e.target.value)} className="form-control" />
                                        <FaPlusCircle className='text-success' onClick={() => quickAdd('language')} />
                                        <FaMinusCircle className='text-danger' onClick={() => handleLangDisplay(false)} />
                                      </>
                                      :
                                      <>
                                        <Select
                                          isMulti
                                          className="select"
                                          name="fac_langs"
                                          options={languageOptions}
                                          value={formData.fac_langs}
                                          onChange={(selected) => handleSelectChange(selected, 'fac_langs')}
                                          placeholder="Select"
                                          isClearable={true}
                                          isSearchable={true}
                                        />
                                        <FaPlusSquare className='text-success' onClick={() => handleLangDisplay(true)} />
                                      </>
                                    }
                                    {formErrors.fac_langs && <div className="form-label text-danger m-1">{formErrors.fac_langs}</div>}

                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">Weekly Need <span className="text-danger">*</span></label>

                                    <Select
                                      className="select"
                                      name="fac_weekly_visit"
                                      options={weeklyOptions}
                                      value={formData.fac_weekly_visit}
                                      onChange={(selected) => handleSelectChange(selected, 'fac_weekly_visit')}
                                      placeholder="Select"
                                      isClearable={true}
                                      isSearchable={true}
                                    />
                                    {formErrors.fac_weekly_visit && <div className="form-label text-danger m-1">{formErrors.fac_weekly_visit}</div>}
                                  </div>
                                </div>
                                {/* <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">EIN number <span className="text-danger">*</span></label>
                                    <input type="text" name="fac_ein_number" value={formData.fac_ein_number} onChange={handleInputChange} className="form-control" />
                                    {formErrors.fac_ein_number && <div className="form-label text-danger m-1">{formErrors.fac_ein_number}</div>}
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label">NPI number  <span className="text-danger">*</span></label>
                                    <input type="text" name="fac_npi" value={formData.fac_npi} onChange={handleInputChange} className="form-control" />
                                    {formErrors.fac_npi && <div className="form-label text-danger m-1">{formErrors.fac_npi}</div>}
                                  </div>
                                </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer">
                          <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                            <Link
                              to="#"
                              className="btn btn-md btn-dark prev_btns inline-flex align-items-center rounded-pill"
                              onClick={isLoading ? (e) => e.preventDefault() : handlePrev}
                              style={{ pointerEvents: isLoading ? 'none' : 'auto', opacity: isLoading ? 0.5 : 1 }}
                            >
                              <i className="isax isax-arrow-left-2 me-1" />
                              Back
                            </Link>
                            <input type='submit' value={ isLoading ? "Submitting...." : "Submit" } disabled={isLoading ? true:false}  className="btn btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill" />
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  )}
                </form>
                {currentStep === 4 && (
                  <fieldset style={{ display: 'block' }}>
                    <div className="card booking-card">
                      <div className="card-body pb-1">
                        <div className="login-content-info">
                          <div className="container">
                            {/* Login Phone */}
                            <div className="row justify-content-center">
                              <div className="col-lg-6 col-md-8">
                                <div className="account-content">
                                  <div className="account-info">
                                    <div className="login-verify-img">
                                      <i className="isax isax-tick-circle" />
                                    </div>
                                    <div className="login-title">
                                      <h3>Success</h3>
                                      <p>Facility has been successfully registered. Please check your registered email to activate your account</p>
                                    </div>
                                    <form>
                                      <div className="mb-3">
                                        <Link
                                          className="btn btn-primary-gradient w-100"
                                          to='/site-login'
                                        >
                                          Sign In
                                        </Link>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* /Login Phone */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Link to="#" className="" onClick={() => setCurrentStep(1)}>
                        <i className="isax isax-arrow-left-2 me-1" />
                        Back to Bookings
                      </Link>
                    </div>
                  </fieldset>
                )}
              </div>
              <div className="text-center">
                <p className="mb-0">
                  Copyright © {new Date().getFullYear()}. All Rights Reserved, AmplifyShift
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default FacilityRegistration