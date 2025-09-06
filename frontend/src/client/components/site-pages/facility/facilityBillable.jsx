import React, {useState, useEffect} from "react";
import SiteHeader from "../home/header.jsx";
import SiteFooter from "../home/footer.jsx";
import { Link, useHistory} from "react-router-dom";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
import axios from "axios";
import {AUTH_TOKEN, API_BASE_URL, disciplineOptions, contractHourOptions, ColourOption, SingleValue, MultiValueLabel} from '../config';
import {convertTo12HourFormat} from "../utils";
import Select from "react-select";
import { getCurrentUserDiscipline } from "../utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AdminPagination from "../admin/AdminPagination.jsx";
import moment from 'moment';
import FacilityNav from "./facilityNav.jsx";
import FacilitySidebar from "./facilitySidebar.jsx";
import StickyBox from "react-sticky-box";

const FacilityBillable = (props) => {
  
  const userEmail = atob(localStorage.getItem('email')) || ""
  const [showWorkHours, setShowWorkHours] = useState(false);
  const FacID = atob(localStorage.getItem('RecordID')) || "";
  const [facData, setFacData] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [fetchSlot, setFetchSlot] = useState(false);
  const [slotID, setSlotID] = useState({slot_ids: []});
  const [error, setError] = useState(null);
  const [selectedSlotIds, setSelectedSlotIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [professional, setProfessional] = useState(null);
  const [srchContract, setSrchContract] = useState(null);
  const [srchDiscipline, setSrchDiscipline] = useState([])
  const [contractProfOptions, setContractProfOptions] = useState([]);
  const [contractOptions, setContractOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [srchKeyword, setSrchKeyword] = useState(null)

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const history = useHistory();
  const disciplineOptions = getCurrentUserDiscipline()

  const handleCheckboxChange = (slotId) => {
    setSelectedSlotIds(prev => 
      prev.includes(slotId)
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  const viewJob = async (id) => {
    localStorage.setItem("currentJobID",btoa(id))
    history.push("/facility/viewjob") 
  }

  const handleProfView = (email,id) => {
    localStorage.setItem("searchProfEmail",btoa(email))
    localStorage.setItem("searchProfID",btoa(id))
    history.push("/facility/professionalProfile")
  }

  const handleSelectAll = () => {
    const selectableIds = facData
      .filter(slot => !['Cancelled', 'Completed'].includes(slot.status))
      .map(slot => slot.slot_id);

    if (selectedSlotIds.length === selectableIds.length) {
      setSelectedSlotIds([]);
    } else {
      setSelectedSlotIds(selectableIds);
    }
  };

  const getCurrentFacility = async() => {
    axios.get(`${API_BASE_URL}/facility/GetFacility/?FacEmail=${userEmail}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_TOKEN,
      }
    })
    .then((response) => {
      localStorage.setItem("RecordID", btoa(response.data.data.id))
      const encoded = btoa(JSON.stringify(response.data.data.Discipline));
      localStorage.setItem("currentDiscipline", encoded);
    })
    .catch((err) => {
      console.error('Error:', err);
    });
  }

  const getContractHours = async(id, status) => {

    const data = {
      FacID : id,
      Status: "Completed",
      Discipline: srchDiscipline,
      StartDate : startDate ? moment(startDate).format("YYYY-MM-DD") : null,
      EndDate : endDate ? moment(endDate).format("YYYY-MM-DD") : null,
      ConProfID : professional,
      Keyword: srchKeyword,
      CurrentPage : currentPage,
      RecordsPerPage : recordsPerPage
    }
    axios.post( `${API_BASE_URL}/contract/GetUserContractHours/`, data,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_TOKEN,
      }
    })
    .then((response) => {
      setFacData(response.data.data);
      if (response.data.current_page) setCurrentPage(response.data.current_page);
      if (response.data.records_per_page) setRecordsPerPage(response.data.records_per_page);
      if (response.data.total_count) setTotalPages(response.data.total_count);
      if (response.data.con_search_options) setContractOptions(response.data.con_search_options);
      const extractedSlotIds = response.data.data ? response.data.data.map(slot => slot.slot) : [];
      setSlotID({ slot_ids: extractedSlotIds });
      setFetchSlot(true)
    })
    .catch((err) => {
      console.error('Error fetching facility data:', err)
    });
  }

  const handleStatusUpdate = async (status, slotId = null) => {
    const idsToUpdate = slotId ? [slotId] : selectedSlotIds;
  
    if (idsToUpdate.length === 0) {
      alert("No slots selected.");
      return;
    }
  
    const data = {
          HourID: idsToUpdate,
          UserType: "Professional",
          HourStatus: status
        }
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/contract/ContractWorkHourStatus/`,data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
          }
        }
      );
  
      if (response.status === 200 && response.data.Status.Code === "Success") {
        alert("Status updated successfully");
        setSelectedSlotIds([]);
        getContractHours(FacID,statusFilter)
      } else {
        alert("Failed: " + (response.data?.Result || 'Unknown error'));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status");
    }
  };

  const getProfessionals =  async(id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/facility/GetContractProf/?FacID=${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
          }
        }
      );
  
      if (response.status === 200 && response.data.Status.Code === "Success") {
        console.log("response.data", response.data.data)
        const options = response.data.data.map((prof) => {
          return{
            value: prof.id,
            label: prof.name
          }
        })
        setContractProfOptions(options)
      } 
    } catch (error) {
      console.error("Error getProfessionals:", error);
      alert("An error occurred while getting professionals");
    }
  }

  useEffect(() => {
    if (fetchSlot) {
      axios
        .post(`${API_BASE_URL}/GetSlot/`, slotID, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN,
          }
        })
        .then((response) => {
          setSlotData(response.data.data);
        })
        .catch((err) => {
          console.error('Error fetching slot data:', err);
          setError(err.response.data.Result)
        });
    }
  }, [fetchSlot]);

  const handleSearchSubmit = async(e) => {
    e.preventDefault();
    await getContractHours(FacID,statusFilter)
  }

  useEffect(() => {
    getCurrentFacility()
  }, [userEmail]);

  useEffect(() => {
    getContractHours(FacID,statusFilter)
    getProfessionals(FacID)
  }, [FacID, AUTH_TOKEN, currentPage]);

  return (
    <div>
      <SiteHeader {...props} />
      <>
        {/* Breadcrumb */}
        <div className="breadcrumb-bar">
          <div className="container">
            <div className="row align-items-center inner-banner">
              <div className="col-md-12 col-12 text-center">
                <nav aria-label="breadcrumb" className="page-breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/home">
                        <i className="isax isax-home-15" />
                      </a>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                     <Link to="/facility/dashboard">Facility</Link>
                    </li>
                    <li className="breadcrumb-item active">Profile</li>
                  </ol>
                  <h2 className="breadcrumb-title">Billable</h2>
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

      {/* Page Content */}
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
                <form onSubmit={handleSearchSubmit}>
                  <div className="row mb-3 mt-1"> 
                    <div className="col-4 p-1">
                      <label className="form-label">Disciplines</label>
                      <Select
                      isMulti
                      name="srchDiscipline"
                      classNamePrefix="react-select"
                      placeholder="Select Disciplines"
                      value={disciplineOptions.filter(option => srchDiscipline.includes(option.value))}
                      options={disciplineOptions}
                      onChange={(selectedOptions) => {
                          const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                          setSrchDiscipline(values);
                      }}
                      isClearable={true}
                      components={{ Option: ColourOption, SingleValue, MultiValueLabel }}
                      styles={{
                          menuPortal: base => ({ ...base, zIndex: 9999 }),
                          menu: base => ({ ...base, zIndex: 9999 })
                      }}
                      />
                    </div>
                    <div className="col-4 p-1">
                      <label className="form-label">Professional</label>
                      <Select
                        name="professional"
                        classNamePrefix="react-select"
                        placeholder="Select Professional"
                        value={professional ? contractProfOptions.find(status => status.value === professional) : null}
                        options={contractProfOptions}
                        onChange={(selected) => setProfessional(selected ? selected.value : null)}
                        isClearable={true}
                      />
                    </div>
                    <div className="col-4 p-1">
                      <label className="form-label">Start Date</label>
                      <div className="form-wrap">
                        <div className="form-icon">
                        <DatePicker
                        className="form-control datetimepicker"
                        name="start_date"
                        minDate={new Date()}
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="MM/dd/yyyy"
                        showDayMonthYearPicker
                        autoComplete='off'
                        placeholderText="Start Date"
                        />
                          <span className="icon">
                            <i className="fa-regular fa-calendar-days" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-4 p-1">
                      <label className="form-label">End Date</label>
                      <div className="form-wrap">
                        <div className="form-icon">
                        <DatePicker
                        className="form-control datetimepicker"
                        name="start_date"
                        minDate={new Date()}
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="MM/dd/yyyy"
                        showDayMonthYearPicker
                        autoComplete='off'
                        placeholderText="End Date"
                        />
                          <span className="icon">
                            <i className="fa-regular fa-calendar-days" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-4 p-1">
                      <label className="form-label">Contract</label>
                      <Select
                        name="contract"
                        classNamePrefix="react-select"
                        placeholder="Select Contract"
                        value={srchContract ? contractOptions.find(status => status.value === srchContract) : null}
                        options={contractOptions}
                        onChange={(selected) => setSrchContract(selected ? selected.value : null)}
                        isClearable={true}
                      />
                    </div>
                    <div className="col-4 p-1">
                      <label className="form-label">Contract Number</label>
                      <input
                        type="text"
                        name="srchKeyword"
                        className="form-control"
                        placeholder="Contract number"
                        value={srchKeyword}
                        onChange={(e) => setSrchKeyword(e.target.value)}
                      />
                    </div>
                    <div className="col-3 p-1 mt-4">
                      <button className="btn btn-primary" type="submit">Submit</button>
                    </div>
                  </div>
                 </form>
                 
              <div className="tab-content appointment-tab-content">
                <table className="table table-center mb-0  table-striped table-hover">
                  <thead className="bg-primary text-white">
                    <tr className="bg-primary text-white">
                      {/* <th className="bg-primary text-white">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={selectedSlotIds.length === 0 ? false : selectedSlotIds.length === facData.filter(item => !['Cancelled', 'Completed'].includes(item.status)).length}
                          disabled={facData.length === 0}
                        />
                      </th> */}
                      <th className="bg-primary text-white">Date</th>
                      <th className="bg-primary text-white"> Shift</th>
                      <th className="bg-primary text-white">Job Title</th>
                      <th className="bg-primary text-white">Professional</th>
                      <th className="bg-primary text-white">Status</th>
                    </tr>
                  </thead>
                  <tbody>
    
                    {facData.length === 0 ? (
                      <tr>
                        <td colSpan="15" >
                        <div className="col-lg-12">
                          <div className="card doctor-list-card">
                            <div className="d-md-flex align-items-center">
                              <div className="card-body p-0">
                                <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                                  <Link to="#" className="text-teal fw-medium fs-14">
                                    No shifts data available
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        </td>
                      </tr>
                    ) : (
                    facData.map((slotInfo) => {
                      const slotDetails = slotData.find(slot => slot.id === slotInfo.slot);
                          return (
                            <tr key={slotInfo.slot_id}>
                              {/* <td>
                                <input
                                  type="checkbox"
                                  checked={selectedSlotIds.includes(slotInfo.slot_id)}
                                  onChange={() => handleCheckboxChange(slotInfo.slot_id)}
                                  disabled={['Cancelled', 'Completed'].includes(slotInfo.status)}
                                />
                              </td> */}
                              <td>{slotInfo.date}</td>
                              { (slotDetails) ?
                              <td>
                                {convertTo12HourFormat(slotDetails.start_hr)} - {convertTo12HourFormat(slotDetails.end_hr)}
                              </td>
                              :
                              <td> 1 Hr </td>
                              }
                              <td><Link to="#" onClick={() => viewJob(slotInfo.job.id)} >{slotInfo.job.job_title},<br/>
                              {
                                (() => {
                                  const option = disciplineOptions.find(disp => disp.value == slotInfo.job.discipline);
                                  return option ? (
                                    <span style={{ backgroundColor: option.color, color:"white", padding:"5px",borderRadius:"5px", margin:'2px'}}>{option.label}</span>
                                  ) : "N/A";
                                })()
                              },
                              &nbsp;{slotInfo.job.zipcode} 
                                </Link>
                              </td>
                              <td><Link to="#" onClick={()=> handleProfView(slotInfo.professional.prof_email,slotInfo.professional.id)} >{slotInfo.professional.prof_first_name} {slotInfo.professional.prof_last_name}</Link></td>
                              
                              <td>
                                {
                                  ['Active', 'Completed'].includes(slotInfo.status)
                                  ?
                                  <Link to="#" className="text-success font-weight-bold">{slotInfo.status}</Link>
                                  :
                                  <Link to="#" className="text-danger font-weight-bold">{slotInfo.status}</Link>
                                }
                              </td>
                            </tr>
                          );
                        }  
                      ))}    
                  </tbody>
                </table>
                </div>
                {recordsPerPage < totalPages ? <AdminPagination totalPages={totalPages} recordsPerPage={recordsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} /> : ''}
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
      {/* /Page Content */}
      <SiteFooter {...props} />
    </div>
  );
};

export default FacilityBillable;
