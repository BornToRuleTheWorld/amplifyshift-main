import React, { useState, useEffect } from "react";
// import DashboardSidebar from "../sidebar/sidebar.jsx";
import DashboardSidebar from "../../../patients/dashboard/sidebar/sidebar.jsx";
// import IMG01 from "../../../../assets/images/patient.jpg";
import StickyBox from "react-sticky-box";
import { Link } from "react-router-dom";
import SiteFooter from "../../home/footer.jsx";
import SiteHeader from "../../home/header.jsx";
// import Header from "./header.jsx";
import { DatePicker } from "antd";
import Select from "react-select";
import ImageWithBasePath from "../../../../../core/img/imagewithbasebath.jsx";
//import ImageWithBasePath from "../../core/img/imagewithbasebath.jsx";
import ProfessionalNav from "./ProfessionalNav.jsx";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN, QAOptions } from "../../config";
import {convertToUS} from "../../utils"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import MessagePopup from "../../messagePopup.js";
import ProfessionalSidebar from "./ProfessionalSidebar.jsx";

const ProfessionalReference = (props) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        verifyQA(currentUserID,id)
        if (showMessage){
            setShow(true);
        }
    }

    const [showDelete, setShowDelete] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [deleteID, setDeleteID] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('name');

    const handleYes = () => {
    setShowDelete(false);
    setDeletePopup(true)
    }

    const handleNo = () => {
    setShowDelete(false);
    setDeletePopup(false)
    }

    const handleDeleteClose = () => setShowDelete(false);
    const handleDeleteShow = () => setShowDelete(true);


    const [reference, setReference] = useState([]);
    const [error, setError]         = useState(null);
    const [success, setSuccess]     = useState(null);
    
    const [refEmail, setRefMail]        = useState([])
    const [showRefMail, setShowRefMail] = useState(false)

    const [showMessage, setShowMessage] = useState(false)
    const [messageData, setMessageData] = useState([])

    const [isLoading, setIsLoading] = useState(false);
    const [updateForm, setUpdateForm] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const [phoneArea, setPhoneArea] = useState('')
    const [phonePrefix, setPhonePrefix] = useState('')
    const [phoneLine, setPhoneLine] = useState('')

    const currentUserID = atob(localStorage.getItem('RecordID')) || "";

    {/* Reference Add and List */}
    const [formData, setFormData] = useState({
        professional: currentUserID,
        name: "",
        email:"",
        occupation: "",
        relationship: "",
        address: "",
        address2: "",
        city: "",
        state:"",
        country:"",
        zipcode:"",
        phone_number:""
    });

    useEffect(() => {
        if (updateForm) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                ...updateForm,
            }));
            setPhoneArea(updateForm.phone_number.slice(0,3))
            setPhonePrefix(updateForm.phone_number.slice(3,6))
            setPhoneLine(updateForm.phone_number.slice(6,10))
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
            professional: currentUserID,
            name: "",
            email:"",
            occupation: "",
            relationship: "",
            address: "",
            address2: "",
            city: "",
            state:"",
            country:"",
            zipcode:"",
            phone_number:""
        });
        setUpdateForm(null);
        setPhoneArea('');
        setPhoneLine('');
        setPhonePrefix('');
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
                errorObj.name = "Reference name is required";
            }

            if (data.email == '') {
                errorObj.email = "Email is required";
            }else if(!emailRegx.test(data.email)) {
                errorObj.email = "Invalid email";
            }

            if (data.occupation == '') {
                errorObj.occupation = "Reference occupation is required";
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
            }

            if (phoneArea == '' || phonePrefix == '' || phoneLine == '') {
                errorObj.phone_number = "Phone number is required";
            }else{
                if (!Number.isInteger(parseInt(phoneArea)) || !Number.isInteger(parseInt(phonePrefix)) || !Number.isInteger(parseInt(phoneLine))) {
                    errorObj.phone_number = "Invalid phone number";
                }
            }

            if (phoneArea.length < 3 || phonePrefix.length < 3 || phoneLine.length < 4 ){
                errorObj.phone_number = "Invalid phone number";
              }

            // if (data.phone_number == '') {
            //     errorObj.phone_number = "Phone number is required";
            // }else{
            //     if (!phoneRegx.test(data.phone_number)) {
            //         errorObj.phone_number = "Invalid phone number";
            //     }
            // }           
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
           const updatedData = {...formData,phone_number:`${phoneArea}${phonePrefix}${phoneLine}`}
            try {
                //for create    
                let url = `${API_BASE_URL}/professional/references/`;
                let method = "POST";

                //for update
                if (updateForm) {
                    url = `${API_BASE_URL}/professional/references/${updateForm.id}/`;
                    method = "PATCH";
                }

                await axios({
                    method: method,
                    url: url,
                    data: updatedData,
                    headers: { 
                        "Content-Type": "application/json",
                        'Authorization': AUTH_TOKEN
                    }
                });
                handleCancel();
                fetchReference();
                method === "PATCH" ? setSuccess("Reference updated successfully") : setSuccess("Reference created successfully") 
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

    {/* Reference List */}
    const fetchReference = async () => {
        setError(null)
        setSuccess(null)
        setFormErrors({})
        try {
            const response = await axios.get(`${API_BASE_URL}/professional/references/?ProfID=${currentUserID}`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                 },
            });
            setReference(response.data);
            console.log("Reference",response.data)
        } catch (err) {
            setError(err.response?.data?.Result || "An error occurred");
        }
    };

    const updateReference = async (id) => {
        setError(null)
        setSuccess(null)
        setFormErrors({})
        const RefToUpdate = reference.find((ref) => ref.id === id);
        setUpdateForm(RefToUpdate)
    }

    const deleteReference = async (id) => {
        setError(null)
        setSuccess(null)
        setFormErrors({})
        handleDeleteShow()
        setDeleteID(id)
    };

    const removeReference = async(id) => {
        setError(null)
        setSuccess(null)
        setFormErrors({})
        try {
            await axios.delete(`${API_BASE_URL}/professional/references/${id}/`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            setReference(reference.filter((license) => license.id !== id));
            setSuccess("Reference deleted successfully")
        } catch (err) {
            alert("Error deleting license......");
        }finally{
            setDeletePopup(false)
        }
    }

    const verifyQA = async(currentUserID, ref_id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/professional/VerifyQA/?profID=${currentUserID}&refID=${ref_id}`,{
                headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_TOKEN
                }
            });

            if (response.status === 200){
                setMessageData(response.data.data)
                setShowMessage(true)
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }

    const refEmailData = (id) => {
        let mailData = []
        reference.map((ref) => {
            if (ref.id === id) {
                mailData = ref.reference_mails 
            }
        })
        setRefMail(mailData)
        setShowRefMail(true)
    }
    
    useEffect(() => {
        fetchReference();
    }, []);

    useEffect(() => {
        if(deletePopup){
            removeReference(deleteID);
        }
    }, [deletePopup]);

    const handleSort = (field) => {
        let newSortOrder = 'asc';
        if (sortField === field && sortOrder === 'asc') {
          newSortOrder = 'desc';
        }
        setSortOrder(newSortOrder);
        setSortField(field);
    
        const sortedData = [...reference].sort((a, b) => {
          if (field === 'name' || field === 'relationship' || field === 'occupation' ) {
            const nameA = a[field].toLowerCase();
            const nameB = b[field].toLowerCase();
            if (nameA < nameB) return newSortOrder === 'asc' ? -1 : 1;
            if (nameA > nameB) return newSortOrder === 'asc' ? 1 : -1;
            return 0;
          }
          return 0;
        });
    
        setReference(sortedData);
      };

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
                                    <h2 className="breadcrumb-title">Professional Reference</h2>
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
                                                <div className="form-label text-muted"><span className="text-danger">*</span>&nbsp;Minimum 3 references are required</div>
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
                                                                    Reference Name <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    className="form-control"
                                                                    value={formData.name}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter Reference name"
                                                                />
                                                                {formErrors.name && <div className="form-label text-danger m-1">{formErrors.name}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Reference Email <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="email"
                                                                    name="email"
                                                                    className="form-control"
                                                                    value={formData.email}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter Reference email"
                                                                />
                                                                {formErrors.email && <div className="form-label text-danger m-1">{formErrors.email}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Reference Occupation <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="occupation"
                                                                    className="form-control"
                                                                    value={formData.occupation}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter occupation"
                                                                />
                                                                {formErrors.occupation && <div className="form-label text-danger m-1">{formErrors.occupation}</div>}
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
                                                                <div className="row">
                                                                    <div className="col-4">
                                                                        <input
                                                                            type="text"
                                                                            maxLength={3}
                                                                            name="contact_phone_area"
                                                                            value={phoneArea ? phoneArea : ""}
                                                                            onChange={(e) => setPhoneArea(e.target.value)}
                                                                            className="form-control"
                                                                        />
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <input
                                                                            type="text"
                                                                            maxLength={3}
                                                                            name="contact_phone_prefix"
                                                                            value={phonePrefix ? phonePrefix : ""}
                                                                            onChange={(e) => setPhonePrefix(e.target.value)}
                                                                            className="form-control"
                                                                        />
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <input
                                                                            type="text"
                                                                            maxLength={4}
                                                                            name="contact_phone_line"
                                                                            value={phoneLine ? phoneLine : ""}
                                                                            onChange={(e) => setPhoneLine(e.target.value)}
                                                                            className="form-control"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {/* <input
                                                                    type="text"
                                                                    name="phone_number"
                                                                    className="form-control"
                                                                    value={formData.phone_number}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter Contact"
                                                                /> */}
                                                                {formErrors.phone_number && <div className="form-label text-danger m-1">{formErrors.phone_number}</div>}
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
                                                                        <th onClick={() => handleSort('name')} style={{ cursor: "pointer" }} className="bg-primary text-white">Reference Name {sortOrder === 'asc' ? '↑' : '↓'}</th>
                                                                        <th onClick={() => handleSort('occupation')} style={{ cursor: "pointer" }} className="bg-primary text-white">Reference Occupation {sortOrder === 'asc' ? '↑' : '↓'}</th>
                                                                        <th onClick={() => handleSort('relationship')} style={{ cursor: "pointer" }} className="bg-primary text-white">Relationship {sortOrder === 'asc' ? '↑' : '↓'}</th>
                                                                        <th className="bg-primary text-white">Contact</th>
                                                                        <th className="bg-primary text-white">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    { reference.length === 0 ?
                                                                        <tr><td colSpan={7}>No refernce data found for this professional</td></tr>
                                                                    :
                                                                    reference.map((reference) => (
                                                                        <tr key={reference.id}>
                                                                            <td>{reference.name}</td>
                                                                            <td>{reference.occupation}</td>
                                                                            <td>{reference.relationship}</td>
                                                                            <td>{`(${reference.phone_number.slice(0,3)})`}-{reference.phone_number.slice(3,6)}-{reference.phone_number.slice(6,10)}</td>
                                                                            <td>
                                                                                <div className="action-item">
                                                                                    <Link to="#" onClick={() => updateReference(reference.id)}>
                                                                                        <i className="isax isax-edit-2" />
                                                                                    </Link>
                                                                                    
                                                                                    <Link to="#" onClick={() => deleteReference(reference.id)}>
                                                                                        <i className="isax isax-trash" />
                                                                                    </Link>
                                                                                    {reference.reference_mails.length === 0 
                                                                                    ? 
                                                                                        null 
                                                                                    :
                                                                                        <Link to="#" onClick={() => refEmailData(reference.id)}>
                                                                                            <i className="isax isax-eye4" />
                                                                                        </Link>
                                                                                    }
                                                                                    
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    {showRefMail 
                                                    ?
                                                        <div className="custom-table mt-3">
                                                            <div className="table-responsive">
                                                                <table className="table table-center mb-0">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Mail Sent On</th>
                                                                            <th>Message</th>
                                                                            <th>Status</th>
                                                                            <th>Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {refEmail.length === 0 ? (
                                                                                <tr><td colSpan={3}>No reference mail data found</td></tr>
                                                                        ) : (
                                                                            refEmail.map((mail) => (
                                                                                <tr key={mail.id}>
                                                                                    <td>{convertToUS(mail.mail_sent_on, "DateTime")}</td>
                                                                                    <td><textarea id="reference" name="reference" className="form-control" rows="3" cols="50" value={mail.message} readOnly /></td>
                                                                                    <td>{mail.status}</td>
                                                                                    {mail.status === "Answered" ? (
                                                                                        <td>
                                                                                            <Button variant="primary" onClick={()=> handleShow(mail.reference)}>View answers</Button>
                                                                                        </td>
                                                                                    ) : (
                                                                                        <td>Not Answered Yet</td>
                                                                                    )}
                                                                                </tr>
                                                                            )))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    :
                                                        null
                                                    }
                                                    <Modal show={show} onHide={handleClose}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title> 
                                                                Mail answers
                                                            </Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                        {messageData.map((message, index) => {
                                                            const question = QAOptions.find(q => q.value === message.question);
                                                            return question ? (
                                                            <div key={message.id} className="row pb-2">
                                                                <div className="col-12 form-label">
                                                                    {index + 1}. {question.label}
                                                                </div>
                                                                {question.label === "Date of Employment?" ? (
                                                                    <div className="col-12 form-control">
                                                                        {convertToUS(message.answer, "Date")}
                                                                    </div>
                                                                ) : (
                                                                    <div className="col-12 form-control">{message.answer}</div>
                                                                )}
                                                            </div>
                                                            ) : null;
                                                        })}
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                        <Button variant="secondary" onClick={handleClose}>
                                                            Close
                                                        </Button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                {/* /Medical Records Tab */}

                                            </form>
                                        </div>
                                    </div>
                        </div>
                    </div>
                </div>
            </div>
            <MessagePopup title={"Reference"} message={"Are you sure to delete the reference"} close={handleDeleteClose} show={showDelete} yes={handleYes} no={handleNo}/>
            <SiteFooter />
        </div>
    );
};

export default ProfessionalReference;
