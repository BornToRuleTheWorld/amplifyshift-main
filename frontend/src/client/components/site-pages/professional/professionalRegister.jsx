import React, { useState, useEffect } from 'react'
// import ImageWithBasePath from '../../core/img/imagewithbasebath';
import { Link } from "react-router-dom"; 
import Select from "react-select";
import axios from "axios";
import SiteHeader from '../home/header'
import {AUTH_TOKEN, API_BASE_URL, fetchModules, workExperienceOptions, disciplineOptions, specialtyOptions, yearOptions, docOptions, langOptions, weeklyOptions, cntryOptions, stateOptions, ColourOption, SingleValue, MultiValueLabel } from '../config';
import { FaPlusSquare, FaMinusCircle, FaPlusCircle } from "react-icons/fa";

const ProfessionalRegistration = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDisabled,setIsDisabled] = useState(false)
    const [formErrors, setFormErrors] = useState({});

    const [docSoftOptions, setDocSoftOptions] = useState(docOptions)
    const [languageOptions, setLanguageOptions] = useState(langOptions)
    const [showAddLang, setShowAddLang] = useState(false);
    const [showAddDoc, setShowAddDoc] = useState(false);
    const [optionDatas, setOptionDatas] = useState(null);
    const[docSoft, setDocSoft]   = useState(null); 
    const[language, setLanguage] = useState(null);

    //contact 
    const [phoneArea, setPhoneArea] = useState(null)
    const [phonePrefix, setPhonePrefix] = useState(null)
    const [phoneLine, setPhoneLine] = useState(null)

    const [formData, setFormData] = useState({
      user:'',
      prof_first_name: '',
      prof_middle_name: '',
      prof_last_name: '',
      prof_email: '',
      prof_password: '',
      prof_confirm_password:'',
      prof_address: '',
      prof_address_2:'',
      prof_city:'',
      prof_state:'',
      prof_cntry: cntryOptions[0],
      prof_contact: '',
      prof_years_in: '',
      prof_zip_primary: '',
      prof_zip_secondary: '',
      prof_weekly_aval: '',
      prof_license: '',
      prof_lic_state: '',
      prof_npi: '',
      prof_ref_verify:'New',
      prof_status:"Waiting for Confirmation",
      prof_work_settings: [],
      prof_discipline: [],
      prof_langs: [],
      prof_doc_soft: [],
      prof_speciality: []
    });
  
    var userData = {
      username:formData.prof_email,
      first_name:formData.prof_first_name,
      last_name:formData.prof_last_name,
      email:formData.prof_email,
      password:formData.prof_password,
      group_name:'Professional',
      method:'create'
    }

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

    const validiteFormInputs = async(data) => {
      
      setFormErrors({})
      const errorObj = {};
      const emailRegx = /.+@.+\.[A-Za-z]+$/
      const phoneRegx = /\d/g

      if (currentStep === 1){
        if (data.prof_first_name == '') {
          errorObj.prof_first_name = "First name is required";
        }

        if (data.prof_last_name == '') {
          errorObj.prof_last_name = "Last name is required";
        }

        if (data.prof_email == '') {
          errorObj.prof_email = "Email is required";
        }

        if (data.prof_password == '') {
          errorObj.prof_password = "Password is required";
        }

        if (data.prof_confirm_password == '') {
          errorObj.prof_confirm_password = "Confirm password is required";
        }

        if ((data.prof_password != '') && (data.prof_confirm_password != '')) {
          if (JSON.stringify(data.prof_password) != JSON.stringify(data.prof_confirm_password)) {
              errorObj.prof_confirm_password = "Password and confirm password should be the same";
          }
        }

        if (data.prof_email != '') {
          if (!emailRegx.test(data.prof_email)) {
            errorObj.prof_email = "Invalid email";
          }else {         
            const emailResult = await validateEmail(data.prof_email)
            console.log('errorValidatedata',emailResult)
            if (emailResult) {
              errorObj.prof_email = emailResult;           
            }      
          }
        }

      }
      
      if (currentStep === 2){
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
      }

      
      if (currentStep === 3){
        // if (data.prof_ein_number == '') {
        //   errorObj.prof_ein_number = "EIN Number is required";
        // }

        if (data.prof_years_in == '') {
          errorObj.prof_years_in = "Please choose a years of work experience";
        }

        if (data.prof_weekly_aval == '') {
          errorObj.prof_weekly_aval = "Please choose an availability";
        }

       
        // if (data.prof_license == '') {
        //   errorObj.prof_license = "License is required";
        // }

        if (data.prof_lic_state == '') {
          errorObj.prof_lic_state = "License state is required";
        }

        // if (data.prof_npi == '') {
        //   errorObj.prof_npi = "NPI Number is required";
        // }
        
        if (data.prof_work_settings.length == 0) {
            errorObj.prof_work_settings = "Please choose atleast one work setting";
        }

        if (data.prof_discipline.length == 0) {
          errorObj.prof_discipline = "Please choose atleast one discipline";
        }

        if (data.prof_langs.length == 0) {
          errorObj.prof_langs = "Please choose atleast one language";
        }

        if (data.prof_doc_soft.length == 0) {
          errorObj.prof_doc_soft = "Please choose atleast one sotfware";
        }

        if (data.prof_speciality.length == 0) {
          errorObj.prof_speciality = "Please choose atleast one speciality";
        }
      }
      return errorObj
  }

    const handleNext = async() => {
      const errorValidate = await validiteFormInputs(formData)
      if(Object.keys(errorValidate).length === 0){
          setCurrentStep(currentStep + 1);
      }else{
        setFormErrors(errorValidate)
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

    const handleSubmit = async (e) => {
      e.preventDefault();
      setShowAddDoc(false);
      setShowAddLang(false);
      const formValidate = await validiteFormInputs(formData)
      if (Object.keys(formValidate).length === 0) {
        setIsLoading(true);
        setError(null);
        try {
          const user_response = await axios.post(`${API_BASE_URL}/GenerateUserOrLink/`, userData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': AUTH_TOKEN
            }
          });
          console.log("Professional auth user",user_response)
          const updatedFormData = { ...formData, user: user_response.data.Result.UserID, prof_contact:`${phoneArea}${phonePrefix}${phoneLine}`};
          try {
            
            const response = await axios.post(`${API_BASE_URL}/professional/createProf/`, updatedFormData, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_TOKEN
              }
            });
            console.log("Professional user",response)
            const professional = response.data.Email;
            localStorage.setItem('email', btoa(professional));
            handleNext();
          } catch (err) {
            console.error('Error:', err);
            setError(err.response.data.Result || 'An error occurred while submitting the form.');
          } finally {
            setIsLoading(false);
          }
    
        } catch (err) {
          console.error('Error:', err);
          setError(err.response.data.Result || 'An error occurred while submitting the form.');
        } finally {
          setIsLoading(false);
        }
      }else{
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
    
    console.log("formErrors",formErrors)

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
        return null
      } catch (err) {
        return err.response.data.Result;
      }
    }

    // useEffect(()=>{
    //   const validateEmail = async(email) => {
    //     const emailData = {
    //       Email: email
    //     }
    //     try {
    //       const response = await axios.post(`${API_BASE_URL}/ValidateEmail/`, emailData, {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'Authorization': AUTH_TOKEN
    //         }
    //       });
    //       if (response.status === 200){
    //         setIsDisabled(false)
    //         setFormErrors(prevState => ({
    //           ...prevState,
    //           prof_email:""
    //         }));
    //       }
    //     }catch(err){
    //       setIsDisabled(true)
    //       setFormErrors(prevState => ({
    //         ...prevState,
    //         prof_email:err.response.data.Result
    //       }));
    //     }
    //   }

    //   if (currentStep===1 && formData.prof_email){
    //     validateEmail(formData.prof_email)
    //   }
    // },[formData])
    
  
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
        setFormData(pre => ({
          ...pre,
          prof_doc_soft:[docValue]
        }))
        setShowAddDoc(false)
        setDocSoft(null)
      }
    },[docSoftOptions])
  
    useEffect(() => {
      if (optionDatas){
        const langValue = languageOptions.find(option => option.value === optionDatas.data.id)
        setFormData(pre => ({
          ...pre,
          prof_langs:[langValue]
        }))
        setShowAddLang(false)
        setLanguage(null)
      }
    },[languageOptions])

    console.log(formErrors)
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
                  <h3>Professional Registration</h3>
                  {error && <div className="form-label text-danger m-1">{error}</div>}
                </div>
                <div className="card-body booking-body">
                  <div className="card mb-0">
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">First Name <span className="text-danger">*</span></label>
                            <input type="text" name="prof_first_name" className="form-control" value={formData.prof_first_name} onChange={handleInputChange} />
                            {formErrors.prof_first_name && <div className="form-label text-danger m-1">{formErrors.prof_first_name}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Middle Name</label>
                            <input type="text" name="prof_middle_name" value={formData.prof_middle_name} onChange={handleInputChange} className="form-control" />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Last Name <span className="text-danger">*</span></label>
                            <input type="text" name="prof_last_name" value={formData.prof_last_name} onChange={handleInputChange} className="form-control" />
                            {formErrors.prof_last_name && <div className="form-label text-danger m-1">{formErrors.prof_last_name}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Email Address <span className="text-danger">*</span></label>
                            <input type="text" name="prof_email" value={formData.prof_email} onChange={handleInputChange} className="form-control" />
                            {formErrors.prof_email && <div className="form-label text-danger m-1">{formErrors.prof_email}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Password <span className="text-danger">*</span></label> 
                            <input type="password" name="prof_password" value={formData.prof_password} onChange={handleInputChange} className="form-control" />
                            {formErrors.prof_password && <div className="form-label text-danger m-1">{formErrors.prof_password}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
                            <input type="password" name="prof_confirm_password" value={formData.prof_confirm_password} onChange={handleInputChange} className="form-control"/>
                            {formErrors.prof_confirm_password && <div className="form-label text-danger m-1">{formErrors.prof_confirm_password}</div>}
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
                      //className="btn btn-md btn-dark inline-flex align-items-center rounded-pill"
                    >
                      {/* <i className="isax isax-arrow-left-2 me-1" />
                      Back */}
                    </Link>
                    <Link
                      to="#"
                      className="btn btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                      onClick={isDisabled ? (e) => e.preventDefault() : handleNext}
                      style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.5 : 1 }}
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
            <fieldset style={{display:'block'}}>
              <div className="card booking-card mb-0">
                <div className="card-header">
                  <h3>Professional Registration</h3>
                </div>
                <div className="card-body booking-body">
                  <div className="card mb-0">
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Address <span className="text-danger">*</span></label>
                            <input type="text" name="prof_address" value={formData.prof_address} onChange={handleInputChange} className="form-control" />
                            {formErrors.prof_address && <div className="form-label text-danger m-1">{formErrors.prof_address}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Address 2</label>
                            <input type="text" name="prof_address_2" value={formData.prof_address_2} onChange={handleInputChange} className="form-control" />
                            {formErrors.prof_address_2 && <div className="form-label text-danger m-1">{formErrors.prof_address_2}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">City <span className="text-danger">*</span></label>
                            <input type="text" name="prof_city" value={formData.prof_city} onChange={handleInputChange} className="form-control"/>
                            {formErrors.prof_city && <div className="form-label text-danger m-1">{formErrors.prof_city}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Select State <span className="text-danger">*</span></label>
                            
                            <Select
                              className="select"
                              name="prof_state"
                              options={stateOptions}
                              value={formData.prof_state}
                              onChange={(selected) => handleSelectChange(selected, 'prof_state')}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            {formErrors.prof_state && <div className="form-label text-danger m-1">{formErrors.prof_state}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Select Country <span className="text-danger">*</span></label>
                            
                            <Select
                              className="select"
                              name="prof_cntry"
                              options={cntryOptions}
                              value={cntryOptions[0]}
                              //onChange={(selected) => handleSelectChange(selected, 'prof_cntry')}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                              isDisabled={true}
                            />
                            {formErrors.prof_cntry && <div className="form-label text-danger m-1">{formErrors.prof_cntry}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Primary Zipcode <span className="text-danger">*</span></label>
                            <input type="text" name="prof_zip_primary" value={formData.prof_zip_primary} onChange={handleInputChange} className="form-control" />
                            {formErrors.prof_zip_primary && <div className="form-label text-danger m-1">{formErrors.prof_zip_primary}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Secondary Zipcode</label>
                            <input type="text" name="prof_zip_secondary" value={formData.prof_zip_secondary} onChange={handleInputChange} className="form-control"/>
                          </div>
                        </div>
                        {/* <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Contact <span className="text-danger">*</span></label>
                            <input type="text" name="prof_contact" value={formData.prof_contact} onChange={handleInputChange}className="form-control" />
                            {formErrors.prof_contact && <div className="form-label text-danger m-1">{formErrors.prof_contact}</div>}
                          </div>
                        </div> */}
                        <div className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                 Contact 
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
                                {formErrors.prof_contact && <div className="form-label text-danger m-1">{formErrors.prof_contact}</div>}
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
            <fieldset style={{display:'block'}}>
              <div className="card booking-card mb-0">
                <div className="card-header">
                  <h3>Professional Registration</h3>
                </div>
                <div className="card-body booking-body">
                  <div className="card mb-0">
                    <div className="card-body pb-1">
                      <div className="row">
                        
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Discipline <span className="text-danger">*</span></label>
                            
                            <Select
                              className="select"
                              isMulti
                              name="prof_discipline"
                              options={disciplineOptions}
                              value={formData.prof_discipline}
                              onChange={(selected) => handleSelectChange(selected, 'prof_discipline')}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                              components={{ Option : ColourOption, SingleValue, MultiValueLabel }}
                            />
                            {formErrors.prof_discipline && <div className="form-label text-danger m-1">{formErrors.prof_discipline}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Years of Work Experience <span className="text-danger">*</span></label>
                            
                            <Select
                              className="select"
                              name="prof_years_in"
                              options={yearOptions}
                              value={formData.prof_years_in}
                              onChange={(selected) => handleSelectChange(selected, 'prof_years_in')}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            {formErrors.prof_years_in && <div className="form-label text-danger m-1">{formErrors.prof_years_in}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Work Setting Experience <span className="text-danger">*</span></label>
                            
                            <Select
                              className="select"
                              isMulti
                              name="prof_work_settings"
                              options={workExperienceOptions}
                              value={formData.prof_work_settings}
                              onChange={(selected) => handleSelectChange(selected, 'prof_work_settings')}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            {formErrors.prof_work_settings && <div className="form-label text-danger m-1">{formErrors.prof_work_settings}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Specialty <span className="text-danger">*</span></label>
                            
                            <Select
                              className="select"
                              isMulti
                              name="prof_speciality"
                              options={specialtyOptions}
                              value={formData.prof_speciality}
                              onChange={(selected) => handleSelectChange(selected, 'prof_speciality')}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            {formErrors.prof_speciality && <div className="form-label text-danger m-1">{formErrors.prof_speciality}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Documentation software <span className="text-danger">*</span></label>
                            {showAddDoc ?
                            <>
                              <input type="text" name="prof_doc_soft" value={docSoft} onChange={(e) => setDocSoft(e.target.value)} className="form-control" />
                              <FaPlusCircle className='text-success' onClick={() => quickAdd('docSoft')}/>
                              <FaMinusCircle className='text-danger' onClick={() => handleDocDisplay(false)}/>
                            </>
                            :
                            <>
                              <Select
                                isMulti
                                className="select"
                                name="prof_doc_soft"
                                options={docSoftOptions}
                                value={formData.prof_doc_soft}
                                onChange={(selected) => handleSelectChange(selected, 'prof_doc_soft')}
                                placeholder="Select"
                                isClearable={true}
                                isSearchable={true}
                              />
                              <FaPlusSquare className='text-success' onClick={() => handleDocDisplay(true)}/>
                            </>
                            
                            }
                            {formErrors.prof_doc_soft && <div className="form-label text-danger m-1">{formErrors.prof_doc_soft}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Languages <span className="text-danger">*</span></label>
                            
                            {showAddLang ?
                            <>
                              <input type="text" name="prof_langs" value={language} onChange={(e) => setLanguage(e.target.value)} className="form-control"/>
                              <FaPlusCircle className='text-success' onClick={() => quickAdd('language')}/>
                              <FaMinusCircle className='text-danger' onClick={() => handleLangDisplay(false)}/>
                            </>
                            :
                            <>
                              <Select
                                isMulti
                                className="select"
                                name="prof_langs"
                                options={languageOptions}
                                value={formData.prof_langs}
                                onChange={(selected) => handleSelectChange(selected, 'prof_langs')}
                                placeholder="Select"
                                isClearable={true}
                                isSearchable={true}
                              />
                              <FaPlusSquare className='text-success' onClick={() => handleLangDisplay(true)}/>
                            </>
                            }
                            {formErrors.prof_langs && <div className="form-label text-danger m-1">{formErrors.prof_langs}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Weekly availability <span className="text-danger">*</span></label>
                            
                            <Select
                              className="select"
                              name="prof_weekly_aval"
                              options={weeklyOptions}
                              value={formData.prof_weekly_aval}
                              onChange={(selected) => handleSelectChange(selected, 'prof_weekly_aval')}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            {formErrors.prof_weekly_aval && <div className="form-label text-danger m-1">{formErrors.prof_weekly_aval}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label"> Professional License- Discipline <span className="text-danger">*</span></label>
                            <input type="text" name="prof_license" value={formData.prof_license} onChange={handleInputChange} className="form-control" />
                            {formErrors.prof_license && <div className="form-label text-danger m-1">{formErrors.prof_license}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label"> Professional License-State  <span className="text-danger">*</span></label>
                            {/* <input type="text" name="prof_lic_state" value={formData.prof_lic_state} onChange={handleInputChange} className="form-control" /> */}
                            <Select
                              className="select"
                              name="prof_lic_state"
                              options={stateOptions}
                              value={formData.prof_lic_state ? stateOptions.find(option => option.value == formData.prof_lic_state):null}
                              onChange={(selected) => setFormData({...formData, prof_lic_state: selected ? selected.value : null})}
                              // value={formData.prof_lic_state}
                              // onChange={(selected) => handleSelectChange(selected, 'prof_lic_state')}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            {formErrors.prof_lic_state && <div className="form-label text-danger m-1">{formErrors.prof_lic_state}</div>}
                          </div>
                        </div>
                        {/* <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">EIN number <span className="text-danger">*</span></label>
                            <input type="text"  name="prof_ein_number" value={formData.prof_ein_number} onChange={handleInputChange} className="form-control" />
                            {formErrors.prof_ein_number && <div className="form-label text-danger m-1">{formErrors.prof_ein_number}</div>}
                          </div>
                        </div> */}
                        {/* <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">NPI number  <span className="text-danger">*</span></label>
                            <input type="text" name="prof_npi" value={formData.prof_npi} onChange={handleInputChange} className="form-control"/>
                            {formErrors.prof_npi && <div className="form-label text-danger m-1">{formErrors.prof_npi}</div>}
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
                    <input type='submit' value={ isLoading ? "Submitting...." : "Submit" } disabled={isLoading ? true : false} className="btn btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"/>
                  </div>
                </div>
              </div>
            </fieldset>
        )}
        </form> 
            {currentStep === 4 && (
            <fieldset style={{display:'block'}}>
              <div className="card booking-card">
                <div className="card-body booking-body pb-1">
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
                                    <p>Professional has been successfully registered. Please check your registered email to activate your account.</p>
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
                <Link to="#" className="" onClick={()=>setCurrentStep(1)}>
                  <i className="isax isax-arrow-left-2 me-1" />
                  Back to first
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

export default ProfessionalRegistration