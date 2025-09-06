import React, {useState, useEffect} from "react";
import SiteHeader from "../home/header.jsx";
import SiteFooter from "../home/footer.jsx";
import { Link, NavLink } from "react-router-dom";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
import axios from "axios";
import {AUTH_TOKEN, API_BASE_URL, disciplineOptions, contractHourOptions, ColourOption, SingleValue, MultiValueLabel} from '../config';
import {convertTo12HourFormat,convertToUS} from "../utils";
import Select from "react-select";

const ProfessionalShifts = (props) => {
  
  const [showWorkHours, setShowWorkHours] = useState(false);
  const ProfID = atob(localStorage.getItem('RecordID')) || "";
  const [profData, setProfData] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [fetchSlot, setFetchSlot] = useState(false);
  const [slotID, setSlotID] = useState({slot_ids: []});
  const [selectedSlotIds, setSelectedSlotIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [srchDiscipline, setSrchDiscipline] = useState([])

   //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
  
  const handleCheckboxChange = (slotId) => {
    setSelectedSlotIds(prev => 
      prev.includes(slotId)
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  const GetContracts = async(id, status) => {
     const data = {
        ProfID : id,
        Status: status,
        Discipline: srchDiscipline,
        CurrentPage : currentPage,
        RecordsPerPage : recordsPerPage
      }
      axios.post( `${API_BASE_URL}/contract/GetUserContractHours/`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN,
        }
      })
      .then((response) => {
        setProfData(response.data.data);
        if (response.data.current_page) setCurrentPage(response.data.current_page);
        if (response.data.records_per_page) setRecordsPerPage(response.data.records_per_page);
        if (response.data.total_count) setTotalPages(response.data.total_count);
        const extractedSlotIds = response.data.data ? response.data.data.map(slot => slot.slot) : [];
        setSlotID({ slot_ids: extractedSlotIds });
        if (extractedSlotIds.length > 0){
          setFetchSlot(true)
        }
      })
      .catch((err) => {
        console.error('Error fetching facility data:', err)
      });
  }

  useEffect(() => {
      GetContracts(ProfID, statusFilter)
  }, [ProfID, AUTH_TOKEN, statusFilter,srchDiscipline]);
  
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
      GetContracts(ProfID,statusFilter)
    } else {
      alert("Failed: " + (response.data?.Result || 'Unknown error'));
    }
  } catch (error) {
    console.error("Error updating status:", error);
    alert("An error occurred while updating status");
  }
};

