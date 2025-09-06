/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import React, { useEffect, useRef, useState } from "react";
// import DoctorSidebar from "../sidebar";
import DoctorSidebar from '../../doctors/sidebar/index';
// import Header from "../../header";
import SiteHeader from "../home/header";
import SiteFooter from "../home/footer";
// import Header from "./header";
// import { doctordashboardclient01, doctordashboardclient02, doctordashboardprofile01, doctordashboardprofile02, doctordashboardprofile04, doctordashboardprofile05, doctordashboardprofile3 } from "../../imagepath";
import { doctordashboardclient01, doctordashboardclient02, doctordashboardprofile01, doctordashboardprofile02, doctordashboardprofile04, doctordashboardprofile05, doctordashboardprofile3 } from "../../imagepath";
import Chart from 'react-apexcharts';
//import DoctorFooter from "../../common/doctorFooter";
import DoctorFooter from "../../common/doctorFooter";
import Footer from "../login/loginFooter";
import { Link, useHistory } from "react-router-dom";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import axios from "axios";
import { AUTH_TOKEN, API_BASE_URL, disciplineOptions } from "../config";
import { convertToUS, convertTo12HourFormat } from "../utils";
import moment from "moment";
import ApexCharts from 'apexcharts';

const ProfessionalDashboard = (props) => {

  const history = useHistory();
  const currentUserID = atob(localStorage.getItem('RecordID')) || "";
  const UserID = atob(localStorage.getItem('userID')) || "";
   
  const [totalCount, setTotalCount] = useState({
    job_request : "",
    contract : "",
    shifts : "",
  });

  const [profShifts, setProfShifts] = useState([])
  const [profJobRequest, setProfJobRequest] = useState([])
  const [upcomingShifts, setUpcomingShifts] = useState([])
  const [profInvoices, setProfInvoices] = useState([])
  const [profNotify, setProfNotify] = useState([])
  const [profWeekShifts, setProfWeekShifts] = useState(null)
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filterType, setFilterType] = useState('Last7Days');
  const [shiftFilter, setShiftFilter] = useState('Last7Days');

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
          profWeekShifts?.daily_counts?.Monday ?? 0,
          profWeekShifts?.daily_counts?.Tuesday ?? 0,
          profWeekShifts?.daily_counts?.Wednesday ?? 0,
          profWeekShifts?.daily_counts?.Thursday ?? 0,
          profWeekShifts?.daily_counts?.Friday ?? 0,
          profWeekShifts?.daily_counts?.Saturday ?? 0,
          profWeekShifts?.daily_counts?.Sunday ?? 0
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

  const handleContractView = (id,fac_id) => {
    localStorage.setItem("ContractID", btoa(id))
    localStorage.setItem("contractFacID", btoa(fac_id))
    history.push("/professional/contract-view")
  }
  
  const handleRequestView = async(id,fac_id) => {
    localStorage.setItem('requestID',btoa(id))
    localStorage.setItem('requestFacID',btoa(fac_id));
    history.push('/professional/job-request-view')
  }
  
  const fetchTotalCount = async () => {
    const data = {
      ProfID : currentUserID
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/professional/ProfTotalCount/`, data, {
          headers: { 
              "Content-Type": "application/json",
              'Authorization': AUTH_TOKEN
            },
      });
      setTotalCount((prev) => ({
        ...prev,
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
      ProfID : currentUserID,
      FilterType : shiftFilter
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/professional/ProfShifts/`, data, {
          headers: { 
              "Content-Type": "application/json",
              'Authorization': AUTH_TOKEN
            },
      });
      setProfShifts(response.data.data)
    } catch (err) {
      console.log("Error for fetchActive", err)
      setError(err.response?.data?.Result || "An error occurred");
    }
  };

  const fetchJobRequest = async () => {
    const data = {
      ProfID : currentUserID,
      FilterType : filterType
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/professional/ProfJobRequest/`, data, {
          headers: { 
              "Content-Type": "application/json",
              'Authorization': AUTH_TOKEN
            },
      });
      setProfJobRequest(response.data.data)
    } catch (err) {
      console.log("Error for fetchJobRequest", err)
      setError(err.response?.data?.Result || "An error occurred");
    }
  };
  
  const fetchInvoices = async () => {
    const data = {
      ProfID : currentUserID
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/professional/ProfInvoices/`, data, {
          headers: { 
              "Content-Type": "application/json",
              'Authorization': AUTH_TOKEN
            },
      });
      setProfInvoices(response.data.data)
    } catch (err) {
      console.log("Error for fetchActive", err)
      setError(err.response?.data?.Result || "An error occurred");
    }
  }
  
  const fetchNotifications = async () => {
    const data = {
      ProfUserID : UserID
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/professional/ProfNotications/`, data, {
          headers: { 
              "Content-Type": "application/json",
              'Authorization': AUTH_TOKEN
            },
      });
      setProfNotify(response.data.messages)
    } catch (err) {
      console.log("Error for fetchNotifications", err)
      setError(err.response?.data?.Result || "An error occurred");
    }
  }

  const fetchWeekShifts = async () => {
    const data = {
      ProfID : currentUserID
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/professional/ProfWeeklyShifts/`, data, {
          headers: { 
              "Content-Type": "application/json",
              'Authorization': AUTH_TOKEN
            },
      });
      setProfWeekShifts(response.data)
    } catch (err) {
      console.log("Error for fetchNotifications", err)
      setError(err.response?.data?.Result || "An error occurred");
    }
  }

  const fetchUpcomingShifts = async () => {
    const data = {
      ProfID : currentUserID
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/professional/UpcomingShifts/`, data, {
          headers: { 
              "Content-Type": "application/json",
              'Authorization': AUTH_TOKEN
            },
      });
      setUpcomingShifts(response.data.data)
    } catch (err) {
      console.log("Error for fetchUpcomingShifts", err)
      setError(err.response?.data?.Result || "An error occurred");
    }
  };

  

  useEffect(() => {
    fetchTotalCount()
    fetchShifts()
    fetchInvoices()
    fetchNotifications()
    fetchWeekShifts()
    fetchJobRequest()
    fetchUpcomingShifts()
  }, [])

  useEffect(() => {
    fetchJobRequest()
  },[filterType])

  useEffect(() => {
    fetchShifts()
    
  },[shiftFilter])

console.log("totalCount", totalCount)
console.log("shifts", profShifts)
console.log("profInvoices", profInvoices)
console.log("profNotify", profNotify)
console.log("fetchJobRequest", profJobRequest)
console.log("fetchUpcomingShifts", upcomingShifts)

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
                      <a href="/">
                        <i className="isax isax-home-15" />
                      </a>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                    <Link to="/professional/dashboard">Professional</Link>
                    </li>
                    {/* <li className="breadcrumb-item active">Dashboard</li> */}
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
                        <h6>Total Contracts</h6>
                        <h4>{totalCount?.contract ? totalCount.contract : "0"}</h4>
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
                        <h6>Job Requests</h6>
                        <h4>{totalCount?.job_request ? totalCount.job_request : "0"}</h4>
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
                        <h6>Shifts</h6>
                        <h4>{totalCount?.shifts ? totalCount.shifts : "0" }</h4>
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
                  <div className="dashboard-main-col w-100">
                    <div className="upcoming-appointment-card pb-1">
                      <div className="title-card mb-2">
                        <div className="row">
                        <h5 className="col-8">Upcoming Shift</h5>
                        <span className="col"><Link to="#" className="text-white"><i className="fa-solid fa-eye text-white"/> View</Link></span>
                        </div>
                      </div>
                      { upcomingShifts.length === 0 ?
                      <div className="col-lg-12">
                        <div className="card doctor-list-card">
                          <div className="d-md-flex align-items-center">
                            <div className="card-body p-0">
                              <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                                <Link to="#" className="text-teal fw-medium fs-14">
                                    No upcoming shifts available for this professional
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      :
                      upcomingShifts.map((data) => ((
                        <div className="upcoming-patient-info pb-1 border-0">
                        <div className="info-details">
                          <div className="name-info">
                            <span style={{fontSize:"12px"}}>
                              {data?.facility?.Discipline?.length > 0
                                  ? data.facility.Discipline
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
                            <h6 style={{fontSize:"12px"}}>{data?.facility?.fac_first_name} {data?.facility?.fac_last_name}</h6>
                          </div>
                        </div>
                        <div className="date-details mt-4">
                          <h6 style={{fontSize:"12px", fontWeight:"bold"}}>Today, ({data?.slot ? data?.slot?.slot_type === "Slots" ? `${convertTo12HourFormat(data?.slot?.start_hr)} - ${convertTo12HourFormat(data?.slot?.end_hr)}` : "Any 1 hour" : ""})</h6>
                        </div>
                      </div>
                      )))}
                    </div>
                  </div>
                </div>
              </div>
             </div>  
          </div>
          <div className="row">
            <div className="col-lg-12 col-xl-12">
              <div className="row">
                {/* <div className="col-xl-3 d-flex">
                  <div className="dashboard-box-col w-100">
                    <div className="dashboard-widget-box">
                      <div className="dashboard-content-info">
                        <h6>Total Contracts</h6>
                        <h4>{totalCount?.contract}</h4>
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
                    <div className="dashboard-widget-box">
                      <div className="dashboard-content-info">
                        <h6>Job Requests</h6>
                        <h4>{totalCount?.job_request}</h4>
                        <span className="text-danger">
                          <i className="fa-solid fa-arrow-up" />
                          15% From Yesterday
                        </span>
                      </div>
                      <div className="dashboard-widget-icon">
                        <span className="dash-icon-box">
                          <i className="fa-solid fa-user-clock" />
                        </span>
                      </div>
                    </div>
                    <div className="dashboard-widget-box">
                      <div className="dashboard-content-info">
                        <h6>Shifts</h6>
                        <h4>{totalCount.shifts}</h4>
                        <span className="text-success">
                          <i className="fa-solid fa-calendar-days" />
                          20% From Yesterday
                        </span>
                      </div>
                      <div className="dashboard-widget-icon">
                        <span className="dash-icon-box">
                          <i className="fa-solid fa-calendar-days" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="col-xl-4 d-flex">
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Job Request</h5>
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
                          {profJobRequest.length === 0 ? (
                            <tr>
                              <td colSpan="15">
                                <div className="col-lg-12">
                                  <div className="card doctor-list-card">
                                    <div className="d-md-flex align-items-center">
                                      <div className="card-body p-0">
                                        <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                                          <Link to="#" className="text-teal fw-medium fs-14">
                                              No Job request available for this professional
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                        ) : (
                          profJobRequest.map((data) => (
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <div className="patient-name-info">
                                    <span>
                                      {data?.facility?.Discipline?.length > 0
                                          ? data.facility.Discipline
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
                                      <Link to="#">
                                        {data?.facility?.fac_first_name} {data?.facility?.fac_last_name}
                                      </Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>{data?.created ? convertToUS(data.created, "DateTime") : ""}</h6>
                                </div>
                              </td>
                            </tr>
                          )))}
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
                          <h6>{profWeekShifts?.week_range?.start ? moment(profWeekShifts?.week_range?.start).format("MMM DD") : ""} - {profWeekShifts?.week_range?.end ? moment(profWeekShifts?.week_range?.end).format("MMM DD") : ""}</h6>
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
                <div className="col-xl-4 d-flex">
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Shifts</h5>
                      </div>
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
                          {profShifts.length === 0 ? (
                            <tr>
                              <td colSpan="15">
                                <div className="col-lg-12">
                                  <div className="card doctor-list-card">
                                    <div className="d-md-flex align-items-center">
                                      <div className="card-body p-0">
                                        <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                                          <Link to="#" className="text-teal fw-medium fs-14">
                                              No shifts available for this professional
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                        ) : (
                          profShifts.map((data) => (
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  {/* <Link
                                    to="#"
                                    className="table-avatar"
                                  >
                                    <img
                                      src={doctordashboardprofile01}
                                      alt="Img"
                                    />
                                  </Link> */}
                                  <div className="patient-name-info">
                                    <span>
                                      {data?.facility?.Discipline?.length > 0
                                          ? data.facility.Discipline
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
                                      <Link to="#">
                                        {data?.facility?.fac_first_name} {data?.facility?.fac_last_name}
                                      </Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6 >{data?.prof_slot?.date ? moment(data?.prof_slot?.date).format("MMM DD YYYY") : ""} ({data?.slots ? data?.slots?.slot_type === "Slots" ? `${convertTo12HourFormat(data?.slots?.start_hr)} - ${convertTo12HourFormat(data?.slots?.end_hr)}` : "Any 1 hour" : ""}) </h6>
                                  {/* <span className="badge table-badge">General</span> */}
                                </div>
                              </td>
                              {/* <td>
                                <div className="apponiment-actions d-flex align-items-center">
                                  <Link to="#" className="text-success me-2">
                                    <i className="fa-solid fa-check" />
                                  </Link>
                                  <Link to="#" className="text-danger">
                                    <i className="fa-solid fa-xmark" />
                                  </Link>
                                </div>
                              </td> */}
                            </tr>
                          )))}
                            {/* <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <Link
                                    to="/doctor/appointments"
                                    className="table-avatar"
                                  >
                                    <img
                                      src={doctordashboardprofile02}
                                      alt="Img"
                                    />
                                  </Link>
                                  <div className="patient-name-info">
                                    <span>#Apt0002</span>
                                    <h5>
                                      <Link to="/doctor/appointments">Kelly Stevens</Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>10 Nov 2025 11.00 AM</h6>
                                  <span className="badge table-badge">
                                    Clinic Consulting
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-actions d-flex align-items-center">
                                  <Link to="#" className="text-success me-2">
                                    <i className="fa-solid fa-check" />
                                  </Link>
                                  <Link to="#" className="text-danger">
                                    <i className="fa-solid fa-xmark" />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <Link
                                    to="/doctor/appointments"
                                    className="table-avatar"
                                  >
                                    <img
                                      src={doctordashboardprofile3}
                                      alt="Img"
                                    />
                                  </Link>
                                  <div className="patient-name-info">
                                    <span>#Apt0003</span>
                                    <h5>
                                      <Link to="/doctor/appointments">
                                        Samuel Anderson
                                      </Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>03 Nov 2025 02.00 PM</h6>
                                  <span className="badge table-badge">General</span>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-actions d-flex align-items-center">
                                  <Link to="#" className="text-success me-2">
                                    <i className="fa-solid fa-check" />
                                  </Link>
                                  <Link to="#" className="text-danger">
                                    <i className="fa-solid fa-xmark" />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <Link
                                    to="/doctor/appointments"
                                    className="table-avatar"
                                  >
                                    <img
                                      src={doctordashboardprofile04}
                                      alt="Img"
                                    />
                                  </Link>
                                  <div className="patient-name-info">
                                    <span>#Apt0004</span>
                                    <h5>
                                      <Link to="/doctor/appointments">
                                        Catherine Griffin
                                      </Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>01 Nov 2025 04.00 PM</h6>
                                  <span className="badge table-badge">
                                    Clinic Consulting
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-actions d-flex align-items-center">
                                  <Link to="#" className="text-success me-2">
                                    <i className="fa-solid fa-check" />
                                  </Link>
                                  <Link to="#" className="text-danger">
                                    <i className="fa-solid fa-xmark" />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <Link
                                    to="/doctor/appointments"
                                    className="table-avatar"
                                  >
                                    <img
                                      src={doctordashboardprofile05}
                                      alt="Img"
                                    />
                                  </Link>
                                  <div className="patient-name-info">
                                    <span>#Apt0005</span>
                                    <h5>
                                      <Link to="/doctor/appointments">
                                        Robert Hutchinson
                                      </Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>28 Oct 2025 05.30 PM</h6>
                                  <span className="badge table-badge">General</span>
                                </div>
                              </td>
                              <td>
                                <div className="apponiment-actions d-flex align-items-center">
                                  <Link to="#" className="text-success me-2">
                                    <i className="fa-solid fa-check" />
                                  </Link>
                                  <Link to="#" className="text-danger">
                                    <i className="fa-solid fa-xmark" />
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
              <div className="row">
                <div className="col-xl-8 d-flex">
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Notifications</h5>
                      </div>
                      <div className="card-view-link">
                        <Link to="/professional/notifications">View All</Link>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      <div className="table-responsive">
                        <table className="table dashboard-table">
                          <tbody>
                            {profNotify.length === 0 ? (
                              <tr>
                                <td colSpan="15">
                                    <div className="col-lg-12">
                                    <div className="card doctor-list-card">
                                        <div className="d-md-flex align-items-center">
                                        <div className="card-body p-0">
                                            <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                                            <Link to="#" className="text-teal fw-medium fs-14">
                                                No notifications available for this professional
                                            </Link>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </td>
                            </tr>
                          ) : (
                            profNotify.map((data) => (
                              <tr key={data.id}>
                                <td>
                                  {data?.contract ?
                                  <div className="table-noti-info">
                                    <div className="table-noti-icon color-violet">
                                      <i className="fa-solid fa-bell" />
                                    </div>
                                    <div className="table-noti-message">
                                      <h6>
                                        <Link to="#" onClick={() => handleContractView(data.contract, data.facility.id)}><span>Contract</span> - {data.message}</Link>
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
                                        <Link to="#" onClick={() => handleRequestView(data.job_request, data.facility.id)} ><span>Job Request</span> - {data.message}</Link>
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
                <div className="col-xl-4 d-flex">
                  <div className="dashboard-card w-100">
                      <div className="dashboard-card-head">
                        <div className="header-title">
                          <h5>Recent Payments</h5>
                        </div>
                        <div className="card-view-link">
                          <Link to="#">View All</Link>
                        </div>
                      </div>
                      <div className="dashboard-card-body">
                        <div className="table-responsive">
                          <table className="table dashboard-table">
                            <tbody>
                              {profInvoices.length === 0 ? (
                              <tr>
                                <td colSpan="15">
                                  <div className="col-lg-12">
                                    <div className="card doctor-list-card">
                                      <div className="d-md-flex align-items-center">
                                        <div className="card-body p-0">
                                          <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                                            <Link to="#" className="text-teal fw-medium fs-14">
                                              No payments received for this professional
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                            profInvoices.map((data) => (
                              <tr>
                                <td>
                                  <div className="patient-info-profile">
                                    <div className="patient-name-info">
                                      <h5>
                                        <Link to="#">{data?.facility?.fac_first_name} {data?.facility?.fac_last_name}</Link>
                                      </h5>
                                      <span>{data?.invoice_no}</span>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="appointment-date-created">
                                    <span className="paid-text">Paid On</span>
                                    <h6>{data?.invoice_date ? moment(data.invoice_date).format("MMM DD YYYY") : ""}</h6>
                                  </div>
                                </td>
                                <td>
                                  <div className="appointment-date-created">
                                    <span className="paid-text">Amount</span>
                                    <h6>${data?.total_amount}</h6>
                                  </div>
                                </td>
                                {/* <td>
                                  <div className="apponiment-view d-flex align-items-center">
                                    <Link to="#">
                                      <i className="fa-solid fa-eye" />
                                    </Link>
                                  </div>
                                </td> */}
                              </tr>
                            )))}
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
      <SiteFooter {...props} />
    </div>
  );
};

export default ProfessionalDashboard;
