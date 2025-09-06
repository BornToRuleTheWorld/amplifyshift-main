import React, { useState, useEffect } from "react";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import SiteFooter from "../../home/footer.jsx";
import SiteHeader from "../../home/header.jsx";
// import Header from "./header.jsx";
import { DatePicker } from "antd";
import Select from "react-select";
import ImageWithBasePath from "../../../../../core/img/imagewithbasebath.jsx";
//import ImageWithBasePath from "../../core/img/imagewithbasebath.jsx";
// import SearchProfessionalNav from "./ProfessionalNav.js";
import SearchProfessionalNav from "./ProfessionalNav.jsx";
import axios from "axios";
import { FaTimesCircle, FaPen } from "react-icons/fa";
import { API_BASE_URL, AUTH_TOKEN } from "../../config";
import convertUrlToFile from "../../convertToFile";

const SearchProfessionalEducation = (props) => {

    const [education, setEducation] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [updateForm, setUpdateForm] = useState(null);
    const currentUserID = atob(localStorage.getItem('searchProfID')) || "";
    const [formErrors, setFormErrors] = useState({});
    {/* Education Add and Update */}
    
    const typeOptions = [
        {value:"High School or G.E.D", label:"High School or G.E.D"},
        {value:"Vocational School", label:"Vocational School"},
        {value:"College", label:"College"},
        {value:"Other", label:"Other"}
    ]
    const [formData, setFormData] = useState({
        professional: currentUserID,
        name: "",
        type: "",
        course_name: "",
        year_completed: "",
        location: "",
        certificate_file: "",
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
        setFormData({
            ...formData,
            certificate_file: e.target.files[0],
        });
    };

    const handleCancel = () => {
        setFormData({
            professional: currentUserID,
            name: "",
            type: "",
            course_name: "",
            year_completed: "",
            location: "",
            certificate_file: "",
        });
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
          if (data.name == '') {
            errorObj.name = "Education name is required";
          }
  
          if (data.type == '') {
            errorObj.type = "Education type is required";
          }
  
          if (data.course_name == '') {
            errorObj.course_name = "Course name is required";
          }

          if (data.location == '') {
            errorObj.location = "Location is required";
          }
  
          if (data.year_completed == '') {
            errorObj.year_completed = "Completion year is required";
          }else if(!Number.isInteger(data.year_completed)){
            errorObj.year_completed = "Not a valid year";
          }
  
          if (data.certificate_file == '') {
            errorObj.certificate_file = "File is required";
          }
        }
        return errorObj
    }

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
                //const updatedFormData = { ...formData, type: formData.type };
                const formDataObj = new FormData();
                for (const key in formData) {
                    if (key === "certificate_file" && formData[key] && typeof formData[key] === 'string') {
                        console.log(formData[key].split('/').pop())
                        const file = await convertUrlToFile(formData[key], `education_${formData['id']}_${formData['name']}.png`);
                        formDataObj.append(key, file);
                    } else {
                        formDataObj.append(key, formData[key]);
                    }
                }
                
                //console.log(updatedFormData)
                //for create    
                let url = `${API_BASE_URL}/professional/education/`;
                let method = "POST";

                //for update
                if (updateForm) {
                    url = `${API_BASE_URL}/professional/education/${updateForm.id}/`;
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
                fetchEducation();
                method === "PUT" ? setSuccess("Education updated successfully") : setSuccess("Education created successfully") 
            } catch (err) {
                console.log(err.response)
                setError(err.response?.data?.Result || "An error occurred");
            } finally {
                setIsLoading(false);
            }
        }else{
            setFormErrors(formValidate)
            return false;
        }
    };

    {/* Education Add and Update */}

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
            setEducation(response.data);
        } catch (err) {
            setError(err.response?.data?.Result || "An error occurred");
        }
    };

    const deleteEducation = async (id) => {
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
        } catch (err) {
            setError(err.response?.data?.Result || "Error deleting license");
        }
    };

    const updateEducation = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        const educationToUpdate = education.find((edu) => edu.id === id);
        setUpdateForm(educationToUpdate)
    }

    useEffect(() => {
        fetchEducation();
    }, []);
    
    {/* Education List */}
    
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
                                    <h2 className="breadcrumb-title">Professional Education</h2>
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
                                                <h5>Education</h5>
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
                                                                <label className="form-label">
                                                                    Education Name <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    className="form-control"
                                                                    value={formData.name}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter education name"
                                                                    
                                                                />
                                                               {formErrors.name && <div className="form-label text-danger m-1">{formErrors.name}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Education Type <span className="text-danger">*</span>
                                                                </label>
                                                                <Select
                                                                    className="select"
                                                                    name="education_type"
                                                                    options={typeOptions}
                                                                    value={updateForm ? typeOptions.find(option => option.value === formData.type) :formData.type }
                                                                    onChange={(selected) => setFormData({...formData, type: selected})}
                                                                    placeholder="Select"
                                                                    isClearable={true}
                                                                    isSearchable={true}
                                                                    
                                                                />
                                                                {formErrors.type && <div className="form-label text-danger m-1">{formErrors.type}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Course <span className="text-danger">*</span>
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
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    year of Completed <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="year_completed"
                                                                    className="form-control" 
                                                                    value={formData.year_completed}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter completed year"
                                                                    
                                                                />
                                                                {formErrors.year_completed && <div className="form-label text-danger m-1">{formErrors.year_completed}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Location <span className="text-danger">*</span>
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
                                                                    Certificate: <span className="text-danger">*</span>
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
                                                    <div className="custom-table">
                                                        <div className="table-responsive">
                                                            <table className="table table-center mb-0">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Education Name</th>
                                                                        <th>Education Type</th>
                                                                        <th>Course</th>
                                                                        <th>Year of Completed</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    { education.length === 0 ?
                                                                        <tr><td colSpan={7}>No education data found for this professional</td></tr>
                                                                    :
                                                                    education.map((education) => (
                                                                        <tr key={education.id}>
                                                                            <td>{education.name}</td>
                                                                            <td>{education.type}</td>
                                                                            <td>{education.course_name}</td>
                                                                            <td>{education.year_completed}</td>
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
                                                </div>
                                                {/* /Medical Records Tab */}

                                            </form>
                                        </div>
                                    </div>
                        </div>
                    </div>
                </div>
            </div>
            <SiteFooter />
        </div>
    );
};

export default SearchProfessionalEducation;