console.log("srchDiscipline",srchDiscipline)

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
                     <Link to="/professional/dashboard">Professional</Link>
                    </li>
                    {/* <li className="breadcrumb-item active">Shift</li> */}
                  </ol>
                  <h2 className="breadcrumb-title">Shifts</h2>
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
      <div className="content pt-3">
        <div className="container">
          <div className="row">
            {/* <div className="col-lg-4 col-xl-3 theiaStickySidebar">
\              <DoctorSidebar />
            </div> */}
            <div className="col-lg-12 col-xl-12">
              <div className="dashboard-header">
                <h3></h3>
                {/* {
                  profData.length === 0 ? null :
                <ul className="header-list-btns">
                  <li>
                    <div className="view-icons">
                      <Link to="#" className = {showWorkHours ? "active" : ""} onClick={()=>setShowWorkHours(true)}>
                      <i className="isax isax-calendar-tick"></i>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="view-icons">
                      <Link to="#" className = {showWorkHours ? "" : "active"} onClick={()=>setShowWorkHours(false)}>
                      <i className="isax isax-grid-7"></i>
                      </Link>
                    </div>
                  </li>
                </ul>
              } */}
              </div>
              <div className="tab-content appointment-tab-content">
                <div className="row mb-3">
                  <div className="col-3">
                    <Select
                      name="srchStatus"
                      classNamePrefix="react-select"
                      placeholder="Select Status"
                      value={
                        statusFilter
                          ? contractHourOptions.find(status => status.value === statusFilter)
                          : null
                      }
                      options={contractHourOptions}
                      onChange={(selected) => setStatusFilter(selected ? selected.value : "All")}
                      isClearable={true}
                    />
                  </div>
                  <div className="col-3">
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
                  <div className="offset-2 col-4 text-end">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleStatusUpdate('Cancelled')}
                      disabled={selectedSlotIds.length === 0}
                    >
                      Mark as Cancelled
                    </button>
                  </div>
                </div>
                <table className="table table-center mb-0  table-striped table-hover">
                  <thead className="bg-primary text-white">
                    <tr className="bg-primary text-white">
                      <th className="bg-primary text-white"></th>
                      <th className="bg-primary text-white">Date</th>
                      <th className="bg-primary text-white">Job Title</th>
                      <th className="bg-primary text-white">Facility</th>
                      <th className="bg-primary text-white"> Shift</th>
                      <th className="bg-primary text-white">Status</th>
                      <th className="bg-primary text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profData.length === 0 ? (
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
                      profData.map((slotInfo) => {
                        const slotDetails = slotData.find(slot => slot.id === slotInfo.slot);
                        if (slotDetails) {
                          return (
                            <tr key={slotInfo.slot_id}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={selectedSlotIds.includes(slotInfo.slot_id)}
                                  onChange={() => handleCheckboxChange(slotInfo.slot_id)}
                                  disabled={slotInfo.status === "Cancelled" ? true : false}
                                />
                              </td>
                              <td>{slotInfo.date}</td>
                              {(slotInfo?.job) ? (
                                <td>
                                  <Link to="#" onClick={() => viewJob(slotInfo?.job.id)} >
                                    {slotInfo?.job?.job_title},<br />
                                    {
                                      (() => {
                                        const option = disciplineOptions.find(disp => disp.value == slotInfo?.job?.discipline);
                                        return option ? (
                                          <span style={{ backgroundColor: option.color, color:"white", padding:"5px", borderRadius:"5px", margin:'4px' }}>
                                            {option.label}
                                          </span>
                                        ) : "N/A";
                                      })()
                                    }
                                    &nbsp;{slotInfo?.job?.zipcode}
                                  </Link>
                                </td>
                              ) : (
                                <td> - </td>
                              )}
                              <td>{slotInfo.facility.fac_first_name} {slotInfo.facility.fac_last_name}</td>
                              <td>{convertTo12HourFormat(slotDetails.start_hr)} - {convertTo12HourFormat(slotDetails.end_hr)}</td>
                              <td>
                                {
                                  ['Active', 'Completed'].includes(slotInfo.status)
                                  ?
                                  <Link to="#" className="text-success font-weight-bold">{slotInfo.status}</Link>
                                  :
                                  <Link to="#" className="text-danger font-weight-bold">{slotInfo.status}</Link>
                                }
                              </td>
                              <td>
                                {slotInfo.status === "Cancelled" 
                                ?
                                "-"
                                :
                                <button className="btn-sm btn-danger rounded-pill" onClick={() => handleStatusUpdate('Cancelled', slotInfo.slot_id)}>Cancel</button>
                                }
                              </td>
                            </tr>
                          );
                        }
                        return null;
                      })
                    )}
                  </tbody>
                </table>
                
                  {/* Pagination */}
                  {/* <div className="pagination dashboard-pagination">
                    <ul>
                      <li>
                        <Link to="#" className="page-link">
                          <i className="fa-solid fa-chevron-left" />
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          1
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link active">
                          2
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          3
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          4
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          ...
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="page-link">
                          <i className="fa-solid fa-chevron-right" />
                        </Link>
                      </li>
                    </ul>
                  </div> */}
                  {/* /Pagination */}
                </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      {recordsPerPage < totalPages ? <AdminPagination totalPages={totalPages} recordsPerPage={recordsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} /> : ''}
      <SiteFooter {...props} />
    </div>
  );
};

export default ProfessionalShifts;
