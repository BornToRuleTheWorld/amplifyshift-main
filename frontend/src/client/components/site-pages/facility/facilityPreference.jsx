import React, { useState, useEffect } from "react";
import StickyBox from "react-sticky-box";
import { Link, NavLink } from "react-router-dom";
import SiteFooter from "../home/footer.jsx";
import SiteHeader from "../home/header.jsx";
// import Header from "./header.jsx";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
//import ImageWithBasePath from "../../core/img/imagewithbasebath.jsx";
import axios from "axios";
import { FaTimesCircle, FaPen } from "react-icons/fa";
import { API_BASE_URL, AUTH_TOKEN, workSettingOptions, jobTypeOptions,disciplineOptions, specialtyOptions, yearOptions, boolOption, langOptions, visitType, stateOptions, cntryOptions, ColourOption, SingleValue, MultiValueLabel } from "../config";
import convertUrlToFile from "../convertToFile";
import MessagePopup from "../messagePopup.js";
import FacilityNav from "./facilityNav.jsx";
import FacilitySidebar from "./facilitySidebar.jsx";

const FacilityPreference = (props) => {

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

  
    const [preference, setPreference] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [updateForm, setUpdateForm] = useState(null);
    const currentUserID = atob(localStorage.getItem('RecordID')) || "";
    const UserID = atob(localStorage.getItem('userID')) || "";
    const [formErrors, setFormErrors] = useState({});
    
    {/* preference Add and Update */}

    const [formData, setFormData] = useState({
        user:UserID,
        facility: currentUserID,
        discipline: "",
        speciality: "",
        work_setting: "",
        job_type:"",
        languages: "",
        visit_type: "",
        years_of_exp:"",
        cpr_bls: "",
        license: "",
        pay:""
    });

    useEffect(() => {
        if (updateForm) {
            setFormData({
                ...updateForm
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

    const handleCancel = () => {
        setFormData({
            user:UserID,
            facility: currentUserID,
            discipline: "",
            speciality: "",
            work_setting: "",
            job_type:"",
            languages: "",
            visit_type: "",
            years_of_exp:"",
            cpr_bls: "",
            license: "",
            pay:""
        });
        setUpdateForm(null);
        setFormErrors({});
        setError(null);
        setSuccess(null);
    };

    const validiteFormInputs = (data) => {
        const errorObj = {};
        if (Object.keys(data).length !== 0){
            if (data.discipline == '') {
                errorObj.discipline = "Discipline is required";
            }

            if (data.pay == '') {
                errorObj.pay = "Pay is required";
            }

            if (data.license == '') {
                errorObj.license = "License is required";
            }
        }
        return errorObj
    }
    
    {/* preference Add and Update */}
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setFormErrors({})
        const formValidate = validiteFormInputs(formData)
        console.log("formValidate",formValidate)
        if (Object.keys(formValidate).length === 0) {
            setIsLoading(true);
            setError(null);

            try {
                
                //for create    
                let url = `${API_BASE_URL}/facility/preference/`;
                let method = "POST";

                //for update
                if (updateForm) {
                    url = `${API_BASE_URL}/facility/preference/${updateForm.id}/`;
                    method = "PUT";
                }

                await axios({
                    method: method,
                    url: url,
                    data: formData,
                    headers: { 
                        "Content-Type": "application/json",
                        'Authorization': AUTH_TOKEN
                    }
                });
                
                handleCancel();
                fetchPreference();
                method === "PUT" ? setSuccess("preference updated successfully") : setSuccess("preference created successfully") 
            } catch (err) {
                console.log("preference error",err)
                setError(err.response?.data?.detail?.non_field_errors || "An error occurred");
            } finally {
                setIsLoading(false);
            }
        }else{
            setFormErrors(formValidate)
            return false;
        }
    };


    {/* preference List */}
    const fetchPreference = async () => {
        setError(null)
        setSuccess(null)
        setFormErrors({})
        try {
            const response = await axios.get(`${API_BASE_URL}/facility/preference/?FacUserID=${UserID}`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                 },
            });
            console.log("Preference List",response.data)
            setPreference(response.data);
        } catch (err) {
            setError(err.response?.data?.Result || "An error occurred");
        }
    };

    const deletePreference = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        handleShow()
        setDeleteID(id)
    };

    const updatePreference = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        const preferenceToUpdate = preference.find((edu) => edu.id === id);
        setUpdateForm(preferenceToUpdate)
    }

    const removePreference = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        try {
            await axios.delete(`${API_BASE_URL}/facility/preference/${id}/`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            setPreference(preference.filter((license) => license.id !== id));
            setSuccess("Preference deleted successfully")
        } catch (err) {
            setError(err.response?.data?.Result || "Error deleting preference");
        }finally{
            setDeletePopup(false)
        }
    }

    useEffect(() => {
        fetchPreference();
    }, []);

    useEffect(() => {
        if(deletePopup){
            removePreference(deleteID);
        }
    }, [deletePopup]);

    const handleSort = (field) => {
        let newSortOrder = 'asc';
        if (sortField === field && sortOrder === 'asc') {
          newSortOrder = 'desc';
        }
        setSortOrder(newSortOrder);
        setSortField(field);
    
        const sortedData = [...preference].sort((a, b) => {
          if (field === 'name' || field === 'course_name' ) {
            const nameA = a[field].toLowerCase();
            const nameB = b[field].toLowerCase();
            if (nameA < nameB) return newSortOrder === 'asc' ? -1 : 1;
            if (nameA > nameB) return newSortOrder === 'asc' ? 1 : -1;
            return 0;
          }
          return 0;
        });
    
        setPreference(sortedData);
      };
    
    console.log("formData",formData)
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
                                            <Link to="/facility/dashboard">Facility</Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            <Link to="/facility/myprofile">Profile</Link>
                                        </li>
                                    </ol>
                                    <h2 className="breadcrumb-title">Preference</h2>
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
                        <div className="col-md-4 col-lg-4 col-xl-3 theiaStickySidebar">
                            <StickyBox offsetTop={20} offsetBottom={20}>
                                <FacilitySidebar />
                            </StickyBox>
                        </div>

                        <div className="col-lg-8 col-xl-9">
                                    <div className="card">
                                        <div className="card-body">
                                            {/* <div className="pb-3 mb-3">
                                                <h5>preference</h5>
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
                                                            <label className="form-label">Select Discipline <span className="text-danger">*</span></label>
                                    -                           <Select
                                                                className="select"
                                                                name = "discipline"
                                                                options={disciplineOptions}
                                                                value={formData?.discipline ? disciplineOptions.find(option => option.value == formData.discipline):null}
                                                                onChange={(selected) => setFormData({...formData, discipline: selected ? selected.value : null})}
                                                                placeholder="Select"
                                                                isClearable={true}
                                                                isSearchable={true}
                                                                components={{ Option : ColourOption, SingleValue }}
                                                            />
                                                            {formErrors.discipline && <div className="form-label text-danger m-1">{formErrors.discipline}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                            <label className="form-label">Select Work Experience</label>
                                                            
                                                            <Select
                                                                className="select"
                                                                name="years_of_exp"
                                                                options={yearOptions}
                                                                value={formData?.years_of_exp ? yearOptions.find(option => option.value == formData.years_of_exp) : null}
                                                                onChange={(selected) => setFormData({...formData, years_of_exp: selected ? selected.value : null})}
                                                                placeholder="Select"
                                                                isClearable={true}
                                                                isSearchable={true}
                                                            />
                                                            {formErrors.years_of_exp && <div className="form-label text-danger m-1">{formErrors.years_of_exp}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                            <label className="form-label">Select Specialty </label>
                                                            
                                                            <Select
                                                                className="select"
                                                                name="speciality"
                                                                options={specialtyOptions}
                                                                value={formData.speciality ? specialtyOptions.find(option => option.value == formData.speciality) : null}
                                                                onChange={(selected) => setFormData({...formData, speciality: selected ? selected.value : null})}
                                                                placeholder="Select"
                                                                isClearable={true}
                                                                isSearchable={true}
                                                            />
                                                            {formErrors.speciality && <div className="form-label text-danger m-1">{formErrors.speciality}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                            <label className="form-label">Select Work Setting </label>
                                                            
                                                            <Select
                                                                className="select"
                                                                name = "work_setting"
                                                                options={workSettingOptions}
                                                                value={formData.work_setting ? workSettingOptions.find(option => option.value == formData.work_setting) : null}
                                                                onChange={(selected) => setFormData({...formData, work_setting: selected ? selected.value : null})}
                                                                placeholder="Select"
                                                                isClearable={true}
                                                                isSearchable={true}
                                                            />
                                                            {formErrors.work_setting && <div className="form-label text-danger m-1">{formErrors.work_setting}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                            <label className="form-label">Select Job Type </label>
                                                            
                                                            <Select
                                                                className="select"
                                                                name="job_type"
                                                                options={jobTypeOptions}
                                                                value={formData.job_type ? jobTypeOptions.find(option => option.value == formData.job_type) : null}
                                                                onChange={(selected) => setFormData({...formData, job_type: selected ? selected.value : null})}
                                                                placeholder="Select"
                                                                isClearable={true}
                                                                isSearchable={true}
                                                            />
                                                            {formErrors.job_type && <div className="form-label text-danger m-1">{formErrors.job_type}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                            <label className="form-label">Select Languages </label>
                                                            
                                                            <Select
                                                                className="select"
                                                                options={langOptions}
                                                                value={formData.languages ? langOptions.find(option => option.value == formData.languages) : null}
                                                                onChange={(selected) => setFormData({...formData, languages: selected.value})}
                                                                placeholder="Select"
                                                                isClearable={true}
                                                                isSearchable={true}
                                                            />
                                                            {formErrors.languages && <div className="form-label text-danger m-1">{formErrors.languages}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                            <label className="form-label">Select Visit Type </label>
                                                            
                                                            <Select
                                                                className="select"
                                                                name="visit_type"
                                                                options={visitType}
                                                                value={formData.visit_type ? visitType.find(option => option.value == formData.visit_type) : null}
                                                                onChange={(selected) => setFormData({...formData, visit_type: selected.value})}
                                                                placeholder="Select"
                                                                isClearable={true}
                                                                isSearchable={true}
                                                            />
                                                            {formErrors.visit_type && <div className="form-label text-danger m-1">{formErrors.visit_type}</div>}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                            <label className="form-label">CPR/BLS:</label>
                                                            
                                                            <Select
                                                                className="select"
                                                                name="cpr_bls"
                                                                options={boolOption}
                                                                value={formData.cpr_bls ? boolOption.find(option => option.value === formData.cpr_bls) : null}
                                                                onChange={(selected) => setFormData({...formData, cpr_bls: selected ? selected.value : null})}
                                                                placeholder="Select"
                                                                isClearable={true}
                                                                isSearchable={true}
                                                            />
                                                            {formErrors.cpr_bls && <div className="form-label text-danger m-1">{formErrors.cpr_bls}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                            <label className="form-label">License:</label>
                                                            <Select
                                                                className="select"
                                                                name="license"
                                                                options={boolOption}
                                                                value={formData.license ? boolOption.find(option => option.value === formData.license) : null}
                                                                onChange={(selected) => setFormData({...formData, license: selected ? selected.value : null})}
                                                                placeholder="Select"
                                                                isClearable={true}
                                                                isSearchable={true}
                                                            />
                                                            {formErrors.license && <div className="form-label text-danger m-1">{formErrors.license}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">Pay <span className="text-danger">*</span></label>
                                                                <input type="text" name="pay" value={formData.pay} onChange={handleInputChange} className="form-control" />
                                                                {formErrors.pay && <div className="form-label text-danger m-1">{formErrors.pay}</div>}
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
                                                                        <th className="bg-primary text-white">Discipline</th>
                                                                        <th className="bg-primary text-white">Work Setting</th>
                                                                        <th className="bg-primary text-white">Job Type</th>
                                                                        <th className="bg-primary text-white">Years Of Experience</th>
                                                                        <th className="bg-primary text-white">Languages</th>
                                                                        <th className="bg-primary text-white">Speciality</th>
                                                                        <th className="bg-primary text-white">Actions</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    { preference.length === 0 ?
                                                                        <tr><td colSpan={7}>No preference data found for this facility</td></tr>
                                                                    :
                                                                    preference.map((preference) => (
                                                                        <tr key={preference.id}>
                                                                            <td>{preference.discipline ? disciplineOptions.find(disp => disp.value === preference.discipline).label : "N/A"}</td>
                                                                            <td>{preference.work_setting ? workSettingOptions.find(setting => setting.value === preference.work_setting).label : "N/A"}</td>
                                                                            <td>{preference.job_type ? jobTypeOptions.find(job => job.value === preference.job_type).label : "N/A"}</td>
                                                                            <td>{preference.years_of_exp ? yearOptions.find(year => year.value === preference.years_of_exp).label : "N/A"}</td>
                                                                            <td>{preference.languages ? langOptions.find(lang => lang.value === preference.languages).label : "N/A"}</td>
                                                                            <td>{preference.speciality ? specialtyOptions.find(spl => spl.value ===preference.speciality).label : "N/A"}</td>
                                                                            <td>
                                                                                <div className="action-item">
                                                                                    <Link to="#" onClick={() => updatePreference(preference.id)}>
                                                                                        <i className="isax isax-edit-2" />
                                                                                    </Link>
                                                                                    {/* <Link to="#">
                                                                                        <i className="isax isax-import" />
                                                                                    </Link> */}
                                                                                    <Link to="#" onClick={() => deletePreference(preference.id)}>
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
            <MessagePopup title={"preference"} message={"Are you sure to delete the preference"} close={handleClose} show={show} yes={handleYes} no={handleNo}/>
            <SiteFooter />
        </div>
    );
};

export default FacilityPreference;
