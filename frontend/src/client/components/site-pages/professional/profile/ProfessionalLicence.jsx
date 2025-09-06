import React, { useState, useEffect } from "react";
// import DashboardSidebar from "../sidebar/sidebar.jsx";
import DashboardSidebar from "../../../patients/dashboard/sidebar/sidebar.jsx";
// import IMG01 from "../../../../assets/images/patient.jpg";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import SiteFooter from "../../home/footer.jsx";
import SiteHeader from "../../home/header.jsx";
// import Header from "./header.jsx";
// import { DatePicker } from "antd";
import Select from "react-select";
import ImageWithBasePath from "../../../../../core/img/imagewithbasebath.jsx";
//import ImageWithBasePath from "../../core/img/imagewithbasebath.jsx";
import ProfessionalNav from "./ProfessionalNav.jsx";
import { API_BASE_URL, AUTH_TOKEN, disciplineOptions,ColourOption, SingleValue } from "../../config";
import { FaTimesCircle, FaPen } from "react-icons/fa";
import axios from "axios";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import convertUrlToFile from "../../convertToFile";
import MessagePopup from "../../messagePopup.js";
import { convertToUS } from "../../utils.js";
import ProfessionalSidebar from "./ProfessionalSidebar.jsx";
import { options } from "@fullcalendar/core/preact.js";

