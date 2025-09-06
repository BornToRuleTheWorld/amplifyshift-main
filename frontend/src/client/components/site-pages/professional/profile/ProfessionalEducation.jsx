import React, { useState, useEffect } from "react";
// import DashboardSidebar from "../sidebar/sidebar.jsx";
import DashboardSidebar from "../../../patients/dashboard/sidebar/sidebar.jsx";
// import IMG01 from "../../../../assets/images/patient.jpg";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import SiteFooter from "../../home/footer.jsx";
import SiteHeader from "../../home/header.jsx";
// import Header from "./header.jsx";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import ImageWithBasePath from "../../../../../core/img/imagewithbasebath.jsx";
//import ImageWithBasePath from "../../core/img/imagewithbasebath.jsx";
import ProfessionalNav from "./ProfessionalNav.jsx";
import axios from "axios";
import { FaTimesCircle, FaPen } from "react-icons/fa";
import { API_BASE_URL, AUTH_TOKEN, imageFormat } from "../../config";
import convertUrlToFile from "../../convertToFile";
import MessagePopup from "../../messagePopup.js";
import ProfessionalSkills from "./ProfessionalSkills.jsx";
import ProfessionalSidebar from "./ProfessionalSidebar.jsx";

const ProfessionalEducation = (props) => {

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

    const [education, setEducation] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [updateForm, setUpdateForm] = useState(null);
    const currentUserID = atob(localStorage.getItem('RecordID')) || "";
    const [formErrors, setFormErrors] = useState({});
    {/* Education Add and Update */}
    
    const typeOptions = [
        {value:"High School or G.E.D", label:"High School or G.E.D"},
        {value:"Vocational School", label:"Vocational School"},
        {value:"College", label:"College"},
        {value:"Other", label:"Other"}
    ]

    const educationStatus = [
        {value:"true", label :"Yes, I have the educational qualifications required for this position"},
        {value:"false", label:"No, I am still completing a degree, I am in the process of completing the required educational qualifications"}
    ]

    const monthOptions = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(0, i);
        const monthName = date.toLocaleString('default', { month: 'long' });
        return { value: monthName, label: monthName };
    });

    const currentYear = new Date().getFullYear();
    const startYear = 1980;
    const yearOptions = Array.from({ length: currentYear - startYear + 1 }, (_, i) => {
        const year = startYear + i;
        return { value: year.toString(), label: year.toString() };
    }).reverse();

    const [formData, setFormData] = useState({
        professional: currentUserID,
        name: "",
        location: "",
        course_name: "",
        attended_month:"",
        attended_year: "",
        last_grade: "",
        is_completed:null,
        date_completed:"",
        certificate_file: null,
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

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            certificate_file: e.target.files[0],
        });
    };

    const handleCancel = () => {
        setFormData({
            professional: currentUserID,
            name: "",
            location: "",
            course_name: "",
            attended_month:"",
            attended_year: "",
            last_grade: "",
            is_completed:null,
            date_completed:"",
            certificate_file: null,
        });
        setUpdateForm(null);
        setFormErrors({});
        setError(null);
        setSuccess(null);

        const fileInput = document.querySelector('input[name="certificate_file"]');
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const validiteFormInputs = (data) => {
      
        const errorObj = {};
        const emailRegx = /.+@.+\.[A-Za-z]+$/
        const phoneRegx = /\d/g
        
        if (Object.keys(data).length !== 0){
            if (data.name == '') {
                errorObj.name = "Education name is required";
            }
    
            if (data.course_name == '') {
                errorObj.course_name = "Course name is required";
            }

            if (data.location == '') {
                errorObj.location = "Location is required";
            }
    
            if (!data.attended_month && !data.attended_year) {
                errorObj.dates_attended = "Dates attended is required";
            }else if (data.attended_year == '' || data.attended_month == '') {
                errorObj.dates_attended = "Invalid Dates attended";
            }

            if (data.last_grade == '') {
                errorObj.last_grade = "Grade is required";
            }

            if (data.is_completed == '') {
                errorObj.is_completed = "Please select your eductional status";
            }else if (data.is_completed == 'false'){
                if (data.date_completed == '') {
                    errorObj.date_completed = "Please select your completion date";
                }
            }
          
            if (data.certificate_file) {
                const file = data.certificate_file;
                if (file instanceof File) {
                    console.log("File", file);
                    console.log("File type", file.type);

                    if (!imageFormat.includes(file.type)) {
                    errorObj.certificate_file = "Unsupported file format. Only .doc, .pdf, .jpeg, .png allowed.";
                    } else if (file.size === 0) {
                    errorObj.certificate_file = "File must not be empty.";
                    }
                } else {
                    console.log("Existing file reference, skipping validation.");
                }
            }
        }
        return errorObj
    }
    
    {/* Education Add and Update */}
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
                let data = "";
                if (updateForm){
                    data = formData
                }else{
                    const updatedFormData = { ...formData, name: formData.name.value, attended_month: formData.attended_month.value, attended_year: formData.attended_year.value };
                    data = updatedFormData
                }
                
                let fileError = false
                const formDataObj = new FormData();
                for (const key in data) {
                    if (key === "certificate_file" && data[key] && typeof data[key] === 'string') {
                        const file_name = data[key].split('/').pop();
                        const file = await convertUrlToFile(data[key], file_name);
                        formDataObj.append(key, file);
                    } else {
                        if (data[key] === 'null' || data[key] === null) {
                            formDataObj.append(key, '');
                        } else {
                            formDataObj.append(key, data[key]);
                        }
                    }
                }
                
                console.log(data)
                //for create    
                let url = `${API_BASE_URL}/professional/education/`;
                let method = "POST";

                //for update
                if (updateForm) {
                    url = `${API_BASE_URL}/professional/education/${updateForm.id}/`;
                    method = "PUT";
                }


                if (fileError){
                    return
                }else{
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
                    fetchEducation();
                    method === "PUT" ? setSuccess("Education updated successfully") : setSuccess("Education created successfully") 
                }                
            } catch (err) {
                console.log("Education error",err)
                setError(err.response?.data?.Result || "An error occurred");
            } finally {
                setIsLoading(false);
            }
        }else{
            setFormErrors(formValidate)
            return false;
        }
    };


    {/* Education List */}
    const fetchEducation = async () => {
        setError(null)
        setSuccess(null)
        setFormErrors({})
        try {
            const response = await axios.get(`${API_BASE_URL}/professional/education/?ProfID=${currentUserID}`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                 },
            });
            console.log("Eductaion List",response.data)
            setEducation(response.data);
        } catch (err) {
            setError(err.response?.data?.Result || "An error occurred");
        }
    };

    const deleteEducation = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        handleShow()
        setDeleteID(id)
    };

    const updateEducation = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        const educationToUpdate = education.find((edu) => edu.id === id);
        setUpdateForm(educationToUpdate)
    }

    const removeEducation = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        try {
            await axios.delete(`${API_BASE_URL}/professional/education/${id}/`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            setEducation(education.filter((license) => license.id !== id));
            setSuccess("Education deleted successfully")
        } catch (err) {
            setError(err.response?.data?.Result || "Error deleting license");
        }finally{
            setDeletePopup(false)
        }
    }

    useEffect(() => {
        fetchEducation();
    }, []);

    useEffect(() => {
        if(deletePopup){
            removeEducation(deleteID);
        }
    }, [deletePopup]);

    const handleSort = (field) => {
        let newSortOrder = 'asc';
        if (sortField === field && sortOrder === 'asc') {
          newSortOrder = 'desc';
        }
        setSortOrder(newSortOrder);
        setSortField(field);
    
        const sortedData = [...education].sort((a, b) => {
          if (field === 'name' || field === 'course_name' ) {
            const nameA = a[field].toLowerCase();
            const nameB = b[field].toLowerCase();
            if (nameA < nameB) return newSortOrder === 'asc' ? -1 : 1;
            if (nameA > nameB) return newSortOrder === 'asc' ? 1 : -1;
            return 0;
          }
          return 0;
        });
    
        setEducation(sortedData);
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
                                            <Link to="/professional/dashboard">Professional</Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            <Link to="/professional/myprofile">Profile</Link>
                                        </li>
                                    </ol>
                                    <h2 className="breadcrumb-title">Education</h2>
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
                                                <h5>Education</h5>
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
                                                        <div className="col-lg-12 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">Education status&nbsp;<span className="text-danger">*</span></label>
                                                                <div className="row">
                                                                    {educationStatus.map((status) => (
                                                                    <div className="col-auto form-check m-2" key={status.value}>
                                                                        <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="is_completed"
                                                                        value={status.value}
                                                                        checked={`${formData.is_completed}` === status.value}
                                                                        onChange={(e) =>handleInputChange(e)}
                                                                        />
                                                                        <label className="form-check-label">{status.label}</label>
                                                                    </div>
                                                                    ))}
                                                                </div>
                                                                {formErrors.is_completed && <div className="form-label text-danger m-1">{formErrors.is_completed}</div>}
                                                            </div>
                                                        </div>
                                                        {formData.is_completed === "false" &&
                                                        <div className="col-lg-12 col-md-6">
                                                            <div className="col-lg-4 col-md-6">
                                                                <div className="form-wrap">
                                                                    <label className="col-form-label">
                                                                    Completion Date&nbsp;<span className="text-danger">*</span>
                                                                    </label>
                                                                    <div className="form-icon">
                                                                        <DatePicker
                                                                            className="form-control datetimepicker"
                                                                            name="date_completed"
                                                                            selected={formData.date_completed}
                                                                            onChange={(date) =>setFormData({ ...formData, date_completed : date.toISOString().split('T')[0]})}
                                                                            dateFormat="MM/dd/yyyy"
                                                                            placeholderText="MM:DD:YYY"
                                                                            showDayMonthYearPicker
                                                                        />
                                                                        <span className="icon">
                                                                        <i className="fa-regular fa-calendar-days" />
                                                                        </span>
                                                                    </div>
                                                                {formErrors.date_completed && <div className="form-label text-danger m-1">{formErrors.date_completed}</div>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        }
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Name&nbsp;<span className="text-danger">*</span>
                                                                </label>
                                                                <Select
                                                                    className="select"
                                                                    name="education_name"
                                                                    options={typeOptions}
                                                                    value={updateForm ? typeOptions.find(option => option.value === formData.name) :formData.name}
                                                                    onChange={(selected) => setFormData({...formData, name: selected})}
                                                                    placeholder="Select"
                                                                    isClearable={true}
                                                                    isSearchable={true}
                                                                    
                                                                />
                                                                {formErrors.name && <div className="form-label text-danger m-1">{formErrors.name}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Location&nbsp;<span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="location"
                                                                    className="form-control"
                                                                    value={formData.location}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter location"
                                                                    
                                                                />
                                                                {formErrors.location && <div className="form-label text-danger m-1">{formErrors.location}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Course&nbsp;<span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="course_name"
                                                                    className="form-control" 
                                                                    value={formData.course_name}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter course name"
                                                                    
                                                                />
                                                                {formErrors.course_name && <div className="form-label text-danger m-1">{formErrors.course_name}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Dates Attended&nbsp;<span className="text-danger">*</span>
                                                                </label>
                                                                <div className="row g-2">
                                                                    <div className="col-6">
                                                                    <Select
                                                                        className="select"
                                                                        name="attended_month"
                                                                        options={monthOptions}
                                                                        value={updateForm ? monthOptions.find(option => option.value === formData.attended_month) :formData.attended_month}
                                                                        onChange={(selected) => setFormData({...formData, attended_month: selected})}
                                                                        placeholder="Month"
                                                                        isClearable={true}
                                                                        isSearchable={true}
                                                                        
                                                                    />
                                                                    </div>
                                                                    <div className="col-6">
                                                                    <Select
                                                                        className="select"
                                                                        name="attended_year"
                                                                        options={yearOptions}
                                                                        value={updateForm ? yearOptions.find(option => option.value === formData.attended_year) :formData.attended_year}
                                                                        onChange={(selected) => setFormData({...formData, attended_year: selected})}
                                                                        placeholder="year"
                                                                        isClearable={true}
                                                                        isSearchable={true}
                                                                        
                                                                    />
                                                                    </div>
                                                                </div>
                                                                {formErrors.dates_attended && <div className="form-label text-danger m-1">{formErrors.dates_attended}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Last grade completed&nbsp;<span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="last_grade"
                                                                    className="form-control" 
                                                                    value={formData.last_grade}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter last grade"
                                                                    
                                                                />
                                                                {formErrors.last_grade && <div className="form-label text-danger m-1">{formErrors.last_grade}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Degree (or) Certificate:
                                                                </label>
                                                                {updateForm ? (
                                                                <>
                                                                {formData.certificate_file && typeof formData.certificate_file === 'string' ? (
                                                                    <div style={{marginTop:"5px"}}>
                                                                        <label>Currently: </label>
                                                                        <a href={formData.certificate_file} target="_blank" rel="noopener noreferrer">
                                                                            {formData.certificate_file.split("/").pop()}
                                                                        </a>
                                                                        <button 
                                                                            type="button" 
                                                                            className="btn btn-danger m-1" 
                                                                            onClick={() => setFormData({ ...formData, certificate_file: "" })}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                ) : null}
                                                                </>
                                                                ):null}
                                                                <input
                                                                    type="file"
                                                                    name="certificate_file"
                                                                    className="form-control"
                                                                    onChange={handleFileChange}
                                                                    
                                                                />
                                                                (.doc, .pdf, .jpeg, .png)
                                                                {formErrors.certificate_file && <div className="form-label text-danger m-1">{formErrors.certificate_file}</div>}
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
                                                                        <th onClick={() => handleSort('name')} style={{ cursor: "pointer" }} className="bg-primary text-white">Name {sortOrder === 'asc' ? '↑' : '↓'}</th>
                                                                        <th className="bg-primary text-white">Location</th>
                                                                        <th onClick={() => handleSort('course_name')} style={{ cursor: "pointer" }} className="bg-primary text-white">Course {sortOrder === 'asc' ? '↑' : '↓'}</th>
                                                                        <th className="bg-primary text-white">Dates Attended</th>
                                                                        <th className="bg-primary text-white">Grade</th>
                                                                        <th className="bg-primary text-white">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    { education.length === 0 ?
                                                                        <tr><td colSpan={7}>No education data found for this professional</td></tr>
                                                                    :
                                                                    education.map((education) => (
                                                                        <tr key={education.id}>
                                                                            <td>{education.name}</td>
                                                                            <td>{education.location}</td>
                                                                            <td>{education.course_name}</td>
                                                                            <td>{education.attended_month} {education.attended_year}</td>
                                                                            <td>{education.last_grade}</td>
                                                                            <td>
                                                                                <div className="action-item">
                                                                                    <Link to="#" onClick={() => updateEducation(education.id)}>
                                                                                        <i className="isax isax-edit-2" />
                                                                                    </Link>
                                                                                    {/* <Link to="#">
                                                                                        <i className="isax isax-import" />
                                                                                    </Link> */}
                                                                                    <Link to="#" onClick={() => deleteEducation(education.id)}>
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
            <MessagePopup title={"Education"} message={"Are you sure to delete the education"} close={handleClose} show={show} yes={handleYes} no={handleNo}/>
            <SiteFooter />
        </div>
    );
};

export default ProfessionalEducation;
