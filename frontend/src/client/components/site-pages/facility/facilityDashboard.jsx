/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import React, { useEffect, useRef, useState } from "react";
// import DoctorSidebar from "../sidebar";
import DoctorSidebar from '../../doctors/sidebar/index';
// import Header from "../../header";
import SiteHeader from "../home/header";
// import Header from "./header";
// import { doctordashboardclient01, doctordashboardclient02, doctordashboardprofile01, doctordashboardprofile02, doctordashboardprofile04, doctordashboardprofile05, doctordashboardprofile3 } from "../../imagepath";
import { doctordashboardclient01, doctordashboardclient02, doctordashboardprofile01, doctordashboardprofile02, doctordashboardprofile04, doctordashboardprofile05, doctordashboardprofile3 } from "../../imagepath";
import Chart from 'react-apexcharts';
//import DoctorFooter from "../../common/doctorFooter";
import DoctorFooter from "../../common/doctorFooter";
import { Link, useHistory } from "react-router-dom";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import axios from "axios";
import { AUTH_TOKEN, API_BASE_URL, disciplineOptions } from "../config";
import { convertTo12HourFormat  } from "../utils";
import moment from "moment";
import Select from "react-select";
import ApexCharts from 'apexcharts';

const FacilityDashboard = (props) => {

  const history = useHistory();
  const currentUserID = atob(localStorage.getItem('RecordID')) || "";
  const UserID = atob(localStorage.getItem('userID')) || "";
  const [activeCount, setActiveCount] = useState({
    jobs : "",
    job_request : "",
    contract : "",
    shifts : "",
  });
  const [totalCount, setTotalCount] = useState({
    jobs : "",
    job_request : "",
    contract : "",
    shifts : "",
  });
  const [facShifts, setFacShifts] = useState([])
  const [facInvoices, setFacInvoices] = useState([])
  const [facNotify, setFacNotify] = useState([])
  const [facWeekShifts, setFacWeekShifts] = useState(null)
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [filterType, setFilterType] = useState('Last7Days');
  const [shiftFilter, setShiftFilter] = useState('Last7Days');

  const HourOptions = [
    {label : "All", value:"All"},
    {label : "Last 7 Days", value:"7 Days"},
    {label : "This Month", value:"This Month"}
  ]

  // revenue chart
  const chartRef1 = useRef(null);
  useEffect(() => {
    if (chartRef1.current) {
      const sCol = {
        chart: {
          height: 220,
          type: 'bar',
          stacked: true,
          toolbar: {
            show: false,
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '50%',
            endingShape: 'rounded',
            borderRadius: '5',
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 1
        },
        series: [{
          name: 'High',
          color: '#0E82FD',
          data: [50, 40, 15, 45, 35, 48, 65]
        }],
        xaxis: {
          categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val + "k"
            }
          }
        }
      };

      const chart = new ApexCharts(chartRef1.current, sCol);
      chart.render();
    }
  }, []);

  //appoinment chart
  const chartRef = useRef(null);
  useEffect(() => {
    const sCol = {
      chart: {
        height: 220,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false,
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          endingShape: 'rounded',
          borderRadius: '5',
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 1,
      },
      series: [{
        name: 'High',
        color: '#0E82FD',
        data: [
          facWeekShifts?.daily_counts?.Monday ?? 0,
          facWeekShifts?.daily_counts?.Tuesday ?? 0,
          facWeekShifts?.daily_counts?.Wednesday ?? 0,
          facWeekShifts?.daily_counts?.Thursday ?? 0,
          facWeekShifts?.daily_counts?.Friday ?? 0,
          facWeekShifts?.daily_counts?.Saturday ?? 0,
          facWeekShifts?.daily_counts?.Sunday ?? 0
        ]
      }],
      xaxis: {
        categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + "k"
          }
        }
      }
    };

    if (chartRef.current) {
      const chart = new ApexCharts(chartRef.current, sCol);
      chart.render();
    }

  }, []);


