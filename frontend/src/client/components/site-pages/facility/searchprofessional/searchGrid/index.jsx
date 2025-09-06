import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import SiteHeader from "../../../home/header";
import ImageWithBasePath from "../../../../../../core/img/imagewithbasebath";
import { DatePicker, Slider } from "antd";
import Searchfilter from "../search/searchfilter";
import StickyBox from "react-sticky-box";

const SearchGrid = (props) => {
  useEffect(() => {
    document.body.classList.add("map-page");

    return () => document.body.classList.remove("map-page");
  }, []);


  const specialities = [
    { value: 'Specialities', label: 'Specialities' },
    { value: 'Urology', label: 'Urology' },
    { value: 'Psychiatry', label: 'Psychiatry' },
    { value: 'Psychiatry', label: 'Psychiatry' },
    { value: 'Cardiology', label: 'Cardiology' },
  ];
  const reviews = [
    { value: 'Reviews', label: 'Reviews' },
    { value: '5 Star', label: '5 Star' },
    { value: '4 Star', label: '4 Star' },
    { value: '3 Star', label: '3 Star' },
  ];
  const clinic = [
    { value: 'Bright Smiles Dental Clinic', label: 'Bright Smiles Dental Clinic' },
    { value: 'Family Care Clinic', label: 'Family Care Clinic' },
    { value: 'Express Health Clinic', label: 'Express Health Clinic' },
  ];


  const formatter = (value) => `$${value}`;

  const [showMenu,setShowMenu] = useState(false)
    const [showMenu2,setShowMenu2] = useState(false)
    const [showMenu3,setShowMenu3] = useState(false)
    const [showMenu4,setShowMenu4] = useState(false)

  return (
    <>
      <SiteHeader {...props} />
      {/* Breadcrumb */}
      <div className="breadcrumb-bar overflow-visible">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home">
                      <i className="isax isax-home-15" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">Facility</li>
                  <li className="breadcrumb-item active">Search</li>
                </ol>
                <h2 className="breadcrumb-title">Search Grid</h2>
              </nav>
            </div>
          </div>
          <div className="bg-primary-gradient rounded-pill doctors-search-box">
            <div className="search-box-one rounded-pill">
              <form>
                <div className="search-input search-line">
                  <i className="isax isax-hospital5 bficon" />
                  <div className=" mb-0">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for Discipline"
                    />
                  </div>
                </div>
                <div className="search-input search-map-line">
                  <i className="isax isax-location5" />
                  <div className=" mb-0">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Zipcode"
                    />
                  </div>
                </div>
                <div className="search-input search-calendar-line">
                  <i className="isax isax-calendar-tick5" />
                  <div className=" mb-0">
                    <DatePicker
                      className="form-control datetimepicker"
                      placeholder="Start Date"
                    />
                  </div>
                </div>
                <div className="search-input search-calendar-line">
                  <i className="isax isax-calendar-tick5" />
                  <div className=" mb-0">
                    <DatePicker
                      className="form-control datetimepicker"
                      placeholder="End Date"
                    />
                  </div>
                </div>
                <div className="form-search-btn">
                  <button
                    className="btn btn-primary d-inline-flex align-items-center rounded-pill"
                    type="submit"
                  >
                    <i className="isax isax-search-normal-15 me-2" />
                    Search
                  </button>
                </div>
              </form>
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

      <div className="content mt-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-3  theiaStickySidebar">
              <StickyBox offsetTop={20} offsetBottom={20}>
                <Searchfilter/>
              </StickyBox>
            </div>
            <div className="col-xl-9">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="mb-4">
                    <h3>
                      Showing <span className="text-secondary">450</span> Doctors For
                      You
                    </h3>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center justify-content-end mb-4">
                    <div className="doctor-filter-availability me-2">
                      <p>Availability</p>
                      <div className="status-toggle status-tog">
                        <input type="checkbox" id="status_6" className="check" />
                        <label htmlFor="status_6" className="checktoggle">
                          checkbox
                        </label>
                      </div>
                    </div>
                    <div className="dropdown header-dropdown me-2">
                      <Link
                        className="dropdown-toggle sort-dropdown"
                        data-bs-toggle="dropdown"
                        to="#"
                        aria-expanded="false"
                      >
                        <span>Sort By</span>Price (Low to High)
                      </Link>
                      <div className="dropdown-menu dropdown-menu-end">
                        <Link to="#" className="dropdown-item">
                          Price (Low to High)
                        </Link>
                        <Link to="#" className="dropdown-item">
                          Price (High to Low)
                        </Link>
                      </div>
                    </div>
                    <Link
                      to="/facility/search-grid"
                      className="btn btn-sm head-icon active me-2"
                    >
                      <i className="isax isax-grid-7" />
                    </Link>
                    <Link to="/facility/search" className="btn btn-sm head-icon me-2">
                      <i className="isax isax-row-vertical" />
                    </Link>
                    <Link to="/facility/search-list" className="btn btn-sm head-icon">
                      <i className="isax isax-location" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xxl-4 col-md-6">
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="d-flex active-bar align-items-center justify-content-between p-3">
                        <Link to="#" className="text-indigo fw-medium fs-14">
                          Professional
                        </Link>
                        <span className="badge bg-success-light d-inline-flex align-items-center">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Available
                        </span>
                      </div>
                      <div className="p-3 pt-0">
                        <div className="doctor-info-detail mb-3 pb-3">
                          <h3 className="mb-1">
                            <Link to="/patient/doctor-profile">Professional Name</Link>
                          </h3>
                          <div className="d-flex align-items-center">
                            <p className="d-flex align-items-center mb-0 fs-14">
                              <i className="isax isax-location me-2" />
                              City, State
                            </p>
                            {/* <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1" />
                            <span className="fs-14 fw-medium">30 Min</span> */}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <p className="mb-1">Consultation Fees</p>
                            <h3 className="text-orange">$650</h3>
                          </div>
                          <Link
                            to="/booking"
                            className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                          >
                            <i className="isax isax-calendar-1 me-2" />
                            Send Request
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="card">
                  <div className="card-body p-0">
                      <div className="d-flex active-bar align-items-center justify-content-between p-3">
                        <Link to="#" className="text-indigo fw-medium fs-14">
                          Professional
                        </Link>
                        <span className="badge bg-success-light d-inline-flex align-items-center">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Available
                        </span>
                      </div>
                      <div className="p-3 pt-0">
                        <div className="doctor-info-detail mb-3 pb-3">
                          <h3 className="mb-1">
                            <Link to="/patient/doctor-profile">Professional Name</Link>
                          </h3>
                          <div className="d-flex align-items-center">
                            <p className="d-flex align-items-center mb-0 fs-14">
                              <i className="isax isax-location me-2" />
                              City, State
                            </p>
                            {/* <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1" />
                            <span className="fs-14 fw-medium">30 Min</span> */}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <p className="mb-1">Consultation Fees</p>
                            <h3 className="text-orange">$650</h3>
                          </div>
                          <Link
                            to="/booking"
                            className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                          >
                            <i className="isax isax-calendar-1 me-2" />
                            Send Request
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="card">
                  <div className="card-body p-0">
                      <div className="d-flex active-bar align-items-center justify-content-between p-3">
                        <Link to="#" className="text-indigo fw-medium fs-14">
                          Professional
                        </Link>
                        <span className="badge bg-success-light d-inline-flex align-items-center">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Available
                        </span>
                      </div>
                      <div className="p-3 pt-0">
                        <div className="doctor-info-detail mb-3 pb-3">
                          <h3 className="mb-1">
                            <Link to="/patient/doctor-profile">Professional Name</Link>
                          </h3>
                          <div className="d-flex align-items-center">
                            <p className="d-flex align-items-center mb-0 fs-14">
                              <i className="isax isax-location me-2" />
                              City, State
                            </p>
                            {/* <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1" />
                            <span className="fs-14 fw-medium">30 Min</span> */}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <p className="mb-1">Consultation Fees</p>
                            <h3 className="text-orange">$650</h3>
                          </div>
                          <Link
                            to="/booking"
                            className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                          >
                            <i className="isax isax-calendar-1 me-2" />
                            Send Request
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="card">
                  <div className="card-body p-0">
                      <div className="d-flex active-bar align-items-center justify-content-between p-3">
                        <Link to="#" className="text-indigo fw-medium fs-14">
                          Professional
                        </Link>
                        <span className="badge bg-success-light d-inline-flex align-items-center">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Available
                        </span>
                      </div>
                      <div className="p-3 pt-0">
                        <div className="doctor-info-detail mb-3 pb-3">
                          <h3 className="mb-1">
                            <Link to="/patient/doctor-profile">Professional Name</Link>
                          </h3>
                          <div className="d-flex align-items-center">
                            <p className="d-flex align-items-center mb-0 fs-14">
                              <i className="isax isax-location me-2" />
                              City, State
                            </p>
                            {/* <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1" />
                            <span className="fs-14 fw-medium">30 Min</span> */}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <p className="mb-1">Consultation Fees</p>
                            <h3 className="text-orange">$650</h3>
                          </div>
                          <Link
                            to="/booking"
                            className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                          >
                            <i className="isax isax-calendar-1 me-2" />
                            Send Request
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="card">
                  <div className="card-body p-0">
                      <div className="d-flex active-bar align-items-center justify-content-between p-3">
                        <Link to="#" className="text-indigo fw-medium fs-14">
                          Professional
                        </Link>
                        <span className="badge bg-success-light d-inline-flex align-items-center">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Available
                        </span>
                      </div>
                      <div className="p-3 pt-0">
                        <div className="doctor-info-detail mb-3 pb-3">
                          <h3 className="mb-1">
                            <Link to="/patient/doctor-profile">Professional Name</Link>
                          </h3>
                          <div className="d-flex align-items-center">
                            <p className="d-flex align-items-center mb-0 fs-14">
                              <i className="isax isax-location me-2" />
                              City, State
                            </p>
                            {/* <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1" />
                            <span className="fs-14 fw-medium">30 Min</span> */}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <p className="mb-1">Consultation Fees</p>
                            <h3 className="text-orange">$650</h3>
                          </div>
                          <Link
                            to="/booking"
                            className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                          >
                            <i className="isax isax-calendar-1 me-2" />
                            Send Request
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="card">
                  <div className="card-body p-0">
                      <div className="d-flex active-bar align-items-center justify-content-between p-3">
                        <Link to="#" className="text-indigo fw-medium fs-14">
                          Professional
                        </Link>
                        <span className="badge bg-success-light d-inline-flex align-items-center">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Available
                        </span>
                      </div>
                      <div className="p-3 pt-0">
                        <div className="doctor-info-detail mb-3 pb-3">
                          <h3 className="mb-1">
                            <Link to="/patient/doctor-profile">Professional Name</Link>
                          </h3>
                          <div className="d-flex align-items-center">
                            <p className="d-flex align-items-center mb-0 fs-14">
                              <i className="isax isax-location me-2" />
                              City, State
                            </p>
                            {/* <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1" />
                            <span className="fs-14 fw-medium">30 Min</span> */}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <p className="mb-1">Consultation Fees</p>
                            <h3 className="text-orange">$650</h3>
                          </div>
                          <Link
                            to="/booking"
                            className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                          >
                            <i className="isax isax-calendar-1 me-2" />
                            Send Request
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="card">
                  <div className="card-body p-0">
                      <div className="d-flex active-bar align-items-center justify-content-between p-3">
                        <Link to="#" className="text-indigo fw-medium fs-14">
                          Professional
                        </Link>
                        <span className="badge bg-success-light d-inline-flex align-items-center">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Available
                        </span>
                      </div>
                      <div className="p-3 pt-0">
                        <div className="doctor-info-detail mb-3 pb-3">
                          <h3 className="mb-1">
                            <Link to="/patient/doctor-profile">Professional Name</Link>
                          </h3>
                          <div className="d-flex align-items-center">
                            <p className="d-flex align-items-center mb-0 fs-14">
                              <i className="isax isax-location me-2" />
                              City, State
                            </p>
                            {/* <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1" />
                            <span className="fs-14 fw-medium">30 Min</span> */}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <p className="mb-1">Consultation Fees</p>
                            <h3 className="text-orange">$650</h3>
                          </div>
                          <Link
                            to="/booking"
                            className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                          >
                            <i className="isax isax-calendar-1 me-2" />
                            Send Request
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="card">
                  <div className="card-body p-0">
                      <div className="d-flex active-bar align-items-center justify-content-between p-3">
                        <Link to="#" className="text-indigo fw-medium fs-14">
                          Professional
                        </Link>
                        <span className="badge bg-success-light d-inline-flex align-items-center">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Available
                        </span>
                      </div>
                      <div className="p-3 pt-0">
                        <div className="doctor-info-detail mb-3 pb-3">
                          <h3 className="mb-1">
                            <Link to="/patient/doctor-profile">Professional Name</Link>
                          </h3>
                          <div className="d-flex align-items-center">
                            <p className="d-flex align-items-center mb-0 fs-14">
                              <i className="isax isax-location me-2" />
                              City, State
                            </p>
                            {/* <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1" />
                            <span className="fs-14 fw-medium">30 Min</span> */}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <p className="mb-1">Consultation Fees</p>
                            <h3 className="text-orange">$650</h3>
                          </div>
                          <Link
                            to="/booking"
                            className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                          >
                            <i className="isax isax-calendar-1 me-2" />
                            Send Request
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="card">
                  <div className="card-body p-0">
                      <div className="d-flex active-bar align-items-center justify-content-between p-3">
                        <Link to="#" className="text-indigo fw-medium fs-14">
                          Professional
                        </Link>
                        <span className="badge bg-success-light d-inline-flex align-items-center">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Available
                        </span>
                      </div>
                      <div className="p-3 pt-0">
                        <div className="doctor-info-detail mb-3 pb-3">
                          <h3 className="mb-1">
                            <Link to="/patient/doctor-profile">Professional Name</Link>
                          </h3>
                          <div className="d-flex align-items-center">
                            <p className="d-flex align-items-center mb-0 fs-14">
                              <i className="isax isax-location me-2" />
                              City, State
                            </p>
                            {/* <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1" />
                            <span className="fs-14 fw-medium">30 Min</span> */}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <p className="mb-1">Consultation Fees</p>
                            <h3 className="text-orange">$650</h3>
                          </div>
                          <Link
                            to="/booking"
                            className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                          >
                            <i className="isax isax-calendar-1 me-2" />
                            Send Request
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="card">
                  <div className="card-body p-0">
                      <div className="d-flex active-bar align-items-center justify-content-between p-3">
                        <Link to="#" className="text-indigo fw-medium fs-14">
                          Professional
                        </Link>
                        <span className="badge bg-success-light d-inline-flex align-items-center">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Available
                        </span>
                      </div>
                      <div className="p-3 pt-0">
                        <div className="doctor-info-detail mb-3 pb-3">
                          <h3 className="mb-1">
                            <Link to="/patient/doctor-profile">Professional Name</Link>
                          </h3>
                          <div className="d-flex align-items-center">
                            <p className="d-flex align-items-center mb-0 fs-14">
                              <i className="isax isax-location me-2" />
                              City, State
                            </p>
                            {/* <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1" />
                            <span className="fs-14 fw-medium">30 Min</span> */}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <p className="mb-1">Consultation Fees</p>
                            <h3 className="text-orange">$650</h3>
                          </div>
                          <Link
                            to="/booking"
                            className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                          >
                            <i className="isax isax-calendar-1 me-2" />
                            Send Request
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="card">
                  <div className="card-body p-0">
                      <div className="d-flex active-bar align-items-center justify-content-between p-3">
                        <Link to="#" className="text-indigo fw-medium fs-14">
                          Professional
                        </Link>
                        <span className="badge bg-success-light d-inline-flex align-items-center">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Available
                        </span>
                      </div>
                      <div className="p-3 pt-0">
                        <div className="doctor-info-detail mb-3 pb-3">
                          <h3 className="mb-1">
                            <Link to="/patient/doctor-profile">Professional Name</Link>
                          </h3>
                          <div className="d-flex align-items-center">
                            <p className="d-flex align-items-center mb-0 fs-14">
                              <i className="isax isax-location me-2" />
                              City, State
                            </p>
                            {/* <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1" />
                            <span className="fs-14 fw-medium">30 Min</span> */}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <p className="mb-1">Consultation Fees</p>
                            <h3 className="text-orange">$650</h3>
                          </div>
                          <Link
                            to="/booking"
                            className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                          >
                            <i className="isax isax-calendar-1 me-2" />
                            Send Request
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="card">
                  <div className="card-body p-0">
                      <div className="d-flex active-bar align-items-center justify-content-between p-3">
                        <Link to="#" className="text-indigo fw-medium fs-14">
                          Professional
                        </Link>
                        <span className="badge bg-success-light d-inline-flex align-items-center">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Available
                        </span>
                      </div>
                      <div className="p-3 pt-0">
                        <div className="doctor-info-detail mb-3 pb-3">
                          <h3 className="mb-1">
                            <Link to="/patient/doctor-profile">Professional Name</Link>
                          </h3>
                          <div className="d-flex align-items-center">
                            <p className="d-flex align-items-center mb-0 fs-14">
                              <i className="isax isax-location me-2" />
                              City, State
                            </p>
                            {/* <i className="fa-solid fa-circle fs-5 text-primary mx-2 me-1" />
                            <span className="fs-14 fw-medium">30 Min</span> */}
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <p className="mb-1">Consultation Fees</p>
                            <h3 className="text-orange">$650</h3>
                          </div>
                          <Link
                            to="/booking"
                            className="btn btn-md btn-dark d-inline-flex align-items-center rounded-pill"
                          >
                            <i className="isax isax-calendar-1 me-2" />
                            Send Request
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="text-center mb-4">
                    <Link
                      to="/login"
                      className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                    >
                      <i className="isax isax-d-cube-scan5 me-2" />
                      Load More 425 Doctors
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default SearchGrid;
