import React, { useState, useEffect } from "react";
// import DashboardSidebar from "../sidebar/sidebar.jsx";
import DashboardSidebar from "../../../patients/dashboard/sidebar/sidebar.jsx";
// import IMG01 from "../../../../assets/images/patient.jpg";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import SiteFooter from "../../home/footer.jsx";
import SiteHeader from "../../home/header.jsx";
// import Header from "./header.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";import Select from "react-select";
import ImageWithBasePath from "../../../../../core/img/imagewithbasebath.jsx";
//import ImageWithBasePath from "../../core/img/imagewithbasebath.jsx";
import ProfessionalNav from "./ProfessionalNav.jsx";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN, cntryOptions, stateOptions } from "../../config";
import MessagePopup from "../../messagePopup.js";
import moment from 'moment';
import ProfessionalSidebar from "./ProfessionalSidebar.jsx";
import { convertToUS } from "../../utils.js";

const ProfessionalHistory = (props) => {

    const [show, setShow] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('name');

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

    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [updateForm, setUpdateForm] = useState(null);
    const currentUserID = atob(localStorage.getItem('RecordID')) || "";
    const [formErrors, setFormErrors] = useState({});

    //history
    const [phoneArea, setPhoneArea] = useState('')
    const [phonePrefix, setPhonePrefix] = useState('')
    const [phoneLine, setPhoneLine] = useState('')

    const [formData, setFormData] = useState({
        professional: currentUserID,
        company_name: "",
        from_date: "",
        to_date: "",
        supervisor_name:"",
        address_1: "",
        address_2: "",
        city: "",
        state:"",
        country:"",
        zipcode:"",
        contact:"",
        pay:"",
        position_duties:"",
        resign_reason:""
    });

    useEffect(() => {
        if (updateForm) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                ...updateForm,
            }));

            setPhoneArea(updateForm.contact.slice(0,3))
            setPhonePrefix(updateForm.contact.slice(3,6))
            setPhoneLine(updateForm.contact.slice(6,10))
        }
    }, [updateForm]);

    console.log(formData)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCancel = () => {
        setFormData({
            professional: currentUserID,
            company_name: "",
            from_date: "",
            to_date: "",
            supervisor_name:"",
            address_1: "",
            address_2: "",
            city: "",
            state:"",
            country:"",
            zipcode:"",
            contact:"",
            pay:"",
            position_duties:"",
            resign_reason:""
            
        });
        setPhoneArea('');
        setPhonePrefix('');
        setPhoneLine('');
       
        setUpdateForm(null);
        setFormErrors({});
        setError(null);
        setSuccess(null);
        
    };

    const validiteFormInputs = (data) => {
      
        const errorObj = {};
        const emailRegx = /.+@.+\.[A-Za-z]+$/
        const phoneRegx = /\d/g
        
        if (Object.keys(data).length !== 0){
            if (data.company_name == '') {
                errorObj.company_name = "Company name is required";
            }

            if (data.from_date == '') {
                errorObj.from_date = "From date is required";
            }

            if (data.to_date == '') {
                errorObj.to_date = "To date is required";
            }
            
            if (data.supervisor_name == '') {
                errorObj.supervisor_name = "Supervisor name is required";
            }

            if (data.address_1 == '' || data.city == null) {
                errorObj.address_1 = "Address is required";
            }

            if (data.city == '' || data.city == null) {
                errorObj.city = "City is required";
            }
            if (data.state == '' || data.state == null) {
                errorObj.state = "State is required";
            }
            if (data.country == '' || data.country == null) {
                errorObj.country = "Country is required";
            }
            if (data.zipcode === '') {
                errorObj.zipcode = "Zipcode is required";
            }else if(!Number.isInteger(parseInt(data.zipcode))){
                errorObj.zipcode = "Not a valid zipcode";
            }

            if (phoneArea == '' || phonePrefix == '' || phoneLine == '') {
                errorObj.phone_number = "Phone number is required";
            }else if(phoneArea.length < 3 || phonePrefix.length < 3 || phoneLine.length < 4 ){
                errorObj.phone_number = "Invalid phone number";
            }
            else{
                if (!Number.isInteger(parseInt(phoneArea)) || !Number.isInteger(parseInt(phonePrefix)) || !Number.isInteger(parseInt(phoneLine))) {
                    errorObj.phone_number = "Invalid phone number";
                }
            }

            if (data.pay == '') {
                errorObj.pay = "Pay is required";
            }

            if (data.position_duties == '') {
                errorObj.position_duties = "Position_title/Duties is required";
            }

            if (data.resign_reason == '') {
                errorObj.resign_reason = "Please mention the reason for resigination";
            }

        }
        return errorObj
    }

     {/* Contract Add and Update */}
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setFormErrors({})
        const formValidate = validiteFormInputs(formData)
        if (Object.keys(formValidate).length === 0) {
            setIsLoading(true);
            setError(null);

            try {
                const updatedFormData = { ...formData, 
                                    contact:`${phoneArea}${phonePrefix}${phoneLine}`, 
                                    from_date : moment(formData.from_date).format('YYYY-MM-DD'),
                                    to_date : moment(formData.to_date).format('YYYY-MM-DD')    
                                };

                //for create    
                let url = `${API_BASE_URL}/professional/history/`;
                let method = "POST";

                //for update
                if (updateForm) {
                    url = `${API_BASE_URL}/professional/history/${updateForm.id}/`;
                    method = "PATCH";
                }

                await axios({
                    method: method,
                    url: url,
                    data: updatedFormData,
                    headers: { 
                        "Content-Type": "application/json",
                        'Authorization': AUTH_TOKEN
                    }
                });
                handleCancel();
                fetchHistory();
                method === "PATCH" ? setSuccess("History updated successfully") : setSuccess("History created successfully")
            } catch (err) {
                console.log(err)
                setError(err.response?.data?.detail || "An error occurred");
            } finally {
                setIsLoading(false);
            }
        }else{
            setFormErrors(formValidate)
            return false;
        }
    };


    {/* Contract List */}
    const fetchHistory = async () => {
        setError(null);
        setSuccess(null)
        setFormErrors({})
        try {
            const response = await axios.get(`${API_BASE_URL}/professional/history/?ProfID=${currentUserID}`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                 },
            });
            setHistory(response.data);
        } catch (err) {
            setError(err.response?.data?.Result || "An error occurred");
        }
    };

    const deleteHistory = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        handleShow()
        setDeleteID(id)
    };

    const updateHistory = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        const historyToUpdate = history.find((con) => con.id === id);
        setUpdateForm(historyToUpdate)
    }

    const removeHistory = async(id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        try {
            await axios.delete(`${API_BASE_URL}/professional/history/${id}/`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            setHistory(history.filter((license) => license.id !== id));
            setSuccess("history deleted successfully")
        } catch (err) {
            setError(err.response?.data?.Result || "Error deleting license");
        }finally{
            setDeletePopup(false)
        }
    }

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        if(deletePopup){
            removeHistory(deleteID);
        }
    }, [deletePopup]);
    
    const handleSort = (field) => {
        let newSortOrder = 'asc';
        if (sortField === field && sortOrder === 'asc') {
          newSortOrder = 'desc';
        }
        setSortOrder(newSortOrder);
        setSortField(field);
    
        const sortedData = [...history].sort((a, b) => {
          if (field === 'company_name' || field === 'supervisor_name' ) {
            const nameA = a[field].toLowerCase();
            const nameB = b[field].toLowerCase();
            if (nameA < nameB) return newSortOrder === 'asc' ? -1 : 1;
            if (nameA > nameB) return newSortOrder === 'asc' ? 1 : -1;
            return 0;
          }else if (field === 'from_date' || field === 'to_date') {
            const dateA = new Date(a[field]);
            const dateB = new Date(b[field]);
            return newSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
          }
          return 0;
        });
    
        setHistory(sortedData);
      };
      console.log("history data",formData)
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
                                    <h2 className="breadcrumb-title">Employment History</h2>
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
                                            {/* <div className="pb-3 mb-3">
                                                <h5>Employment History</h5>
                                            </div> */}
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
                                            <form onSubmit={handleSubmit}>
                                                <div className="setting-card">
                                                    <div className="row">
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Company Name <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="company_name"
                                                                    className="form-control"
                                                                    value={formData.company_name}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter company name"
                                                                />
                                                                {formErrors.company_name && <div className="form-label text-danger m-1">{formErrors.company_name}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="form-wrap">
                                                            <label className="form-label">
                                                            From Date&nbsp;<span className="text-danger">*</span>
                                                            </label>
                                                            <div className="form-icon">
                                                            <DatePicker
                                                            className="form-control datetimepicker"
                                                            name="start_date"
                                                            selected={formData.from_date}
                                                            onChange={(date) => setFormData({ ...formData, from_date:date })}
                                                            dateFormat="MM/dd/yyyy"
                                                            showDayMonthYearPicker
                                                            autoComplete='off'
                                                            />
                                                                <span className="icon">
                                                                <i className="fa-regular fa-calendar-days" />
                                                                </span>
                                                            </div>
                                                            {formErrors.from_date && <div className="form-label text-danger m-1">{formErrors.from_date}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="form-wrap">
                                                            <label className="form-label">
                                                            To Date&nbsp;<span className="text-danger">*</span>
                                                            </label>
                                                            <div className="form-icon">
                                                            <DatePicker
                                                            className="form-control datetimepicker"
                                                            name="start_date"
                                                            selected={formData.to_date}
                                                            onChange={(date) => setFormData({ ...formData, to_date:date })}
                                                            dateFormat="MM/dd/yyyy"
                                                            showDayMonthYearPicker
                                                            autoComplete='off'
                                                            />
                                                                <span className="icon">
                                                                <i className="fa-regular fa-calendar-days" />
                                                                </span>
                                                            </div>
                                                            {formErrors.to_date && <div className="form-label text-danger m-1">{formErrors.to_date}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                Supervisor Name <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="supervisor_name"
                                                                    className="form-control"
                                                                    value={formData.supervisor_name}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter supervisor name"
                                                                />
                                                                {formErrors.supervisor_name && <div className="form-label text-danger m-1">{formErrors.supervisor_name}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Address <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="address_1"
                                                                    className="form-control"
                                                                    value={formData.address_1}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter address"
                                                                />
                                                                {formErrors.address_1 && <div className="form-label text-danger m-1">{formErrors.address_1}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Address 2
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="address_2"
                                                                    className="form-control"
                                                                    value={formData.address_2}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter address 2"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    City <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="city"
                                                                    className="form-control"
                                                                    value={formData.city}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter city"
                                                                />
                                                                {formErrors.city && <div className="form-label text-danger m-1">{formErrors.city}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    State <span className="text-danger">*</span>
                                                                </label>
                                                                <Select
                                                                    name="state"
                                                                    options={stateOptions}
                                                                    value={ formData.state ? stateOptions.find(option => option.value == formData.state) : null}
                                                                    onChange={(selected) => setFormData({...formData,state: selected.value})}
                                                                    placeholder="Select"
                                                                    isClearable={true}
                                                                    isSearchable={true}
                                                                />
                                                                {formErrors.state && <div className="form-label text-danger m-1">{formErrors.state}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Country <span className="text-danger">*</span>
                                                                </label>
                                                                <Select
                                                                    name="country"
                                                                    options={cntryOptions}
                                                                    value={ formData.country ? cntryOptions.find(option => option.value == formData.country) : null}
                                                                    onChange={(selected) => setFormData({...formData, country: selected.value})}
                                                                    placeholder="Select"
                                                                    isClearable={true}
                                                                    isSearchable={true}
                                                                />
                                                                {formErrors.country && <div className="form-label text-danger m-1">{formErrors.country}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Zipcode <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="zipcode"
                                                                    className="form-control"
                                                                    value={formData.zipcode}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter zipcode"
                                                                />
                                                                {formErrors.zipcode && <div className="form-label text-danger m-1">{formErrors.zipcode}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Contact <span className="text-danger">*</span>
                                                                </label>
                                                                <div className="row g-2">
                                                                    <div className="col-4">
                                                                        <input
                                                                            type="text"
                                                                            maxLength={3}
                                                                            name="history_phone_area"
                                                                            value={phoneArea}
                                                                            onChange={(e) => setPhoneArea(e.target.value)}
                                                                            className="form-control"
                                                                        />
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <input
                                                                            type="text"
                                                                            maxLength={3}
                                                                            name="history_phone_prefix"
                                                                            value={phonePrefix}
                                                                            onChange={(e) => setPhonePrefix(e.target.value)}
                                                                            className="form-control"
                                                                        />
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <input
                                                                            type="text"
                                                                            maxLength={4}
                                                                            name="history_phone_line"
                                                                            value={phoneLine}
                                                                            onChange={(e) => setPhoneLine(e.target.value)}
                                                                            className="form-control"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {formErrors.phone_number && <div className="form-label text-danger m-1">{formErrors.phone_number}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Pay <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="pay"
                                                                    className="form-control"
                                                                    value={formData.pay}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter Pay"
                                                                />
                                                                {formErrors.pay && <div className="form-label text-danger m-1">{formErrors.pay}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Position title/Duties <span className="text-danger">*</span>
                                                                </label>
                                                                <textarea
                                                                    name="position_duties"
                                                                    className="form-control"
                                                                    value={formData.position_duties}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter Duties"
                                                                    rows="4"
                                                                />
                                                                {formErrors.position_duties && <div className="form-label text-danger m-1">{formErrors.position_duties}</div>}
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Reason for resignation <span className="text-danger">*</span>
                                                                </label>
                                                                <textarea
                                                                    name="resign_reason"
                                                                    className="form-control"
                                                                    value={formData.resign_reason}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter reason"
                                                                    rows="4" 
                                                                />
                                                                {formErrors.resign_reason && <div className="form-label text-danger m-1">{formErrors.resign_reason}</div>}
                                                            </div>
                                                        </div>

                                                        
                                                    </div>
                                                </div>

                                                <div className="modal-btn text-end">
                                                    <Link to="#" className="btn btn-md btn-light rounded-pill" onClick={handleCancel}>
                                                        Cancel
                                                    </Link>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-md btn-primary-gradient rounded-pill"
                                                        disabled = {isLoading ? true : false}
                                                    >
                                                    {isLoading ?
                                                        <> 
                                                            <div class="spinner-border spinner-border-sm text-light col-1 mt-1" role="status">
                                                                <span class="sr-only">Submitting.....</span>
                                                            </div>
                                                            <span className="col text-light text-start p-1">Submitting.....</span>
                                                        </>
                                                                
                                                    : updateForm ? "Save Changes" : "Submit"}
                                                    </button>
                                                </div>


                                                {/* Medical Records Tab */}
                                                <div className="">
                                                    <div className="search-header">
                                                        {/* <div className="search-field">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Search"
                                                            />
                                                            <span className="search-icon">
                                                                <i className="fa-solid fa-magnifying-glass" />
                                                            </span>
                                                        </div> */}

                                                    </div>
                                                    
                                                        <div className="table-responsive mt-4">
                                                            <table className="table table-center mb-0 table-striped table-hover">   
                                                                <thead className="bg-primary text-white">
                                                                    <tr className="bg-primary text-white">
                                                                        <th onClick={() => handleSort('company_name')} style={{ cursor: "pointer" }} className="bg-primary text-white">Company Name {sortOrder === 'asc' ? '↑' : '↓'}</th>
                                                                        <th onClick={() => handleSort('from_date')} style={{ cursor: "pointer" }} className="bg-primary text-white">From Date</th>
                                                                        <th onClick={() => handleSort('to_date')} style={{ cursor: "pointer" }} className="bg-primary text-white">To Date</th>
                                                                        <th onClick={() => handleSort('supervisor_name')} style={{ cursor: "pointer" }} className="bg-primary text-white">Supervisor Name</th>
                                                                        <th className="bg-primary text-white">Contact</th>
                                                                        <th className="bg-primary text-white">Pay($)</th>
                                                                        <th className="bg-primary text-white">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {history.length === 0 ?
                                                                        <tr><td colSpan={7}>No history data found for this professional</td></tr>
                                                                    :
                                                                    history.map((history) => (
                                                                        <tr key={history.id}>
                                                                            <td>{history.company_name}</td>
                                                                            <td>{convertToUS(history.from_date,'Date')}</td>
                                                                            <td>{convertToUS(history.to_date,'Date')}</td>
                                                                            <td>{history.supervisor_name}</td>
                                                                            <td>{`(${history.contact.slice(0,3)})`}-{history.contact.slice(3,6)}-{history.contact.slice(6,10)}</td>
                                                                            <td>{history.pay}</td>
                                                                            <td>
                                                                                <div className="action-item">
                                                                                    <Link to="#" onClick={() => updateHistory(history.id)}>
                                                                                        <i className="isax isax-edit-2" />
                                                                                    </Link>
                                                                                    
                                                                                    <Link to="#" onClick={() => deleteHistory(history.id)}>
                                                                                        <i className="isax isax-trash" />
                                                                                    </Link>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                </div>
                                                {/* /Medical Records Tab */}

                                            </form>
                                        </div>
                                    </div>
                        </div>
                    </div>
                </div>
            </div>
            <MessagePopup title={"Employment History"} message={"Are you sure to delete the history"} close={handleClose} show={show} yes={handleYes} no={handleNo}/>
            <SiteFooter />
        </div>
    );
};

export default ProfessionalHistory;
