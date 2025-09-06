import React, { useState, useEffect,useRef } from "react";
import { Link } from "react-router-dom";
import SiteFooter from "../../home/footer.jsx";
import SiteHeader from "../../home/header.jsx";
// import Header from "./header.jsx";
import Select from "react-select";
import ImageWithBasePath from "../../../../../core/img/imagewithbasebath.jsx";
//import ImageWithBasePath from "../../core/img/imagewithbasebath.jsx";
import ProfessionalNav from "./ProfessionalNav.jsx";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN, imageFormat } from "../../config";
import convertUrlToFile from "../../convertToFile";
import MessagePopup from "../../messagePopup.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { convertToUS } from "../../utils.js";
import ProfessionalSidebar from "./ProfessionalSidebar.jsx";
import StickyBox from "react-sticky-box";

const ProfessionalDocument = (props) => {

    const currentTimeStamp = new Date().toISOString().replace(/[:.]/g, '-');

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

    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [updateForm, setUpdateForm] = useState(null);
    const currentUserID = atob(localStorage.getItem('RecordID')) || "";
    const [formErrors, setFormErrors] = useState({});
    const [docSettings, setDocSettings] = useState([])
    const [settingOption, setSettingOption] = useState([])
    const [expDate, setExpDate] = useState(null);
    const fileInputRef = useRef(null);
    {/* document Add and Update */}

    const [formData, setFormData] = useState({
        professional: currentUserID,
        prof_doc_setting: "",
        doc_expire_date :"",
        doc_file: null,
        status:"Inactive"
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

    const handleSelect = (value,name) =>{
        setFormData({
            ...formData,
            [name]:value
        })
        setExpDate(docSettings.find(option => option.id == value).is_expired)
    }

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            doc_file: e.target.files[0],
        });
    };

    const handleCancel = () => {
        setFormData({
            professional: currentUserID,
            prof_doc_setting: "",
            doc_expire_date :"",
            doc_file: null,
            status:"Inactive"
        });
        setUpdateForm(null);
        setFormErrors({});
        setError(null);
        setSuccess(null);

        const fileInput = document.querySelector('input[name="doc_file"]');
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const validiteFormInputs = (data) => {
      
        const errorObj = {};
        const todayData = new Date()

        if (Object.keys(data).length !== 0){
            if (data.prof_doc_setting == '') {
                errorObj.prof_doc_setting = "Document name is required";
            }
            
            if (expDate){
                if (data.doc_expire_date == '') {
                    errorObj.doc_expire_date = "Expire data is required";
                }else{
                    if (new Date(data.doc_expire_date ).getTime() <= todayData.getTime()){
                        errorObj.doc_expire_date = "Expire date must be a future date. Please select a date after today.";
                    }
                }
            }
            
            console.log("File",data.doc_file)
            if (data.doc_file){
                if (data.doc_file instanceof File){
                    if(!imageFormat.includes(data.doc_file.type)){
                        errorObj.doc_file = "File format is not supported only (.doc, .pdf, .jpeg, .png)"
                    }
                    else if (data.doc_file.size === 0){
                        errorObj.doc_file = "File must not be empty"
                    }
                }
            }else{
                errorObj.doc_file = "Please choose a file"
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

                const updatedData = {...formData,doc_expire_date: formData.doc_expire_date ? moment(formData.doc_expire_date).format('YYYY-MM-DD') : formData.doc_expire_date}
                
                let fileError = false
                const formDataObj = new FormData();
                for (const key in updatedData) {
                    if (key === "doc_file" && updatedData[key]) {
                        let file_base_name = '';
                        let file_ext = '';
                        let file = null;

                        if (typeof updatedData[key] === 'string') {
                            const fullFileName = updatedData[key].split('/').pop();
                            const lastDotIndex = fullFileName.lastIndexOf('.');
                            file_base_name = fullFileName.substring(0, lastDotIndex).split('-')[0];
                            file_ext = fullFileName.substring(lastDotIndex + 1);

                            const file_name = `${file_base_name}-${currentTimeStamp}.${file_ext}`;
                            file = await convertUrlToFile(updatedData[key], file_name);

                        } else if (updatedData[key] instanceof File) {
                            const originalFile = updatedData[key];
                            const fullFileName = originalFile.name;
                            const lastDotIndex = fullFileName.lastIndexOf('.');
                            file_base_name = fullFileName.substring(0, lastDotIndex);
                            file_ext = fullFileName.substring(lastDotIndex + 1);

                            const file_name = `${file_base_name}-${currentTimeStamp}.${file_ext}`;

                            file = new File([originalFile], file_name, {
                                type: originalFile.type,
                                lastModified: originalFile.lastModified,
                            });
                        }

                        if (file) {
                            formDataObj.append(key, file);
                        } else {
                            console.error("File processing failed for:", updatedData[key]);
                        }
                    } else {
                        const value = updatedData[key];
                        formDataObj.append(key, value === 'null' || value === null ? '' : value);
                    }
                }

                
                //for create    
                let url = `${API_BASE_URL}/professional/document/`;
                let method = "POST";

                //for update
                if (updateForm) {
                    url = `${API_BASE_URL}/professional/document/${updateForm.id}/`;
                    method = "PATCH";
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
                    fetchDocument();
                    fetchDocSettings();
                    method === "PATCH" ? setSuccess("Document updated successfully") : setSuccess("Document created successfully") 
                }                
            } catch (err) {
                console.log("document error",err)
                setError(err.response?.data?.Result || "An error occurred");
            } finally {
                setIsLoading(false);
            }
        }else{
            setFormErrors(formValidate)
            return false;
        }
    };

    // Documentation settings
    const fetchDocSettings = async () => {
        setError(null)
        setSuccess(null)
        setFormErrors({})
        try {
            const response = await axios.get(`${API_BASE_URL}/professional/docsettings/?Status=Yes`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                 },
            });
            console.log("Eductaion List",response.data)
            setDocSettings(response.data);
        } catch (err) {
            setError(err.response?.data?.Result || "An error occurred");
        }
    };

    {/* document List */}
    const fetchDocument = async () => {
        setError(null)
        setSuccess(null)
        setFormErrors({})
        try {
            const response = await axios.get(`${API_BASE_URL}/professional/document/?ProfID=${currentUserID}`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                 },
            });
            console.log("Eductaion List",response.data)
            setDocuments(response.data);
            fetchDocSettings();
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
        const documentToUpdate = documents.find((edu) => edu.id === id);
        setUpdateForm(documentToUpdate)
    }

    const removeDocument = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        try {
            await axios.delete(`${API_BASE_URL}/professional/document/${id}/`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            setDocuments(documents.filter((license) => license.id !== id));
            setSuccess("document deleted successfully")
        } catch (err) {
            setError(err.response?.data?.Result || "Error deleting license");
        }finally{
            setDeletePopup(false)
        }
    }

    useEffect(() => {
        fetchDocument();
        fetchDocSettings();
    }, []);

    useEffect(() => {
        if(deletePopup){
            removeDocument(deleteID);
        }
    }, [deletePopup]);


    useEffect(()=>{
        if(docSettings){
            setSettingOption(docSettings.map((doc)=>{
                return {value:doc.id, label:doc.setting_name}
            }))
        }
    },[docSettings])

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
    
        setDocuments(sortedData);
      };
    
    console.log("formData",formData)
    console.log("settingOption",settingOption)
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
                                    <h2 className="breadcrumb-title">Documents</h2>
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
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="mb-1">
                                                                <label className="form-label">
                                                                   Document Name&nbsp;<span className="text-danger">*</span>
                                                                </label>
                                                                <Select
                                                                    className="select"
                                                                    name="prof_doc_setting"
                                                                    options={settingOption}
                                                                    value={settingOption.find(option => option.value === formData.prof_doc_setting) || null}
                                                                    onChange={(selected) => handleSelect(selected.value, 'prof_doc_setting')}
                                                                    placeholder="Select"
                                                                    isClearable={true}
                                                                    isSearchable={true}
                                                                    
                                                                />
                                                                {formErrors.prof_doc_setting && <div className="form-label text-danger m-1">{formErrors.prof_doc_setting}</div>}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="col-lg-6 col-md-6">
                                                            <div className="form-wrap">
                                                            <label className="form-label">
                                                                Expire Date <span className="text-danger">*</span>
                                                            </label>
                                                            <div className="form-icon">
                                                                <DatePicker
                                                                    className="form-control datetimepicker"
                                                                    name="doc_expire_date"
                                                                    selected={formData.doc_expire_date}
                                                                    onChange={(date) => setFormData({...formData, doc_expire_date: date})}
                                                                    dateFormat="MM/dd/yyyy"
                                                                    showDayMonthYearPicker
                                                                    autoComplete='off'
                                                                />
                                                                <span className="icon">
                                                                <i className="fa-regular fa-calendar-days" />
                                                                </span>
                                                            </div>
                                                            {formErrors.doc_expire_date && <div className="form-label text-danger m-1">{formErrors.doc_expire_date}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12 col-md-6">
                                                            <div className="mb-1">
                                                                <label className="form-label">
                                                                    Document (or) Certificate:
                                                                </label>
                                                                {updateForm ? (
                                                                <>
                                                                {formData.doc_file && typeof formData.doc_file === 'string' ? (
                                                                    <div style={{marginTop:"5px"}}>
                                                                        <label>Currently: </label>
                                                                        <a href={formData.doc_file} target="_blank" rel="noopener noreferrer">
                                                                            {formData.doc_file.split("/").pop()}
                                                                        </a>
                                                                        <button 
                                                                            type="button" 
                                                                            className="btn btn-danger m-1" 
                                                                            onClick={() => setFormData({ ...formData, doc_file: "" })}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                ) : null}
                                                                </>
                                                                ):null}
                                                                <input
                                                                    type="file"
                                                                    name="doc_file"
                                                                    className="form-control"
                                                                    onChange={handleFileChange}
                                                                    
                                                                />
                                                                (.doc, .pdf, .jpeg, .png)
                                                                {formErrors.doc_file && <div className="form-label text-danger m-1">{formErrors.doc_file}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-6 ">
                                                            <div className="mb-1">
                                                                <div className="form-check mt-4">
                                                                    <label className="form-label" htmlFor="checkbox-sm-medical">
                                                                        Need Expired Date
                                                                    </label>
                                                                    <input
                                                                        className="form-check-input border"
                                                                        type="checkbox"
                                                                        id="checkbox-sm-medical"
                                                                        checked={expDate}
                                                                        readOnly
                                                                    />
                                                                    
                                                                </div>
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
                                                                        <th className="bg-primary text-white">Document (or) Certificate</th>
                                                                        <th className="bg-primary text-white">Expire Date</th>
                                                                        <th className="bg-primary text-white">Status</th>
                                                                        <th className="bg-primary text-white">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    { documents.length === 0 ?
                                                                        <tr><td colSpan={7}>No document data found for this professional</td></tr>
                                                                    :
                                                                    documents.map((document) => (
                                                                        <tr key={document.id}>
                                                                            <td>{settingOption.find(option => option.value === document.prof_doc_setting)?.label}</td>
                                                                            <td><a href={document.doc_file} target="_blank" rel="noopener noreferrer">{document.doc_file.split("/").pop()}</a></td>
                                                                            <td>{document.doc_expire_date ? convertToUS(document.doc_expire_date, 'Date') : "N/A"}</td>
                                                                            <td>{document.status}</td>
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
            <MessagePopup title={"Documentation"} message={"Are you sure to delete the document"} close={handleClose} show={show} yes={handleYes} no={handleNo}/>
            <SiteFooter />
        </div>
    );
};

export default ProfessionalDocument;