const handleContractView = (id,prof_id) => {
  localStorage.setItem("ContractID", btoa(id))
  localStorage.setItem("contractProfID", btoa(prof_id))
  history.push("/facility/contract-view")
}

const handleRequestView = async (id,prof_id) =>{
  localStorage.setItem("requestID",btoa(id))
  localStorage.setItem("requestProfID",btoa(prof_id))
  history.push('/facility/job-request-view')
}


const fetchActiveCount = async () => {
  const data = {
    FacID : currentUserID
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/facility/FacilityActiveCount/`, data, {
        headers: { 
            "Content-Type": "application/json",
            'Authorization': AUTH_TOKEN
          },
    });
    setActiveCount((prev) => ({
      ...prev,
      jobs : response.data.open_jobs,
      job_request : response.data.in_progess_jobs,
      contract : response.data.in_progress_contracts,
      shifts : response.data.today_shifts,
    }));
  } catch (err) {
    console.log("Error for fetchActive", err)
    setError(err.response?.data?.Result || "An error occurred");
  }
};

const fetchTotalCount = async () => {
  const data = {
    FacID      : currentUserID,
    FilterType : filterType
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/facility/FacilityTotalCount/`, data, {
        headers: { 
            "Content-Type": "application/json",
            'Authorization': AUTH_TOKEN
          },
    });
    setTotalCount((prev) => ({
      ...prev,
      jobs : response.data.jobs,
      job_request : response.data.job_requests,
      contract : response.data.contracts,
      shifts : response.data.shifts,
    }));
  } catch (err) {
    console.log("Error for fetchActive", err)
    setError(err.response?.data?.Result || "An error occurred");
  }
};

const fetchShifts = async () => {
  const data = {
    FacID : currentUserID,
    FilterType : shiftFilter

  }
  try {
    const response = await axios.post(`${API_BASE_URL}/facility/FacilityShifts/`, data, {
        headers: { 
            "Content-Type": "application/json",
            'Authorization': AUTH_TOKEN
          },
    });
    setFacShifts(response.data.data)
  } catch (err) {
    console.log("Error for fetchActive", err)
    setError(err.response?.data?.Result || "An error occurred");
  }
};

const fetchInvoices = async () => {
  const data = {
    FacUserID : UserID
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/facility/FacilityInvoices/`, data, {
        headers: { 
            "Content-Type": "application/json",
            'Authorization': AUTH_TOKEN
          },
    });
    setFacInvoices(response.data.data)
  } catch (err) {
    console.log("Error for fetchActive", err)
    setError(err.response?.data?.Result || "An error occurred");
  }
}

const fetchNotifications = async () => {
  const data = {
    FacUserID : UserID
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/facility/FacilityNotications/`, data, {
        headers: { 
            "Content-Type": "application/json",
            'Authorization': AUTH_TOKEN
          },
    });
    setFacNotify(response.data.messages)
  } catch (err) {
    console.log("Error for fetchNotifications", err)
    setError(err.response?.data?.Result || "An error occurred");
  }
}

