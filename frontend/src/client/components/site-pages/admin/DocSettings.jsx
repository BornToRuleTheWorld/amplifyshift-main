import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { FaTimesCircle, FaPen } from "react-icons/fa";
import { API_BASE_URL, AUTH_TOKEN, imageFormat } from "../config.js"
import MessagePopup from "../messagePopup.js";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
import SiteFooter from "../home/footer.jsx";
import SiteHeader from "../home/header.jsx";

const AdminDocumentation = (props) => {

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

    const [document, setDocument] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [updateForm, setUpdateForm] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    {/* document Add and Update */}
    
    const docStatus = [
        {value:"Yes",label:"Yes"},
        {value:"No",label:"No"},
    ] 

    const [formData, setFormData] = useState({
        setting_name: "",
        is_expired: "",
        status: "",
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
            setting_name: "",
            is_expired: "",
            status: "",
        });
        setUpdateForm(null);
        setFormErrors({});
        setError(null);
        setSuccess(null);
    };

    const validiteFormInputs = (data) => {
        const errorObj = {};
        if (Object.keys(data).length !== 0){
            if (data.name == '') {
                errorObj.name = "Document name is required";
            }

            if (data.status == '') {
                errorObj.status = "Status is required";
            }
        }
        return errorObj
    }
    
    {/* document Add and Update */}
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
                let url = `${API_BASE_URL}/professional/docsettings/`;
                let method = "POST";

                //for update
                if (updateForm) {
                    url = `${API_BASE_URL}/professional/docsettings/${updateForm.id}/`;
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
                    fetchDocument();
                    method === "PUT" ? setSuccess("Document updated successfully") : setSuccess("Document created successfully") 
                
            } catch (err) {
                console.log("Document error",err)
                setError(err.response?.data?.Result || "An error occurred");
            } finally {
                setIsLoading(false);
            }
        }else{
            setFormErrors(formValidate)
            return false;
        }
    };


    {/* document List */}
    const fetchDocument = async () => {
        setError(null)
        setSuccess(null)
        setFormErrors({})
        try {
            const response = await axios.get(`${API_BASE_URL}/professional/docsettings/`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                 },
            });
            console.log("docctaion List",response.data)
            setDocument(response.data);
        } catch (err) {
            setError(err.response?.data?.Result || "An error occurred");
        }
    };

    const deleteDocument = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        handleShow()
        setDeleteID(id)
    };

    const updateDocument = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        const documentToUpdate = document.find((doc) => doc.id === id);
        setUpdateForm(documentToUpdate)
    }

    const removeDocument = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        try {
            await axios.delete(`${API_BASE_URL}/professional/docsettings/${id}/`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            setDocument(document.filter((doc) => doc.id !== id));
            setSuccess("Document deleted successfully")
        } catch (err) {
            setError(err.response?.data?.Result || "Error deleting document");
        }finally{
            setDeletePopup(false)
        }
    }

    useEffect(() => {
        fetchDocument();
    }, []);

    useEffect(() => {
        if(deletePopup){
            removeDocument(deleteID);
        }
    }, [deletePopup]);

    const handleSort = (field) => {
        let newSortOrder = 'asc';
        if (sortField === field && sortOrder === 'asc') {
          newSortOrder = 'desc';
        }
        setSortOrder(newSortOrder);
        setSortField(field);
    
        const sortedData = [...document].sort((a, b) => {
          if (field === 'name' || field === 'course_name' ) {
            const nameA = a[field].toLowerCase();
            const nameB = b[field].toLowerCase();
            if (nameA < nameB) return newSortOrder === 'asc' ? -1 : 1;
            if (nameA > nameB) return newSortOrder === 'asc' ? 1 : -1;
            return 0;
          }
          return 0;
        });
    
        setDocument(sortedData);
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
                                            <Link to="/professional/dashboard">Admin</Link>
                                        </li>
                                        {/* <li className="breadcrumb-item active">
                                            <Link to="/professional/myprofile">Profile</Link>
                                        </li> */}
                                    </ol>
                                    <h2 className="breadcrumb-title">Documentation Settings</h2>
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
                    <div className="row border-0">
                        <div className="col-lg-12 col-xl-12">
                                    <div className="card border-0">
                                        <div className="card-body">
                                            {/* <div className="pb-3 mb-3">
                                                <h5>document</h5>
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
                                                        <div className="col-lg-7 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Name Of Document&nbsp;<span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="setting_name"
                                                                    className="form-control"
                                                                    value={formData.setting_name}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter Document name"
                                                                    
                                                                />
                                                                {formErrors.setting_name && <div className="form-label text-danger m-1">{formErrors.setting_name}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Status&nbsp;<span className="text-danger">*</span>
                                                                </label>
                                                                <Select
                                                                    className="select"
                                                                    name="status"
                                                                    options={docStatus}
                                                                    value={docStatus.find(option => option.value === formData.status) || null}
                                                                    onChange={(selected) => setFormData({...formData, status: selected.value})}
                                                                    placeholder="Select"
                                                                    isClearable={true}
                                                                    isSearchable={true}
                                                                    
                                                                />
                                                                {formErrors.status && <div className="form-label text-danger m-1">{formErrors.status}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-2 col-md-6">
                                                            <div className="mb-3 d-flex flex-column align-items-center justify-content-center h-100">
                                                                <label className="form-label mb-2 fw-semibold text-center">
                                                                Need Expired Date
                                                                </label>
                                                                <input
                                                                type="checkbox"
                                                                name="is_expired"
                                                                className="form-check-input"
                                                                checked={formData.is_expired}
                                                                onChange={(e) => setFormData({ ...formData, is_expired: e.target.checked })}
                                                                />
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
                                                <div className="mt-3">
                                                    {/* <div className="search-header">
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

                                                    </div> */}
                                                    
                                                        <div className="table-responsive">
                                                            <table className="table table-center mb-0 table-striped table-hover">
                                                                <thead className="bg-primary text-white">
                                                                    <tr className="bg-primary text-white">
                                                                        <th className="bg-primary text-white">Document Name</th>
                                                                        <th className="bg-primary text-white">Status</th>
                                                                        <th className="bg-primary text-white">Need Expired Date </th>
                                                                        <th className="bg-primary text-white">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    { document.length === 0 ?
                                                                        <tr><td colSpan={7}>No Documentation data found </td></tr>
                                                                    :
                                                                    document.map((document) => (
                                                                        <tr key={document.id}>
                                                                            <td>{document.setting_name}</td>
                                                                            <td>{document.status}</td>
                                                                            <td>{document.is_expired ? "Yes" :"No" }</td>
                                                                            <td>
                                                                                <div className="action-item">
                                                                                    <Link to="#" onClick={() => updateDocument(document.id)}>
                                                                                        <i className="isax isax-edit-2" />
                                                                                    </Link>
                                                                                    {/* <Link to="#">
                                                                                        <i className="isax isax-import" />
                                                                                    </Link> */}
                                                                                    <Link to="#" onClick={() => deleteDocument(document.id)}>
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
            <MessagePopup title={"Documentation Setting"} message={"Are you sure to delete the document"} close={handleClose} show={show} yes={handleYes} no={handleNo}/>
            <SiteFooter />
        </div>
    );
};

export default AdminDocumentation;
