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
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import axios from "axios";
import { AUTH_TOKEN, API_BASE_URL, disciplineOptions } from "../config";
import { convertTo12HourFormat } from "../utils";
import moment  from "moment";
import ApexCharts from "apexcharts";

const AdminDashboard = (props) => {

    const [totalCount, setTotalCount] = useState({
      facility : "",
      professional : "",
      shifts : "",
      today_shifts : ""
    });

    const [WeekShifts, setWeekShifts] = useState(null)
    const [shifts, setShifts] = useState([])
    const [invoices, setinvoices] = useState([])
    const [filterType, setFilterType] = useState('Today')

  const fetchTotalCount = async () => {
    const data = {}
    try {
      const response = await axios.post(`${API_BASE_URL}/administrator/GetTotalCount/`, data, {
          headers: { 
              "Content-Type": "application/json",
              'Authorization': AUTH_TOKEN
            },
      });
      setTotalCount((prev) => ({
        ...prev,
        facility : response.data.facility,
        professional : response.data.professional,
        shifts : response.data.shifts,
        today_shifts : response.data.today_shifts
      }));
    } catch (err) {
      console.log("Error for fetchTotalCount", err)
      setError(err.response?.data?.Result || "An error occurred");
    }
  };

  const fetchWeekShifts = async () => {
    const data = {}
    try {
      const response = await axios.post(`${API_BASE_URL}/administrator/WeeklyShifts/`, data, {
          headers: { 
              "Content-Type": "application/json",
              'Authorization': AUTH_TOKEN
            },
      });
      setWeekShifts(response.data)
    } catch (err) {
      console.log("Error for fetchNotifications", err)
      setError(err.response?.data?.Result || "An error occurred");
    }
  }

  const fetchShifts = async () => {
    const data = {
      FilterType : filterType
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/administrator/AdminShifts/`, data, {
          headers: { 
              "Content-Type": "application/json",
              'Authorization': AUTH_TOKEN
            },
      });
      setShifts(response.data.data)
    } catch (err) {
      console.log("Error for fetchShifts", err)
      setError(err.response?.data?.Result || "An error occurred");
    }
  }

  const fetchInvoices = async () => {
    const data = {}
    try {
      const response = await axios.post(`${API_BASE_URL}/administrator/AdminInvoices/`, data, {
          headers: { 
              "Content-Type": "application/json",
              'Authorization': AUTH_TOKEN
            },
      });
      setinvoices(response.data.data)
    } catch (err) {
      console.log("Error for fetchInvoices", err)
      setError(err.response?.data?.Result || "An error occurred");
    }
  }

  

  useEffect(() => {
    fetchTotalCount()
    fetchWeekShifts()
    fetchShifts()
    fetchInvoices()
  }, [])

  useEffect(() => {
    fetchShifts()
  }, [filterType])


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
          WeekShifts?.daily_counts?.Monday ?? 0,
          WeekShifts?.daily_counts?.Tuesday ?? 0,
          WeekShifts?.daily_counts?.Wednesday ?? 0,
          WeekShifts?.daily_counts?.Thursday ?? 0,
          WeekShifts?.daily_counts?.Friday ?? 0,
          WeekShifts?.daily_counts?.Saturday ?? 0,
          WeekShifts?.daily_counts?.Sunday ?? 0
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

  console.log("invoices", invoices)
  console.log("shifts", shifts)
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
                      <Link to="/site-user/dashboard">Admin</Link>
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
                        <h6>Facilities</h6>
                        <h4>{totalCount?.facility ? totalCount.facility : "0" }</h4>
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
                        <h6>Professionals</h6>
                        <h4>{totalCount?.professional ? totalCount.professional : "0" }</h4>
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
                  <div className="dashboard-box-col w-100">
                    <div className="dashboard-widget-box">
                      <div className="dashboard-content-info">
                        <h6>Today Shifts</h6>
                        <h4>{totalCount?.today_shifts ? totalCount.today_shifts : "0" }</h4>
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
                  <div className="dashboard-box-col w-100">
                    <div className="dashboard-widget-box">
                      <div className="dashboard-content-info">
                        <h6>Total Contracts</h6>
                        <h4>978</h4>
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
                        <h6>Total Jobs</h6>
                        <h4>80</h4>
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
                        <h6>Shifts Today</h6>
                        <h4>50</h4>
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
                </div>
                <div className="col-xl-5 d-flex">
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Shifs</h5>
                      </div>
                      <div className="dropdown header-dropdown">
                        <Link
                          className="dropdown-toggle nav-tog"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          {filterType}
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <Link to="#" className="dropdown-item" onClick={() => setFilterType("Today")}>
                            Today
                          </Link>
                          <Link to="#" className="dropdown-item" onClick={() => setFilterType("This Month")}>
                            This Month
                          </Link>
                          <Link to="#" className="dropdown-item" onClick={() => setFilterType("Last 7 Days")}>
                            Last 7 Days
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      <div className="table-responsive">
                        <table className="table dashboard-table">
                          <tbody>
                            {shifts.length === 0 ? (
                              <tr>
                                <td colSpan="15">
                                  <div className="col-lg-12">
                                    <div className="card doctor-list-card">
                                      <div className="d-md-flex align-items-center">
                                        <div className="card-body p-0">
                                          <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                                            <Link to="#" className="text-teal fw-medium fs-14">
                                                No shifts available 
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                          ) : (
                          shifts.map((data) =>{
                            
                            const jobDiscipline = data?.job?.discipline ? disciplineOptions.find(option => option.value == data?.job?.discipline) : "N/A"
                            return(
                            <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <div className="patient-name-info">
                                    <span 
                                      style={{
                                        backgroundColor: jobDiscipline?.color || 'transparent',
                                        color: 'white',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        display: 'inline-block',
                                        fontSize: '13px',
                                        marginBottom: '5px'
                                      }}
                                    >
                                      {jobDiscipline?.label || "N/A"}
                                    </span>
                                    <h5>
                                      <Link to="#">
                                        {data?.facility ? `${data.facility.fac_first_name} ${data.facility.fac_last_name}`: "" }
                                      </Link>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <h6>{data?.job_wrk_hrs?.date ? moment(data.job_wrk_hrs.date).format("MMM DD YYYY") : ""} {data?.job_wrk_hrs?.slots ? `(${convertTo12HourFormat(data.job_wrk_hrs.slots.start_hr)} - ${convertTo12HourFormat(data.job_wrk_hrs.slots.end_hr)})` : ""}</h6>
                                  <span className="badge table-badge" style={{fontSize:"14px"}}>{data?.professional ? `${data.professional.prof_first_name} ${data.professional.prof_last_name}` : ""}</span>
                                </div>
                              </td>
                            </tr>
                          )}))}
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
                          <h6>{WeekShifts?.week_range?.start ? moment(WeekShifts?.week_range?.start).format("MMM DD") : ""} - {WeekShifts?.week_range?.end ? moment(WeekShifts?.week_range?.end).format("MMM DD") : ""}</h6>
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
                        <h5>Recent Professionals</h5>
                      </div>
                      <div className="card-view-link">
                        <Link to="/doctor/my-patients">View All</Link>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      <div className="d-flex recent-patient-grid-boxes">
                        <div className="recent-patient-grid">
                          <Link to="pages/patient-details" className="patient-img">
                            <img
                              src={doctordashboardprofile01}
                              alt="Img"
                            />
                          </Link>
                          <h5>
                            <Link to="pages/patient-details">Adrian Marshall</Link>
                          </h5>
                          <span>Professional ID :&nbsp;P0001</span>
                          <div className="date-info">
                            <p>Last Appointment 15 Mar 2025</p>
                          </div>
                        </div>
                        <div className="recent-patient-grid">
                          <Link to="pages/patient-details" className="patient-img">
                            <img
                              src={doctordashboardprofile02}
                              alt="Img"
                            />
                          </Link>
                          <h5>
                            <Link to="pages/patient-details">Kelly Stevens</Link>
                          </h5>
                          <span>Professional ID :&nbsp;P0002</span>
                          <div className="date-info">
                            <p>Last Appointment 13 Mar 2025</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 d-flex">
                  <div className="dashboard-main-col w-100">
                    <div className="upcoming-appointment-card">
                      <div className="title-card">
                        <h5>Upcoming Shift</h5>
                      </div>
                      <div className="upcoming-patient-info">
                        <div className="info-details">
                          <span className="img-avatar">
                            <img
                              src={doctordashboardprofile01}
                              alt="Img"
                            />
                          </span>
                          <div className="name-info">
                            <span>#Apt0001</span>
                            <h6>Adrian Marshall</h6>
                          </div>
                        </div>
                        <div className="date-details">
                          <span>General visit</span>
                          <h6>Today, 10:45 AM</h6>
                        </div>
                      </div>
                      <div className="appointment-card-footer">
                        <h5>
                          <i className="fa-solid fa-video" />
                          Video Appointment
                        </h5>
                        <div className="btn-appointments">
                          <Link to="/doctor/chat-doctor" className="btn">
                            Chat Now
                          </Link>
                          <Link to="/doctor/doctor-appointment-start" className="btn">
                            Start Appointment
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 d-flex">
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Recent Invoices</h5>
                      </div>
                      <div className="card-view-link">
                        <Link to="#">View All</Link>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      <div className="table-responsive">
                        <table className="table dashboard-table">
                          <tbody>
                            {invoices.length === 0 ? (
                              <tr>
                                <td colSpan="15">
                                  <div className="col-lg-12">
                                    <div className="card doctor-list-card">
                                      <div className="d-md-flex align-items-center">
                                        <div className="card-body p-0">
                                          <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                                            <Link to="#" className="text-teal fw-medium fs-14">
                                                No invoices available 
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                          ) : (
                            invoices.map((data) => (
                              <tr>
                              <td>
                                <div className="patient-info-profile">
                                  <div className="patient-name-info">
                                    <h5>
                                      <Link to="#">{data?.facility ? `${data.facility.fac_first_name} ${data.facility.fac_last_name}` : "N/A"}</Link>
                                    </h5>
                                    <span>{data?.invoice_no}</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Professional</span>
                                  <h6>{data?.professional ? `${data.professional.prof_first_name} ${data.professional.prof_last_name}` : "N/A"}</h6>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Amount</span>
                                  <h6>${data?.total_amount}</h6>
                                </div>
                              </td>
                              <td>
                                <div className="appointment-date-created">
                                  <span className="paid-text">Paid On</span>
                                  <h6>{data?.invoice_date ? moment(data.invoice_date).format("MMM DD YYYY") : "N/A"}</h6>
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
                <div className="col-xl-7 d-flex">
                  <div className="dashboard-card w-100">
                    <div className="dashboard-card-head">
                      <div className="header-title">
                        <h5>Notifications</h5>
                      </div>
                      <div className="card-view-link">
                        <Link to="#">View All</Link>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      <div className="table-responsive">
                        <table className="table dashboard-table">
                          <tbody>
                            <tr>
                              <td>
                                <div className="table-noti-info">
                                  <div className="table-noti-icon color-violet">
                                    <i className="fa-solid fa-bell" />
                                  </div>
                                  <div className="table-noti-message">
                                    <h6>
                                      <Link to="#">
                                        Booking Confirmed on{" "}
                                        <span> 21 Mar 2025 </span> 10:30 AM
                                      </Link>
                                    </h6>
                                    <span className="message-time">Just Now</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="table-noti-info">
                                  <div className="table-noti-icon color-blue">
                                    <i className="fa-solid fa-star" />
                                  </div>
                                  <div className="table-noti-message">
                                    <h6>
                                      <Link to="#">
                                        You have a <span> New </span> Review for
                                        your Appointment{" "}
                                      </Link>
                                    </h6>
                                    <span className="message-time">5 Days ago</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="table-noti-info">
                                  <div className="table-noti-icon color-red">
                                    <i className="fa-solid fa-calendar-check" />
                                  </div>
                                  <div className="table-noti-message">
                                    <h6>
                                      <Link to="#">
                                        You have Appointment with{" "}
                                        <span> Ahmed </span> by 01:20 PM{" "}
                                      </Link>
                                    </h6>
                                    <span className="message-time">12:55 PM</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="table-noti-info">
                                  <div className="table-noti-icon color-yellow">
                                    <i className="fa-solid fa-money-bill-1-wave" />
                                  </div>
                                  <div className="table-noti-message">
                                    <h6>
                                      <Link to="#">
                                        Sent an amount of <span> $200 </span> for an
                                        Appointment by 01:20 PM{" "}
                                      </Link>
                                    </h6>
                                    <span className="message-time">2 Days ago</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className="table-noti-info">
                                  <div className="table-noti-icon color-blue">
                                    <i className="fa-solid fa-star" />
                                  </div>
                                  <div className="table-noti-message">
                                    <h6>
                                      <Link to="#">
                                        You have a <span> New </span> Review for
                                        your Appointment{" "}
                                      </Link>
                                    </h6>
                                    <span className="message-time">5 Days ago</span>
                                  </div>
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
                        <h5>Clinics &amp; Availability</h5>
                      </div>
                    </div>
                    <div className="dashboard-card-body">
                      <div className="clinic-available">
                        <div className="clinic-head">
                          <div className="clinic-info">
                            <span className="clinic-img">
                              <img
                                src={doctordashboardclient02}
                                alt="Img"
                              />
                            </span>
                            <h6>Sofi’s Clinic</h6>
                          </div>
                          <div className="clinic-charge">
                            <span>$900</span>
                          </div>
                        </div>
                        <div className="available-time">
                          <ul>
                            <li>
                              <span>Tue :</span>
                              07:00 AM - 09:00 PM
                            </li>
                            <li>
                              <span>Wed : </span>
                              07:00 AM - 09:00 PM
                            </li>
                          </ul>
                          <div className="change-time">
                            <Link to="#">Change </Link>
                          </div>
                        </div>
                      </div>
                      <div className="clinic-available mb-0">
                        <div className="clinic-head">
                          <div className="clinic-info">
                            <span className="clinic-img">
                              <img
                                src={doctordashboardclient01}
                                alt="Img"
                              />
                            </span>
                            <h6>The Family Dentistry Clinic</h6>
                          </div>
                          <div className="clinic-charge">
                            <span>$600</span>
                          </div>
                        </div>
                        <div className="available-time">
                          <ul>
                            <li>
                              <span>Sat :</span>
                              07:00 AM - 09:00 PM
                            </li>
                            <li>
                              <span>Tue : </span>
                              07:00 AM - 09:00 PM
                            </li>
                          </ul>
                          <div className="change-time">
                            <Link to="#">Change </Link>
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
      </div>
      {/* /Page Content */}
      <SiteFooter {...props} />
    </div>
  );
};

export default AdminDashboard;