const ProfessionalLicense = (props) => {

    const [show, setShow] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('license_name');
    
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

    const [licenses, setLicenses] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const currentUserID = atob(localStorage.getItem('RecordID')) || ""
    const prof_id = atob(localStorage.getItem('RecordID')) || "";
    const [isLoading, setIsLoading] = useState(false);
    const [updateForm, setUpdateForm] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const LicStatus = [
        {value:"Inactive", label:"Inactive"},
        {value:"Active", label:"Active"}
    ]

    {/* License add and update */}
    const [formData, setFormData] = useState({
        professional: prof_id,
        discipline: "",
        license_name: "",
        license_number: "",
        city: "",
        state: "",
        expired_on: "",
        status:"",
        license_file: null,
    });

    useEffect(() => {
        if (updateForm) {
            setFormData({
                ...updateForm,
                certificate_date: updateForm.certificate_date?.split('T')[0] || "",
            });
        }
    }, [updateForm]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        console.log(e.target.files)
        setFormData({
            ...formData,
            license_file: e.target.files[0],
        });
    };

    const handleCancel = () => {
        setFormData({
            professional: prof_id,
            discipline : "",
            license_name: "",
            license_number: "",
            city: "",
            state: "",
            expired_on: "",
            license_file: null,
            status:""
        });
        setUpdateForm(null);
        setFormErrors({});
        setError(null);
        setSuccess(null);
        
        const fileInput = document.querySelector('input[name="license_file"]');
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const validiteFormInputs = (data) => {
      
        const errorObj = {};
        const emailRegx = /.+@.+\.[A-Za-z]+$/
        const phoneRegx = /\d/g
        if (Object.keys(data).length !== 0){
          if (data.discipline == '') {
            errorObj.discipline = "Discipline is required";
          }
  
          if (data.state == '') {
            errorObj.state = "State is required";
          }

          if (data.expired_on == '') {
            errorObj.expired_on = "Expire date is required";
          }
  
          if (data.license_number == '') {
            errorObj.license_number = "License number is required";
          }
  
          if (data.license_file === null) {
            errorObj.license_file = "File is required";
          }

          if (data.status === null || data.status === "") {
            errorObj.status = "Status is required";
          }
        }
        return errorObj
    }
    
    {/* License add and update */}
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setFormErrors({})
        const formValidate = validiteFormInputs(formData)
        if (Object.keys(formValidate).length === 0) {
            setIsLoading(true);

            try {
                const formDataObj = new FormData();
                for (const key in formData) {
                    if (key === "license_file" && formData[key] && typeof formData[key] === 'string') {
                        const file_name = formData[key].split('/').pop()
                        const file = await convertUrlToFile(formData[key], file_name);
                        formDataObj.append(key, file);
                    } else {
                        if (formData[key] === 'null' || formData[key] === null) {
                            formDataObj.append(key, '');
                        } else {
                            formDataObj.append(key, formData[key]);
                        }
                    }
                }

                //for create    
                let url = `${API_BASE_URL}/professional/CreateLicense/`;
                let method = "POST";

                //for update
                if (updateForm) {
                    url = `${API_BASE_URL}/professional/licenses/${updateForm.id}/`;
                    method = "PUT";
                }

                await axios({
                    method: method,
                    url: url,
                    data: formDataObj,
                    headers: { 
                        "Content-Type": "multipart/form-data",
                        'Authorization': AUTH_TOKEN
                    }
                });
                handleCancel();
                fetchLicenses();
                method === "PUT" ? setSuccess("License updated successfully") : setSuccess("License created successfully") 
            } catch (err) {
                console.log(err)
                setError(err.response?.data?.Result || "An error occurred");
            } finally {
                setIsLoading(false);
            }
        }else{
            setFormErrors(formValidate)
            return false;
        }
    };
    {/* License add and update */}

    {/*License list */}
    const fetchLicenses = async () => {
        setError(null)
        setSuccess(null)
        setFormErrors({})
        try {
            const response = await axios.get(`${API_BASE_URL}/professional/licenses/?ProfID=${currentUserID}`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                 },
            });
            setLicenses(response.data);
        } catch (err) {
            setError(err.response?.data?.Result || "An error occurred");
        }
    };

    const deleteLicense = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        handleShow()
        setDeleteID(id)
    };

    const removeLicense = async(id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        try {
            await axios.delete(`${API_BASE_URL}/professional/licenses/${id}/`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            setLicenses(licenses.filter((license) => license.id !== id));
            setSuccess("License deleted successfully")
        } catch (err) {
            setError(err.response?.data?.Result || "Error deleting license");
        }finally{
            setDeletePopup(false)
        }
    }
    const updateLicenses = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        const licenseToUpdate = licenses.find((license) => license.id === id);
        setUpdateForm(licenseToUpdate)
    }

    useEffect(() => {
        fetchLicenses();
    }, []);

    useEffect(() => {
        if(deletePopup){
            removeLicense(deleteID);
        }
    }, [deletePopup]);
    
    const handleSort = (field) => {
        let newSortOrder = 'asc';
        if (sortField === field && sortOrder === 'asc') {
          newSortOrder = 'desc';
        }
        setSortOrder(newSortOrder);
        setSortField(field);
    
        const sortedData = [...licenses].sort((a, b) => {
          if (field === 'license_name' || field === 'city' || field === 'state' ) {
            const nameA = a[field].toLowerCase();
            const nameB = b[field].toLowerCase();
            if (nameA < nameB) return newSortOrder === 'asc' ? -1 : 1;
            if (nameA > nameB) return newSortOrder === 'asc' ? 1 : -1;
            return 0;
          }
          return 0;
        });
    
        setLicenses(sortedData);
      };
    
      console.log("formErrors",formErrors)
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
                                    <h2 className="breadcrumb-title">License</h2>
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
                                            <div className="border-bottom pb-3 mb-3">
                                                <div className="form-label text-muted"><span className="text-danger">*</span>&nbsp;Make multiple entries to add all Active and Past Professional Licenses</div>
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
                                            <form onSubmit={handleSubmit}>
                                                <div className="setting-card">
                                                    <div className="row">
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">Select Discipline <span className="text-danger">*</span></label>
                                                                
                                                                <Select
                                                                className="select"
                                                                name = "discipline"
                                                                options={disciplineOptions}
                                                                value={formData.discipline ? disciplineOptions.find(option => option.value == formData.discipline) : null}
                                                                onChange={(selected) => setFormData({...formData, discipline: selected.value})}
                                                                placeholder="Select"
                                                                isClearable={true}
                                                                isSearchable={true}
                                                                components={{ Option : ColourOption, SingleValue}}
                                                                />
                                                                {formErrors.discipline && <div className="form-label text-danger m-1">{formErrors.discipline}</div>}
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Licence Name <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="license_name"
                                                                    className="form-control" 
                                                                    value={formData.license_name}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter license name"
                                                                />
                                                                {formErrors.license_name && <div className="form-label text-danger m-1">{formErrors.license_name}</div>}
                                                            </div>
                                                        </div> */}
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Licence Number <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="license_number"
                                                                    className="form-control" 
                                                                    value={formData.license_number}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter license number"
                                                                />
                                                                {formErrors.license_number && <div className="form-label text-danger m-1">{formErrors.license_number}</div>}
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-lg-4 col-md-6">
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
                                                        </div> */}
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    State <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="state"
                                                                    className="form-control"
                                                                    value={formData.state}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter state"
                                                                />
                                                                {formErrors.state && <div className="form-label text-danger m-1">{formErrors.state}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="form-wrap">
                                                                <label className="col-form-label">
                                                                    Expire Date <span className="text-danger">*</span>
                                                                </label>
                                                            <div className="form-icon">
                                                                <DatePicker
                                                                    className="form-control datetimepicker"
                                                                    name="expired_on"
                                                                    selected={formData.expired_on} 
                                                                    onChange={(date) =>setFormData({ ...formData, expired_on : date.toISOString().split('T')[0]})}
                                                                    dateFormat="MM/dd/yyyy"
                                                                    placeholderText="MM:DD:YYY"
                                                                    showDayMonthYearPicker
                                                                    autoComplete="off"
                                                                />
                                                                <span className="icon">
                                                                <i className="fa-regular fa-calendar-days" />
                                                                </span>
                                                            </div>
                                                            {formErrors.expired_on && <div className="form-label text-danger m-1">{formErrors.expired_on}</div>}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">Select Status <span className="text-danger">*</span></label>
                                                                
                                                                <Select
                                                                className="select"
                                                                name = "status"
                                                                options={LicStatus}
                                                                value={formData.status ? LicStatus.find(option => option.value == formData.status) : null}
                                                                onChange={(selected) => setFormData({...formData, status: selected.value})}
                                                                placeholder="Select"
                                                                isClearable={true}
                                                                isSearchable={true}
                                                                />
                                                                {formErrors.status && <div className="form-label text-danger m-1">{formErrors.status}</div>}
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-12 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                File <span className="text-danger">*</span>
                                                                </label>
                                                                {updateForm ? (
                                                                    <>
                                                                    {formData.license_file && typeof formData.license_file === 'string' ? (
                                                                        <div>
                                                                            <label>Currently:</label>
                                                                            <a href={formData.license_file} target="_blank" rel="noopener noreferrer">
                                                                                {formData.license_file.split("/").pop()}
                                                                            </a>
                                                                            <button 
                                                                                type="button" 
                                                                                className="btn btn-danger m-1" 
                                                                                onClick={() => setFormData({ ...formData, license_file: "" })}
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    ) : null}
                                                                    </>
                                                                ):null}
                                                                <input
                                                                    type="file"
                                                                    name="license_file"
                                                                    className="form-control"
                                                                    onChange={handleFileChange}
                                                                />
                                                                {formErrors.license_file && <div className="form-label text-danger m-1">{formErrors.license_file}</div>}
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
                                                        <div className="search-field">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Search"
                                                            />
                                                            <span className="search-icon">
                                                                <i className="fa-solid fa-magnifying-glass" />
                                                            </span>
                                                        </div>

                                                    </div>
                                                        <div className="table-responsive">
                                                            <table className="table table-center mb-0 table-striped table-hover">
                                                                <thead className="bg-primary text-white">
                                                                    <tr className="bg-primary text-white">
                                                                        <th onClick={() => handleSort('license_name')} style={{ cursor: "pointer" }} className="bg-primary text-white">Discipline {sortOrder === 'asc' ? '↑' : '↓'}</th>
                                                                        <th className="bg-primary text-white">License Number</th>
                                                                        {/* <th onClick={() => handleSort('city')} style={{ cursor: "pointer" }} className="bg-primary text-white">City {sortOrder === 'asc' ? '↑' : '↓'}</th> */}
                                                                        <th onClick={() => handleSort('state')} style={{ cursor: "pointer" }} className="bg-primary text-white">State {sortOrder === 'asc' ? '↑' : '↓'}</th>
                                                                        <th onClick={() => handleSort('expire_date')} style={{ cursor: "pointer" }} className="bg-primary text-white">Expire Date {sortOrder === 'asc' ? '↑' : '↓'}</th>
                                                                        <th onClick={() => handleSort('status')} style={{ cursor: "pointer" }} className="bg-primary text-white">Status {sortOrder === 'asc' ? '↑' : '↓'}</th>
                                                                        <th className="bg-primary text-white">Verification</th>
                                                                        <th className="bg-primary text-white">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {licenses.length === 0 ? 
                                                                        <tr><td colSpan={5}>No license data found for this professional</td></tr>
                                                                    :
                                                                    licenses.map((license) => (
                                                                        <tr key={license.id}>
                                                                            <td>{
                                                                            (() => {
                                                                                const option = disciplineOptions.find(option => option.value == license.discipline);
                                                                                return option ? (
                                                                                <span style={{ backgroundColor: option.color, color:"white", padding:"5px",borderRadius:"5px" }}>{option.label}</span>
                                                                                ) : "N/A";
                                                                            })()
                                                                            }</td>
                                                                            <td>{license.license_number}</td>
                                                                            {/* <td>{license.city}</td> */}
                                                                            <td>{license.state}</td>
                                                                            <td>{license.expired_on ? convertToUS(license.expired_on,"Date") : "N/A"}</td>
                                                                            <td>{license.status ? license.status : "N/A"}</td>
                                                                            <td>{license.is_verified ? license.is_verified : "N/A"}</td>
                                                                            <td>
                                                                                <div className="action-item">
                                                                                    <Link to="#" onClick={() => updateLicenses(license.id)}>
                                                                                        <i className="isax isax-edit-2" />
                                                                                    </Link>
                                                                                    {/* <Link to="#">
                                                                                        <i className="isax isax-import" />
                                                                                    </Link> */}
                                                                                    <Link to="#" onClick={() => deleteLicense(license.id)}>
                                                                                        <i className="isax isax-trash" />
                                                                                    </Link>
                                                                                </div>
                                                                            </td>
                                                                            {/* <td>
                                                                                <FaPen style={{color:"blue", padding:"8px", fontSize:"20px"}} onClick={() => updateLicenses(license.id)}/>
                                                                                <FaTimesCircle style={{color:"red", padding:"8px", fontSize:"20px"}} onClick={() => deleteLicense(license.id)}/>
                                                                            </td> */}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                                {/* <tbody>
                                                                    <tr>
                                                                        <td>Cerified Nurse</td>
                                                                        <td>12345</td>
                                                                        <td>Arizona</td>
                                                                        <td>Arizona</td>
                                                                        <td>
                                                                            <div className="action-item">
                                                                                <Link
                                                                                    to="#"
                                                                                    data-bs-toggle="modal"
                                                                                    data-bs-target="#edit_medical_records"
                                                                                >
                                                                                    <i className="isax isax-edit-2" />
                                                                                </Link>
                                                                                <Link to="#">
                                                                                    <i className="isax isax-import" />
                                                                                </Link>
                                                                                <Link to="#">
                                                                                    <i className="isax isax-trash" />
                                                                                </Link>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    
                                                                    <tr>
                                                                        <td>Cerified Physician</td>
                                                                        <td>54321</td>
                                                                        <td>Naveda</td>
                                                                        <td>Naveda</td>
                                                                        <td>
                                                                            <div className="action-item">
                                                                                <Link
                                                                                    to="#"
                                                                                    data-bs-toggle="modal"
                                                                                    data-bs-target="#edit_medical_records"
                                                                                >
                                                                                    <i className="isax isax-edit-2" />
                                                                                </Link>
                                                                                <Link to="#">
                                                                                    <i className="isax isax-import" />
                                                                                </Link>
                                                                                <Link to="#">
                                                                                    <i className="isax isax-trash" />
                                                                                </Link>
                                                                            </div>
                                                                        </td>                                                                    
                                                                    </tr>
                                                                </tbody> */}
                                                            </table>
                                                        </div>                                                </div>
                                                {/* /Medical Records Tab */}

                                            </form>
                                        </div>
                                    </div>
                        </div>
                    </div>
                </div>
            </div>
            <MessagePopup title={"License"} message={"Are you sure to delete the license"} close={handleClose} show={show} yes={handleYes} no={handleNo}/>
            <SiteFooter />
        </div>
    );
};

export default ProfessionalLicense;
