import React, { useState, useEffect } from "react";
// import DashboardSidebar from "../sidebar/sidebar.jsx";
import DashboardSidebar from "../../../../patients/dashboard/sidebar/sidebar.jsx";
// import IMG01 from "../../../../assets/images/patient.jpg";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import SiteFooter from "../../../home/footer.jsx";
import SiteHeader from "../../../home/header.jsx";
// import Header from "./header.jsx";
// import { DatePicker } from "antd";
import Select from "react-select";
import ImageWithBasePath from "../../../../../../core/img/imagewithbasebath.jsx";
//import ImageWithBasePath from "../../core/img/imagewithbasebath.jsx";
import AdminProfessionalNav from "./adminProfessionalNav.jsx";
import axios from "axios";
import { FaTimesCircle, FaPen } from "react-icons/fa";
import { API_BASE_URL, AUTH_TOKEN} from "../../../config";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import convertUrlToFile from "../../../convertToFile";
import MessagePopup from "../../../messagePopup.js";

const AdminProfessionalCertificate = (props) => {

    const [show, setShow] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    
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

    const [certificates, setCertificates] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [updateForm, setUpdateForm] = useState(null);
    const currentUserID = atob(localStorage.getItem('adminProfID')) || "";
    const [formErrors, setFormErrors] = useState({});

    {/* Certificate add and update */}
    const [formData, setFormData] = useState({
        professional: currentUserID,
        certificate_name: "",
        certificate_date: "",
        city: "",
        state: "",
        country: "",
        certificate_file: null,
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
            certificate_name: "",
            certificate_date: "",
            city: "",
            state: "",
            country: "",
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
          if (data.certificate_name == '') {
            errorObj.certificate_name = "Certificate name is required";
          }
  
          if (data.certificate_date == '') {
            errorObj.certificate_date = "Certificate date is required";
          }
  
          if (data.city == '') {
            errorObj.city = "City is required";
          }

          if (data.state == '') {
            errorObj.state = "State is required";
          }

          if (data.country == '') {
            errorObj.country = "Country is required";
          }
  
          if (data.certificate_file === null) {
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
            try {
                const formDataObj = new FormData();
                for (const key in formData) {
                    if (key === "certificate_file" && formData[key] && typeof formData[key] === 'string') {
                        console.log(formData[key].split('/').pop())
                        const file = await convertUrlToFile(formData[key], `certificate_${formData['id']}_${formData['certificate_name']}.png`);
                        formDataObj.append(key, file);
                    } else {
                        formDataObj.append(key, formData[key]);
                    }
                }

                //for create    
                let url = `${API_BASE_URL}/professional/certifications/`;
                let method = "POST";

                //for update
                if (updateForm) {
                    url = `${API_BASE_URL}/professional/certifications/${updateForm.id}/`;
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
                fetchCertificates();
                method === "PUT" ? setSuccess("Certificate updated successfully") : setSuccess("Certificate created successfully")
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
    {/* Certificate add and update */}

    {/* Certificate List*/}
    const fetchCertificates = async () => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        try {
            const response = await axios.get(`${API_BASE_URL}/professional/certifications/?ProfID=${currentUserID}`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                 },
            });
            setCertificates(response.data);
        } catch (err) {
            setError(err.response?.data?.Result || "An error occurred");
        }
    };

    const deleteCertificates = async (id) => {
        setError(null)
        setSuccess(null)
        setFormErrors({})
        handleShow()
        setDeleteID(id)
    };

    const removeCertificate = async(id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        try {
            await axios.delete(`${API_BASE_URL}/professional/certifications/${id}/`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            setCertificates(certificates.filter((certificate) => certificate.id !== id));
            setSuccess("Certificate deleted successfully")
        } catch (err) {
            setError(err.response?.data?.Result || "Error deleting certificate");
        }finally{
            setDeletePopup(false)
        }
    }

    const updateCertificates = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({});
        const certificateToUpdate = certificates.find((certificate) => certificate.id === id);
        setUpdateForm(certificateToUpdate)
    }

    useEffect(() => {
        fetchCertificates();
    }, []);

    useEffect(() => {
        if(deletePopup){
            removeCertificate(deleteID);
        }
    }, [deletePopup]);

    {/* Certificate List*/}
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
                                            <Link to="/site-user/dashboard">Admin</Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            <Link to="/site-user/professional">Professionals</Link>
                                        </li>
                                    </ol>
                                    <h2 className="breadcrumb-title">Professional Certificate</h2>
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
                                    <AdminProfessionalNav/>
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="border-bottom pb-3 mb-3">
                                                <h5>Certificate</h5>
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
                                                                    Certificate Name <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="certificate_name"
                                                                    className="form-control"
                                                                    value={formData.certificate_name}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter certificate name"
                                                                />
                                                                {formErrors.certificate_name && <div className="form-label text-danger m-1">{formErrors.certificate_name}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="form-wrap">
                                                                <label className="col-form-label">
                                                                Certificate Date <span className="text-danger">*</span>
                                                                </label>
                                                            <div className="form-icon">
                                                                <DatePicker
                                                                    className="form-control datetimepicker"
                                                                    name="certificate_date"
                                                                    selected={formData.certificate_date}
                                                                    onChange={(date) =>setFormData({ ...formData, certificate_date : date.toISOString().split('T')[0]})}
                                                                    dateFormat="MM/dd/yyyy"
                                                                    placeholderText="MM:DD:YYY"
                                                                    showDayMonthYearPicker
                                                                     
                                                                />
                                                                <span className="icon">
                                                                <i className="fa-regular fa-calendar-days" />
                                                                </span>
                                                            </div>
                                                            {formErrors.certificate_date && <div className="form-label text-danger m-1">{formErrors.certificate_date}</div>}
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
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Country <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="country"
                                                                    className="form-control"
                                                                    value={formData.country}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter country"
                                                                />
                                                                {formErrors.country && <div className="form-label text-danger m-1">{formErrors.country}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                Certificate File <span className="text-danger">*</span>
                                                                </label>
                                                                {updateForm ? (
                                                                <>
                                                                {formData.certificate_file && typeof formData.certificate_file === 'string' ? (
                                                                    <div className="mt-1">
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
                                                    
                                                        <div className="table-responsive">
                                                            <table className="table table-center mb-0 table-striped table-hover">
                                                                <thead className="bg-primary text-white">
                                                                    <tr className="bg-primary text-white">
                                                                        <th className="bg-primary text-white">Certificate Name</th>
                                                                        <th className="bg-primary text-white">Certificate Date</th>
                                                                        <th className="bg-primary text-white">City</th>
                                                                        <th className="bg-primary text-white">State</th>
                                                                        <th className="bg-primary text-white">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {certificates.length === 0 ?
                                                                        <tr><td colSpan={7}>No certificate data found for this professional</td></tr>
                                                                    :
                                                                    certificates.map((certificate) => (
                                                                        <tr key={certificate.id}>
                                                                            <td>{certificate.certificate_name}</td>
                                                                            <td>{new Date(certificate.certificate_date).toLocaleDateString()}</td>
                                                                            <td>{certificate.city}</td>
                                                                            <td>{certificate.state}</td>
                                                                            <td>
                                                                                <div className="action-item">
                                                                                    <Link to="#" onClick={() => updateCertificates(certificate.id)}>
                                                                                        <i className="isax isax-edit-2" />
                                                                                    </Link>
                                                                                    {/* <Link to="#">
                                                                                        <i className="isax isax-import" />
                                                                                    </Link> */}
                                                                                    <Link to="#" onClick={() => deleteCertificates(certificate.id)}>
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
            <MessagePopup title={"Certificate"} message={"Are you sure to delete the certificate"} close={handleClose} show={show} yes={handleYes} no={handleNo}/>
            <SiteFooter />
        </div>
    );
};

export default AdminProfessionalCertificate;
