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
import { API_BASE_URL, AUTH_TOKEN, cntryOptions, stateOptions, skillsOptions} from "../../config";
import MessagePopup from "../../messagePopup.js";
import moment from 'moment';
import { FaPlus } from "react-icons/fa";

const ProfessionalSkills = (props) => {

    const [show, setShow] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('name');
    const [isMedical, setIsMedical] = useState(false)
    const [otherSkillsInput, setOtherSkillsInput] = useState([""]);
    
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

    const [skills, setSkills] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [updateForm, setUpdateForm] = useState(null);
    const currentUserID = atob(localStorage.getItem('RecordID')) || "";
    const [formErrors, setFormErrors] = useState({});
    const [other, setOther] = useState(false)

    const handleCheckboxChangeInt = (field) => (event) => {
        const { value, checked } = event.target;
      
        setFormData(prevState => {
          const updatedField = checked
            ? [...prevState[field], parseInt(value)]
            : prevState[field].filter(item => item !== parseInt(value));
      
          return {
            ...prevState,
            [field]: updatedField
          };
        });
        
      };

    const [formData, setFormData] = useState({
        professional: currentUserID,
        typing_speed: "",
        is_medical_terminology: false,
        office_machines: "",
        computer_skills:[],
        other_skills: [],
    });

    useEffect(() => {
        const otherValue = skillsOptions.find(option => option.label === "Other")?.value;
        if (formData.computer_skills.includes(otherValue)) {
            setOther(true);
        } else {
            setOther(false);
        }
    }, [formData.computer_skills]);

    useEffect(() => {
        if (updateForm) {        
            const parsedOtherSkills = updateForm.other_skills
                ? updateForm.other_skills.split(',').map(skill => skill.trim())
                : [];
    
            setFormData((prevFormData) => ({
                ...prevFormData,
                ...updateForm,
                other_skills: parsedOtherSkills,
            }));
    
            setOtherSkillsInput(parsedOtherSkills);

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
            typing_speed: "",
            is_medical_terminology: false,
            office_machines: "",
            computer_skills:[],
            other_skills: [],
        });
        setUpdateForm(null);
        setFormErrors({});
        setError(null);
        setSuccess(null);
        setIsMedical(false)
    };

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            other_skills: otherSkillsInput.filter(skill => skill.trim() !== "")
        }));
    }, [otherSkillsInput]);
    
    const handleAddOtherSkill = () => {
        setOtherSkillsInput([...otherSkillsInput, ""]);
    };
    
    const handleRemoveOtherSkill = (index) => {
        const updated = [...otherSkillsInput];
        updated.splice(index, 1);
        setOtherSkillsInput(updated);
    };
    
    const handleOtherSkillChange = (index, value) => {
        const updated = [...otherSkillsInput];
        updated[index] = value;
        setOtherSkillsInput(updated);
    };
    

    const validiteFormInputs = (data) => {
        const errorObj = {}; 
        if (Object.keys(data).length !== 0){
            if (data.typing_speed == '') {
                errorObj.typing_speed = "Please mention the typing speed";
            }else if (!Number.isInteger(parseInt(data.typing_speed))){
                errorObj.typing_speed = "Invalid typing speed";
            }

            if (data.typing_speed == '') {
                errorObj.typing_speed = "Please mention the typing speed";
            }

            if (data.office_machines == '') {
                errorObj.office_machines = "Office Machines is required";
            }
            
            if (data.computer_skills.length === 0) {
                errorObj.computer_skills = "Computer skills is required";
            }
        }
        return errorObj
    }

     {/* Skills Add and Update */}
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
                //for create    
                let url = `${API_BASE_URL}/professional/skills/`;
                let method = "POST";
                
                //for update
                if (updateForm) {
                    url = `${API_BASE_URL}/professional/skills/${updateForm.id}/`;
                    method = "PATCH";
                }

                const data = {...formData, other_skills:formData.other_skills.map(skill => {return skill.trim()}).join(', ')}

                await axios({
                    method: method,
                    url: url,
                    data: data,
                    headers: { 
                        "Content-Type": "application/json",
                        'Authorization': AUTH_TOKEN
                    }
                });
                handleCancel();
                fetchSkills();
                method === "PATCH" ? setSuccess("Skills updated successfully") : setSuccess("Skills created successfully")
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


    {/* Skills List */}
    const fetchSkills = async () => {
        setError(null);
        setSuccess(null)
        setFormErrors({})
        try {
            const response = await axios.get(`${API_BASE_URL}/professional/skills/?ProfID=${currentUserID}`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                 },
            });
            console.log("Skills List", response.data)
            setSkills(response.data);
        } catch (err) {
            setError(err.response?.data?.Result || "An error occurred");
        }
    };

    const deleteSkills = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        handleShow()
        setDeleteID(id)
    };

    const updateSkills = async (id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        const skillsToUpdate = skills.find((con) => con.id === id);
        setUpdateForm(skillsToUpdate)
    }

    const removeSkills = async(id) => {
        setError(null);
        setSuccess(null);
        setFormErrors({})
        try {
            await axios.delete(`${API_BASE_URL}/professional/skills/${id}/`,{
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': AUTH_TOKEN
                },
            });
            setSkills(skills.filter((license) => license.id !== id));
            setSuccess("Skills deleted successfully")
        } catch (err) {
            setError(err.response?.data?.Result || "Error deleting skills..");
        }finally{
            setDeletePopup(false)
        }
    }

    useEffect(() => {
        fetchSkills();
    }, []);

    useEffect(() => {
        if(deletePopup){
            removeSkills(deleteID);
        }
    }, [deletePopup]);
    
    const handleSort = (field) => {
        let newSortOrder = 'asc';
        if (sortField === field && sortOrder === 'asc') {
          newSortOrder = 'desc';
        }
        setSortOrder(newSortOrder);
        setSortField(field);
    
        const sortedData = [...skills].sort((a, b) => {
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
    
        setSkills(sortedData);
    };
      console.log("skills data",formData)
    return (
        <div>
            <div className="content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-xl-12">
                                    <div className="card">
                                        <div className="card-body">
                                            
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
                                                <div className="setting-title">
                                                    <h6>Clerical Skills</h6>
                                                </div>
                                                <div className="setting-card">
                                                    <div className="row">
                                                        <div className="col-lg-4 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Typing Speed <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="typing_speed"
                                                                    className="form-control"
                                                                    value={formData.typing_speed}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter typing speed"
                                                                />
                                                                {formErrors.typing_speed && <div className="form-label text-danger m-1">{formErrors.typing_speed}</div>}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-5 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                Office Machines <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="office_machines"
                                                                    className="form-control"
                                                                    value={formData.office_machines}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter office machines"
                                                                />
                                                                {formErrors.office_machines && <div className="form-label text-danger m-1">{formErrors.office_machines}</div>}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="col-lg-3 col-md-6 ">
                                                            <div className="mb-3">
                                                                <div className="form-check mt-4">
                                                                    <label className="form-label" htmlFor="checkbox-sm-medical">
                                                                        Medical Terminology
                                                                    </label>
                                                                    <input
                                                                        className="form-check-input border"
                                                                        type="checkbox"
                                                                        id="checkbox-sm-medical"
                                                                        checked={formData.is_medical_terminology}
                                                                        onChange={(e) =>
                                                                            setFormData({ ...formData, is_medical_terminology: e.target.checked })
                                                                        }
                                                                    />
                                                                    
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="setting-title">
                                                    <h6>Computer Skills</h6>
                                                </div>
                                                <div className="setting-card">
                                                    <div className="row">
                                                        <div className="col-lg-12 col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    Computer skills <span className="text-danger">*</span>
                                                                </label>
                                                                <div className="row">
                                                                    {skillsOptions.map((option, index) => (
                                                                        <div className="col-md-auto mb-2" key={option.value}>
                                                                        <div className="form-check">
                                                                            <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            id={`checkbox-sm-${option.value}`}
                                                                            value={option.value}
                                                                            checked={formData.computer_skills.includes(option.value)}
                                                                            onChange={handleCheckboxChangeInt('computer_skills')}
                                                                            />
                                                                            <label
                                                                            className="form-check-label"
                                                                            htmlFor={`checkbox-sm-${option.value}`}
                                                                            >
                                                                            {option.label}
                                                                            </label>
                                                                        </div>
                                                                        </div>
                                                                    ))}
                                                                    </div>

                                                                {formErrors.computer_skills && <div className="form-label text-danger m-1">{formErrors.computer_skills}</div>}
                                                            </div>
                                                        </div>
                                                        {other && (
                                                        <div className="col-lg-12">
                                                            <label className="form-label">Other Skills</label>
                                                            {otherSkillsInput.map((input, index) => (
                                                            <div key={index} className="d-flex mb-2 align-items-center">
                                                                <input
                                                                type="text"
                                                                className="form-control me-2"
                                                                placeholder={`Other skill ${index + 1}`}
                                                                value={input}
                                                                onChange={(e) => handleOtherSkillChange(index, e.target.value)}
                                                                />
                                                                <button
                                                                type="button"
                                                                className="btn btn-white btn-sm"
                                                                onClick={() => handleRemoveOtherSkill(index)}
                                                                >
                                                                <i className="fa fa-trash text-danger" style={{fontSize:"17px"}}></i>
                                                                </button>
                                                            </div>
                                                            ))}&nbsp;&nbsp;&nbsp;
                                                            <button
                                                            type="button"
                                                            className="btn btn-sm btn-primary"
                                                            onClick={handleAddOtherSkill}
                                                            >
                                                            <FaPlus className="text-white"/>&nbsp;
                                                            Add Skill
                                                            </button>
                                                        </div>
                                                    )}

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
                                                                        <th className="bg-primary text-white">Typing Speed(WPM)</th>
                                                                        <th className="bg-primary text-white">Medical Terminology</th>
                                                                        <th className="bg-primary text-white">Office Machines</th>
                                                                        <th className="bg-primary text-white">Computer skills</th>
                                                                        <th className="bg-primary text-white">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {skills.length === 0 ?
                                                                        <tr><td colSpan={7}>No skills data found for this professional</td></tr>
                                                                    :
                                                                    skills.map((skills) => (
                                                                        <tr key={skills.id}>
                                                                            <td>{skills.typing_speed}</td>
                                                                            <td>{skills.is_medical_terminology ? "Yes" : "No"}</td>
                                                                            <td>{skills.office_machines}</td>
                                                                            <td>{skills.computer_skills.map(skills => {
                                                                                const option =  skillsOptions.find(option => option.value === skills)
                                                                                return option ? option.label : null
                                                                            }).join(', ') || 'N/A' }</td>
                                                                            <td>
                                                                                <div className="action-item">
                                                                                    <Link to="#" onClick={() => updateSkills(skills.id)}>
                                                                                        <i className="isax isax-edit-2" />
                                                                                    </Link>
                                                                                    
                                                                                    <Link to="#" onClick={() => deleteSkills(skills.id)}>
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
            <MessagePopup title={"Professional Skills"} message={"Are you sure to delete the skills"} close={handleClose} show={show} yes={handleYes} no={handleNo}/>
        </div>
    );
};

export default ProfessionalSkills;
