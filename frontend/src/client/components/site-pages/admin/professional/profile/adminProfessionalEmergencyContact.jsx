import React, { useState, useEffect } from "react";
// import DashboardSidebar from "../sidebar/sidebar.jsx";
import DashboardSidebar from "../../../../patients/dashboard/sidebar/sidebar.jsx";
// import IMG01 from "../../../../assets/images/patient.jpg";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import SiteFooter from "../../../home/footer.jsx";
import SiteHeader from "../../../home/header.jsx";
// import Header from "./header.jsx";
import { DatePicker } from "antd";
import Select from "react-select";
import ImageWithBasePath from "../../../../../../core/img/imagewithbasebath.jsx";
//import ImageWithBasePath from "../../core/img/imagewithbasebath.jsx";
import AdminProfessionalNav from "./adminProfessionalNav.jsx";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN } from "../../../config";
import MessagePopup from "../../../messagePopup.js";

const AdminProfessionalEmergencyContact = (props) => {

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

    const [contact, setContact] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [updateForm, setUpdateForm] = useState(null);
    const currentUserID = atob(localStorage.getItem('adminProfID')) || "";
    const [formErrors, setFormErrors] = useState({});

    {/* Contract Add and Update */}
    const typeOptions = [
        {value:"Primary", label:"Primary"},
        {value:"Alternate", label:"Alternate"},
    ]

    const [formData, setFormData] = useState({
        professional: currentUserID,
        name: "",
        type: "",
        relationship: "",
        address: "",
        address2: "",
        city: "",
        state:"",
        country:"",
        phone_number:"",
        alt_phone:""
    });

    useEffect(() => {
        if (updateForm) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                ...updateForm,
            }));
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
            name: "",
            type: "",
            relationship: "",
            address: "",
            address2: "",
            city: "",
            state:"",
            country:"",
            zipcode:"",
            phone_number:"",
            alt_phone:""
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
                errorObj.name = "Contact name is required";
            }

            if (data.type == '') {
                errorObj.type = "Contact type is required";
            }

            if (data.relationship == '') {
                errorObj.relationship = "Relationship is required";
            }
            
            if (data.address == '') {
                errorObj.address = "Address is required";
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
            if (data.zipcode == '') {
                errorObj.zipcode = "Zipcode is required";
            }else if(!Number.isInteger(parseInt(data.zipcode))){
                errorObj.zipcode = "Not a valid zipcode";
            }

            if (data.phone_number == '') {
                errorObj.phone_number = "Phone number is required";
            }else if(!Number.isInteger(parseInt(data.phone_number))){
                errorObj.phone_number = "Not a valid phone number";
            }else{
                if (!phoneRegx.test(data.phone_number)) {
                    errorObj.phone_number = "Invalid phone number";
                }
            }

            if (data.phone_number == '') {
                errorObj.alt_phone = "Alternate phone number is required";
            }else if(!Number.isInteger(parseInt(data.alt_phone))){
                errorObj.alt_phone = "Not a valid alternate phone number";
            }else{
                if (!phoneRegx.test(data.alt_phone)) {
                    errorObj.alt_phone = "Invalid alternate number";
                }
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
                const updatedFormData = { ...formData, type: formData.type.value };

                //for create    
                let url = `${API_BASE_URL}/professional/contact/`;
                let method = "POST";

                //for update
                if (updateForm) {
                    url = `${API_BASE_URL}/professional/contact/${updateForm.id}/`;
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
                fetchContact();
                method === "PATCH" ? setSuccess("Contact updated successfully") : setSuccess("Contact created successfully")
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
    const fetchContact = async () => {
        setError(null);
        setSuccess(null)
        setFormErrors({})
        try {
            const response = await axios.get(`${API_BASE_URL}/professional/contact/?ProfID=${currentUserID}`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                 },
            });
            setContact(response.data);
        } catch (err) {
            setError(err.response?.data?.Result || "An error occurred");
        }
    };

    const deleteContact = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        handleShow()
        setDeleteID(id)
    };

    const updateContact = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        const contactToUpdate = contact.find((con) => con.id === id);
        setUpdateForm(contactToUpdate)
    }

    const removeContact = async(id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        try {
            await axios.delete(`${API_BASE_URL}/professional/contact/${id}/`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            setContact(contact.filter((license) => license.id !== id));
            setSuccess("Contact deleted successfully")
        } catch (err) {
            setError(err.response?.data?.Result || "Error deleting license");
        }finally{
            setDeletePopup(false)
        }
    }

    useEffect(() => {
        fetchContact();
    }, []);

    useEffect(() => {
        if(deletePopup){
            removeContact(deleteID);
        }
    }, [deletePopup]);
    {/* Contract List */}

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
                                            <Link to="/site-user/dashboard">Admin</Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            <Link to="/site-user/professional">Professionals</Link>
                                        </li>
                                    </ol>
                                    <h2 className="breadcrumb-title">Professional Contact</h2>
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
                                                <h5>Emergency</h5>
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
                                                                    Contact Name <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    className="form-control"
                                                                    value={formData.name}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter ContactForm name"
                                                                />
                                                                {formErrors.name && <div className="form-label text-danger m-1">{formErrors.name}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Contact Type <span className="text-danger">*</span>
                                                                </label>
                                                                <Select
                                                                    name="type"
                                                                    options={typeOptions}
                                                                    value={ updateForm ? typeOptions.find(option => option.value === formData.type) : formData.type}
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
                                                                    Relationship <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="relationship"
                                                                    className="form-control"
                                                                    value={formData.relationship}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter relationship"
                                                                />
                                                                {formErrors.relationship && <div className="form-label text-danger m-1">{formErrors.relationship}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Address <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="address"
                                                                    className="form-control"
                                                                    value={formData.address}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter address"
                                                                />
                                                                {formErrors.address && <div className="form-label text-danger m-1">{formErrors.address}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Address 2
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="address2"
                                                                    className="form-control"
                                                                    value={formData.address2}
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
                                                                <input
                                                                    type="text"
                                                                    name="phone_number"
                                                                    className="form-control"
                                                                    value={formData.phone_number}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter Contact"
                                                                />
                                                                {formErrors.phone_number && <div className="form-label text-danger m-1">{formErrors.phone_number}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Alternate Contact<span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="alt_phone"
                                                                    className="form-control"
                                                                    value={formData.alt_phone}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter Alternate Contact"
                                                                />
                                                                {formErrors.alt_phone && <div className="form-label text-danger m-1">{formErrors.alt_phone}</div>}
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
                                                                        <th className="bg-primary text-white">Contact Name</th>
                                                                        <th className="bg-primary text-white">Contact Type</th>
                                                                        <th className="bg-primary text-white">Relationship</th>
                                                                        <th className="bg-primary text-white">Contact Number</th>
                                                                        <th className="bg-primary text-white">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {contact.length === 0 ?
                                                                        <tr><td colSpan={7}>No contact data found for this professional</td></tr>
                                                                    :
                                                                    contact.map((contact) => (
                                                                        <tr key={contact.id}>
                                                                            <td>{contact.name}</td>
                                                                            <td>{contact.type}</td>
                                                                            <td>{contact.relationship}</td>
                                                                            <td>{contact.phone_number}</td>
                                                                            <td>
                                                                                <div className="action-item">
                                                                                    <Link to="#" onClick={() => updateContact(contact.id)}>
                                                                                        <i className="isax isax-edit-2" />
                                                                                    </Link>
                                                                                    
                                                                                    <Link to="#" onClick={() => deleteContact(contact.id)}>
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
            <MessagePopup title={"Emergency Contact"} message={"Are you sure to delete the contact"} close={handleClose} show={show} yes={handleYes} no={handleNo}/>
            <SiteFooter />
        </div>
    );
};

export default AdminProfessionalEmergencyContact;