const fetchWeekShifts = async () => {
  const data = {
    FacID : currentUserID
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/facility/FacilityWeeklyShifts/`, data, {
        headers: { 
            "Content-Type": "application/json",
            'Authorization': AUTH_TOKEN
          },
    });
    setFacWeekShifts(response.data)
  } catch (err) {
    console.log("Error for fetchNotifications", err)
    setError(err.response?.data?.Result || "An error occurred");
  }
}

  useEffect(() => {
    fetchActiveCount()
    fetchShifts()
    fetchInvoices()
    fetchNotifications()
    fetchWeekShifts()
    fetchTotalCount()
  }, [])

  useEffect(() => {
    fetchTotalCount()
    fetchShifts()
  },[filterType, shiftFilter])

console.log("activeCount", activeCount)
console.log("shifts", facShifts)
console.log("facInvoices", facInvoices)
console.log("facNotify", facNotify)
console.log("facWeekShifts", facWeekShifts)


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
                      <a href="/home">
                        <i className="isax isax-home-15" />
                      </a>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      Facility
                    </li>
                    <li className="breadcrumb-item active">Dashboard</li>
                  </ol>
                  <h2 className="breadcrumb-title">Dashboard</h2>
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
        <div className="container-fluid">

          <div className="row">
            <div className="col-lg-12 col-xl-12">
              <div className="row">
                <div className="col-xl-3 d-flex">
                  <div className="dashboard-box-col w-100">
                    <div className="dashboard-widget-box">
                      <div className="dashboard-content-info">
                        <h6>Open Jobs</h6>
                        <h4>{activeCount?.jobs ? activeCount.jobs : "0"}</h4>
                        <span className="text-success">
                          <i className="fa-solid fa-arrow-up" />
                          15% From Last Week
                        </span>
                      </div>
                      <div className="dashboard-widget-icon">
                        <span className="dash-icon-box">
                          <i className="fa-solid fa-user-injured" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 d-flex">
                  <div className="dashboard-box-col w-100">
                    <div className="dashboard-widget-box">
                      <div className="dashboard-content-info">
                        <h6>In Progress Jobs</h6>
                        <h4>{activeCount?.job_request ? activeCount.job_request : "0"}</h4>
                        <span className="text-success">
                          <i className="fa-solid fa-arrow-up" />
                          15% From Last Week
                        </span>
                      </div>
                      <div className="dashboard-widget-icon">
                        <span className="dash-icon-box">
                          <i className="fa-solid fa-user-injured" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 d-flex">
                  <div className="dashboard-box-col w-100">
                    <div className="dashboard-widget-box">
                      <div className="dashboard-content-info">
                        <h6>In Progress Contracts</h6>
                        <h4>{activeCount?.contract ? activeCount.contract : "0"}</h4>
                        <span className="text-success">
                          <i className="fa-solid fa-arrow-up" />
                          15% From Last Week
                        </span>
                      </div>
                      <div className="dashboard-widget-icon">
                        <span className="dash-icon-box">
                          <i className="fa-solid fa-user-injured" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 d-flex">
                  <div className="dashboard-box-col w-100">
                    <div className="dashboard-widget-box">
                      <div className="dashboard-content-info">
                        <h6>Today Shifts</h6>
                        <h4>{activeCount?.shifts ? activeCount.shifts : "0"}</h4>
                        <span className="text-success">
                          <i className="fa-solid fa-arrow-up" />
                          15% From Last Week
                        </span>
                      </div>
                      <div className="dashboard-widget-icon">
                        <span className="dash-icon-box">
                          <i className="fa-solid fa-user-injured" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             </div>  
          </div>


          <div className="row">
            <div className="col-lg-12 col-xl-12">
              <div className="row">
                <div className="col-xl-3 d-flex">
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Overview</h5>
                      </div>
                      <div className="dropdown header-dropdown">
                        <Link
                          className="dropdown-toggle nav-tog"
                          data-bs-toggle="dropdown"
                          to = "#"
                        >
                          {filterType === 'Last7Days' ? 'Last 7 Days' : 'This Month'}
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <Link
                            className="dropdown-item"
                            onClick={() => setFilterType('ThisMonth')}
                            to = "#"
                          >
                            This Month
                          </Link>
                          <Link
                            className="dropdown-item"
                            onClick={() => setFilterType('Last7Days')}
                            to = "#"
                          >
                            Last 7 Days
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      <div className="table-responsive">
                        <table className="table dashboard-table">
                          <tbody>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <div className="patient-name-info">                                    
                                    <h3>
                                      <Link to="/doctor/appointments">{totalCount?.contract ? totalCount.contract : "0"}</Link>
                                    </h3>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>Contracts</h6>                                  
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <div className="patient-name-info">                                    
                                    <h3>
                                      <Link to="/doctor/appointments">{totalCount?.jobs ? totalCount.jobs : "0"}</Link>
                                    </h3>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>Jobs</h6>                                  
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <div className="patient-name-info">                                    
                                    <h3>
                                      <Link to="/doctor/appointments">{totalCount?.job_request ? totalCount.job_request : "0"}</Link>
                                    </h3>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>Job Requests</h6>                                  
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <div className="patient-name-info">                                    
                                    <h3>
                                      <Link to="/doctor/appointments">{totalCount?.shifts ? totalCount.shifts : "0"}</Link>
                                    </h3>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>Shifts</h6>                                  
                                </div>
                              </td>
                            </tr>

                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-5 d-flex">
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Shifts</h5>
                      </div>
                      {/* <div className="dropdown header-dropdown">
                        <Link
                          className="dropdown-toggle nav-tog"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          Last 7 Days
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <Link to="#" className="dropdown-item">
                            Today
                          </Link>
                          <Link to="#" className="dropdown-item">
                            This Month
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Last 7 Days
                          </Link>
                        </div>
                      </div> */}
                      <div className="dropdown header-dropdown">
                        <Link
                          className="dropdown-toggle nav-tog"
                          data-bs-toggle="dropdown"
                          to = "#"
                        >
                          {shiftFilter === 'Last7Days' ? 'Last 7 Days' : 'This Month'}
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <Link
                            className="dropdown-item"
                            onClick={() => setShiftFilter('ThisMonth')}
                            to = "#"
                          >
                            This Month
                          </Link>
                          <Link
                            className="dropdown-item"
                            onClick={() => setShiftFilter('Last7Days')}
                            to = "#"
                          >
                            Last 7 Days
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      <div className="table-responsive">
                        <table className="table dashboard-table">
                          <tbody>
                            {facShifts.length === 0 ? (
                            <tr>
                              <td colSpan="15">
                                  <div className="col-lg-12">
                                  <div className="card doctor-list-card">
                                      <div className="d-md-flex align-items-center">
                                      <div className="card-body p-0">
                                          <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                                          <Link to="#" className="text-teal fw-medium fs-14">
                                              No shifts available for this facility
                                          </Link>
                                          </div>
                                      </div>
                                      </div>
                                  </div>
                                  </div>
                              </td>
                          </tr>
                        ) : (
                          facShifts.map((data) => (
                            <tr key={data.id}>
                              <td>
                                <div className="patient-info-profile">
                                  <div className="patient-name-info">
                                    <span className="badge table-badge">
                                      {data?.professional?.Discipline?.length > 0
                                          ? data.professional.Discipline
                                              .map((disp) => {
                                                const option = disciplineOptions.find(option => option.value === disp);
                                                return option ? (
                                                  <span key={disp} style={{ backgroundColor: option.color, color:"white", padding:"5px",borderRadius:"5px" }}>
                                                    {option.label}
                                                  </span>
                                                ) : null;
                                              })
                                              .filter(Boolean)
                                              .reduce((acc, curr, index) => {
                                                if (index === 0) return [curr];
                                                return [...acc, ', ', curr];
                                              }, [])
                                          : 'N/A'
                                      }
                                    </span>
                                    <h5 className="mt-1">
                                      <Link to="#">{data?.professional?.prof_first_name} {data?.professional?.prof_last_name}</Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>{data?.job_wrk_hrs?.date ? moment(data.job_wrk_hrs.date).format('MMM DD YYYY') : ""} ({data?.slots ? data?.slots?.slot_type === "Slots" ? `${convertTo12HourFormat(data?.slots?.start_hr)} - ${convertTo12HourFormat(data?.slots?.end_hr)}` : "Any 1 hour" : ""})</h6>                                  
                                </div>
                              </td>
                            </tr>
                          )))}
                            {/* <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <div className="patient-name-info">
                                    <span className="badge table-badge">Dicipline with color</span>
                                    <h5>
                                      <Link to="/doctor/appointments">Professional name</Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>11 Nov 2025 10.45 AM</h6>                                  
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <div className="patient-name-info">
                                    <span className="badge table-badge">Dicipline with color</span>
                                    <h5>
                                      <Link to="/doctor/appointments">Professional name</Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>11 Nov 2025 10.45 AM</h6>                                  
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <div className="patient-name-info">
                                    <span className="badge table-badge">Dicipline with color</span>
                                    <h5>
                                      <Link to="/doctor/appointments">Professional name</Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>11 Nov 2025 10.45 AM</h6>                                  
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <div className="patient-name-info">
                                    <span className="badge table-badge">Dicipline with color</span>
                                    <h5>
                                      <Link to="/doctor/appointments">Professional name</Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>11 Nov 2025 10.45 AM</h6>                                  
                                </div>
                              </td>
                            </tr> */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-4 d-flex">
                  <div className="dashboard-chart-col w-100">
                    <div className="dashboard-card w-100">
                      <div className="dashboard-card-head border-0">
                        <div className="header-title">
                          <h5>Weekly Overview</h5>
                        </div>
                        <div className="chart-create-date">
                          <h6>{facWeekShifts?.week_range?.start ? moment(facWeekShifts?.week_range?.start).format("MMM DD") : ""} - {facWeekShifts?.week_range?.end ? moment(facWeekShifts?.week_range?.end).format("MMM DD") : ""}</h6>
                        </div>
                      </div>
                      <div className="dashboard-card-body">
                        <div className="chart-tab">
                          <ul
                            className="nav nav-pills product-licence-tab"
                            id="pills-tab2"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link active"
                                id="pills-revenue-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-revenue"
                                type="button"
                                role="tab"
                                aria-controls="pills-revenue"
                                aria-selected="false"
                              >
                                Revenue
                              </button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link"
                                id="pills-appointment-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-appointment"
                                type="button"
                                role="tab"
                                aria-controls="pills-appointment"
                                aria-selected="true"
                              >
                                Shifts
                              </button>
                            </li>
                          </ul>
                          <div
                            className="tab-content w-100"
                            id="v-pills-tabContent"
                          >
                            <div
                              className="tab-pane fade show active"
                              id="pills-revenue"
                              role="tabpanel"
                              aria-labelledby="pills-revenue-tab"
                            >
                              <div ref={chartRef1} id="revenue-chart" />
                            </div>
                            <div
                              className="tab-pane fade"
                              id="pills-appointment"
                              role="tabpanel"
                              aria-labelledby="pills-appointment-tab"
                            >
                              <div ref={chartRef} id="appointment-chart" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 col-xl-12">
              <div className="row">

                <div className="col-xl-7 d-flex">
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Notifications</h5>
                      </div>
                      <div className="card-view-link">
                        <Link to="/facility/notifications">View All</Link>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      <div className="table-responsive">
                        <table className="table dashboard-table">
                          <tbody>
                            {facNotify.length === 0 ? (
                            <tr>
                              <td colSpan="15">
                                  <div className="col-lg-12">
                                  <div className="card doctor-list-card">
                                      <div className="d-md-flex align-items-center">
                                      <div className="card-body p-0">
                                          <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                                          <Link to="#" className="text-teal fw-medium fs-14">
                                              No notifications available for this facility
                                          </Link>
                                          </div>
                                      </div>
                                      </div>
                                  </div>
                                  </div>
                              </td>
                          </tr>
                        ) : (
                          facNotify.map((data) => (
                            <tr key={data.id}>
                              <td>
                                {data?.contract ?
                                <div className="table-noti-info">
                                  <div className="table-noti-icon color-violet">
                                    <i className="fa-solid fa-bell" />
                                  </div>
                                  <div className="table-noti-message">
                                    <h6>
                                      <Link to="#" onClick={() => handleContractView(data.contract, data.professional.id)}><span>Contract</span> - {data.message}</Link>
                                    </h6>
                                    <span className="message-time">{data?.created ? moment(data.created).format("MMM DD YYYY") : ""}</span>
                                  </div>
                                </div>
                                :
                                <div className="table-noti-info">
                                  <div className="table-noti-icon color-blue">
                                    <i className="fa-solid fa-star" />
                                  </div>
                                  <div className="table-noti-message">
                                    <h6>
                                      <Link to="#" onClick={() => handleRequestView(data.job_request, data.professional.id)} ><span>Job Request</span> - {data.message}</Link>
                                    </h6>
                                    <span className="message-time">{data?.created ? moment(data.created).format("MMM DD YYYY") : ""}</span>
                                  </div>
                                </div> 
                                }
                              </td>
                            </tr>
                          )))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-5 d-flex">
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Recent Invoices</h5>
                      </div>
                      <div className="card-view-link">
                        <Link to="/facility/invoices">View All</Link>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      <div className="table-responsive">
                        <table className="table dashboard-table">
                          <tbody>
                            {facInvoices.length === 0 ? (
                            <tr>
                              <td colSpan="15">
                                <div className="col-lg-12">
                                  <div className="card doctor-list-card">
                                    <div className="d-md-flex align-items-center">
                                      <div className="card-body p-0">
                                        <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                                          <Link to="#" className="text-teal fw-medium fs-14">
                                              No shifts available for this facility
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ) : (
                          facInvoices.map((data) => (
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <Link
                                    to="#"
                                    className="table-avatar"
                                  >
                                    <img
                                      src={doctordashboardprofile01}
                                      alt="Img"
                                    />
                                  </Link>
                                  <div className="patient-name-info">
                                    <h5>
                                      <Link to="#">{data?.professional?.prof_first_name} {data?.professional?.prof_last_name}</Link>
                                    </h5>
                                    <span>{data?.invoice_no}</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Amount</span>
                                  <h6>$ {data?.total_amount}</h6>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Paid On</span>
                                  <h6>{data?.invoice_date ? moment(data.invoice_date).format('MMM DD YYYY') : ""}</h6>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-view d-flex align-items-center">
                                  <Link to="#">
                                    <i className="fa-solid fa-eye" />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          )))}

                            {/* <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <Link to="#" className="table-avatar">
                                    <img
                                      src={doctordashboardprofile02}
                                      alt="Img"
                                    />
                                  </Link>
                                  <div className="patient-name-info">
                                    <h5>
                                      <Link to="#">Kelly</Link>
                                    </h5>
                                    <span>#Apt0002</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Paid On</span>
                                  <h6>10 Nov 2025</h6>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Amount</span>
                                  <h6>$500</h6>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-view d-flex align-items-center">
                                  <Link to="#">
                                    <i className="fa-solid fa-eye" />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <Link to="#" className="table-avatar">
                                    <img
                                      src={doctordashboardprofile3}
                                      alt="Img"
                                    />
                                  </Link>
                                  <div className="patient-name-info">
                                    <h5>
                                      <Link to="#">Samuel</Link>
                                    </h5>
                                    <span>#Apt0003</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Paid On</span>
                                  <h6>03 Nov 2025</h6>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Amount</span>
                                  <h6>$320</h6>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-view d-flex align-items-center">
                                  <Link to="#">
                                    <i className="fa-solid fa-eye" />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <Link to="#" className="table-avatar">
                                    <img
                                      src={doctordashboardprofile04}
                                      alt="Img"
                                    />
                                  </Link>
                                  <div className="patient-name-info">
                                    <h5>
                                      <Link to="#">Catherine</Link>
                                    </h5>
                                    <span>#Apt0004</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Paid On</span>
                                  <h6>01 Nov 2025</h6>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Amount</span>
                                  <h6>$240</h6>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-view d-flex align-items-center">
                                  <Link to="#">
                                    <i className="fa-solid fa-eye" />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <Link to="#" className="table-avatar">
                                    <img
                                      src={doctordashboardprofile05}
                                      alt="Img"
                                    />
                                  </Link>
                                  <div className="patient-name-info">
                                    <h5>
                                      <Link to="#">Robert</Link>
                                    </h5>
                                    <span>#Apt0005</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Paid On</span>
                                  <h6>28 Oct 2025</h6>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Amount</span>
                                  <h6>$380</h6>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-view d-flex align-items-center">
                                  <Link to="#">
                                    <i className="fa-solid fa-eye" />
                                  </Link>
                                </div>
                              </td>
                            </tr> */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

              </div> 
            </div>     
          </div>              


        </div>
      </div>
      {/* /Page Content */}
      <DoctorFooter {...props} />
    </div>
  );
};

export default FacilityDashboard;
