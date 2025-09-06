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

const FacilityBillableShifts = (props) => {
  
  const userEmail = atob(localStorage.getItem('email')) || ""
  const FacID = atob(localStorage.getItem('RecordID')) || "";
  const [facData, setFacData] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [fetchSlot, setFetchSlot] = useState(false);
  const [slotID, setSlotID] = useState({slot_ids: []});
  const [error, setError] = useState(null);
  const [selectedSlotIds, setSelectedSlotIds] = useState([]);
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

  //Create invoice
  const[showCI, setShowCI] = useState(false)

  const history = useHistory();
  const disciplineOptions = getCurrentUserDiscipline()

  const handleCheckboxChange = (slotId) => {
    setSelectedSlotIds(prev => 
      prev.includes(slotId)
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

 
  const handleCreateInvoice = (id, prof_id) => {
    localStorage.setItem("InvConID",btoa(id))
    localStorage.setItem("InvProfID",btoa(prof_id))
    localStorage.setItem("InvEndDate",btoa(endDate))
    localStorage.setItem("InvStartDate",btoa(startDate))
    history.push("/facility/create-invoice")
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

  const getBillabletHours = async(id) => {

    const data = {
      FacID : id,
      Discipline: srchDiscipline,
      StartDate : startDate ? moment(startDate).format("YYYY-MM-DD") : null,
      EndDate : endDate ? moment(endDate).format("YYYY-MM-DD") : null,
      ConProfID : professional,
      Keyword: srchKeyword,
      CurrentPage : currentPage,
      RecordsPerPage : recordsPerPage
    }
    axios.post( `${API_BASE_URL}/contract/BillableContractHours/`, data,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTH_TOKEN,
      }
    })
    .then((response) => {
      setShowCI(false)
      setFacData(response.data.data);
      if (response.data.data) {
        if (startDate & endDate){
          setShowCI(true)
        }
      }
      if (response.data.current_page) setCurrentPage(response.data.current_page);
      if (response.data.records_per_page) setRecordsPerPage(response.data.records_per_page);
      if (response.data.total_count) setTotalPages(response.data.total_count);
      if (response.data.con_search_options) setContractOptions(response.data.con_search_options);
      const extractedSlotIds = response.data.data ? response.data.data.map(slot => slot.slot) : [];
      setSlotID({ slot_ids: extractedSlotIds });
    })
    .catch((err) => {
      console.error('Error fetching facility data:', err)
    });
  }

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

  const handleSearchSubmit = async(e) => {
    e.preventDefault();
    await getBillabletHours(FacID)
  }

  useEffect(() => {
    getCurrentFacility()
  }, [userEmail]);

  useEffect(() => {
    getBillabletHours(FacID)
    getProfessionals(FacID)
  }, [FacID, AUTH_TOKEN, currentPage]);

  console.log("Billable Shits Data", facData)

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
                  <h2 className="breadcrumb-title">Billable Shifts</h2>
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
                        name="end_date"
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
                    <div className="col-3 p-1 mt-4 text-center">
                      <button className="btn btn-primary" type="submit">Submit</button>
                    </div>
                  </div>
                 </form>
                 
              <div className="tab-content appointment-tab-content">
                <table className="table table-center mb-0  table-striped table-hover">
                  <thead className="bg-primary text-white">
                    <tr className="bg-primary text-white">
                      <th className="bg-primary text-white">Contract No</th>
                      <th className="bg-primary text-white">Professional</th>
                      <th className="bg-primary text-white">Total Hours</th>
                      <th className="bg-primary text-white">Total Amount</th>
                      { showCI ? <th className="bg-primary text-white">Actions</th> : null }
                    </tr>
                  </thead>
                  <tbody>
                    {facData.length === 0 ? (
                        <tr>
                        <td colSpan="15">
                            <div className="col-lg-12">
                            <div className="card doctor-list-card">
                                <div className="d-md-flex align-items-center">
                                <div className="card-body p-0">
                                    <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                                    <Link to="#" className="text-teal fw-medium fs-14">
                                        No billable shifts data available
                                    </Link>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </td>
                        </tr>
                    ) : (
                        facData.map((slotInfo) => (
                        <tr key={slotInfo.contract_id}>
                            <td>{slotInfo.contract.contract_no}</td>
                            <td><Link to="#" onClick={() => handleProfView(slotInfo.professional.prof_email,slotInfo.professional.id)}>{slotInfo.professional.prof_first_name}{' '}{slotInfo.professional.prof_last_name}</Link></td>
                            <td>{slotInfo.total_hours} {slotInfo.total_hours > 1 ? "hrs" : "hr"}</td>
                            <td>$ {slotInfo.total_amount}</td>
                            { showCI ?
                            <td>
                                <button className="btn-sm btn-success" onClick={() => handleCreateInvoice(slotInfo.contract_id, slotInfo.professional_id)}>Create Invoice</button>
                            </td>
                            :null}
                        </tr>
                        ))
                    )}
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

export default FacilityBillableShifts;
