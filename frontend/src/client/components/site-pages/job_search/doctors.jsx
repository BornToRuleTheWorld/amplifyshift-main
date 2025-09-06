import React, { useState,useEffect } from "react";
import { Link,useHistory } from "react-router-dom";
// import ImageWithBasePath from "../../../../../core/img/imagewithbasebath";
import { stateOptions, cntryOptions, disciplineOptions, specialtyOptions, langOptions, workExperienceOptions, docOptions, weeklyOptions, API_BASE_URL, AUTH_TOKEN, jobTypeOptions, visitType, } from "../config";
import axios from "axios";
const Doctors = ({data, success, error}) => {

  return (
    <>
    <div className="row align-items-center">
      <div className="col-md-6">
      {data.length === 0 ? null :
        <div className="mb-4">
          <h3>
            Showing <span className="text-secondary">{data.length}</span> Jobs
          </h3>
        </div>
      }
      </div>
      {/* <div className="col-md-6">
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
          <Link to="/facility/search-grid" className="btn btn-sm head-icon me-2">
            <i className="isax isax-grid-7" />
          </Link>
          <Link to="/facility/search" className="btn btn-sm head-icon active me-2">
            <i className="isax isax-row-vertical" />
          </Link>
          <Link to="/facility/search-list" className="btn btn-sm head-icon">
            <i className="isax isax-location" />
          </Link>
        </div>
      </div> */}
    </div>
    <div className="row">
      {data.length === 0 
      
      ?
      <div className="col-lg-12">
      <div className="card doctor-list-card">
        <div className="d-md-flex align-items-center">
          <div className="card-body p-0">
            <div className="d-flex align-items-center justify-content-between border-bottom p-3">
              <Link to="#" className="text-teal fw-medium fs-14">
                No jobs Found
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    :
    data.map((prof) => (
      <div className="col-lg-12" key={prof.id}>
        <div className="card doctor-list-card">
          <div className="d-md-flex align-items-center">
            <div className="card-body p-0">
              {/* <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                <Link to="#" className="text-teal fw-medium fs-14">
                Professional
                </Link>
                <span className="badge bg-success-light d-inline-flex align-items-center">
                  <i className="fa-solid fa-circle fs-5 me-1" />
                  Available
                </span>
              </div> */}
              <div className="p-3">
                <div className="doctor-info-detail pb-3">
                  <div className="row align-items-center gy-3">
                  <h6 className="d-flex align-items-center">
                    <Link to="#">{prof.job_title}</Link>
                    <i className="isax isax-tick-circle5 text-success ms-2" />
                  </h6>
                  <div className="col-auto">
                    <p className="fs-14 mb-0">
                      Discipline - {
                                    (() => {
                                      const option = disciplineOptions.find(disp => disp.value === prof.discipline);
                                      return option ? (
                                        <span style={{ backgroundColor: option.color, color:"white", padding:"5px",borderRadius:"5px" }}>{option.label}</span>
                                      ) : "N/A";
                                    })()
                                  }</p>
                  </div>
                  <div className="col-auto">
                    <p className="fs-14 mb-0">
                      Speciality - {specialtyOptions.find(option => option.value === prof.speciality)?.label}
                    </p>
                  </div>
                  <div className="col-auto">
                    <p className="d-flex align-items-center fs-14 mb-0">
                      <i className="isax isax-like-1 text-dark me-2" />
                      License - {prof.license ? prof.license : "N/A"}
                    </p>
                  </div>
                  <div className="col-auto">
                    <p className="d-flex align-items-center fs-14 mb-0">
                      <i className="isax isax-flag text-dark me-2" />
                      {visitType.find(option => option.value === prof.visit_type)?.label}
                    </p>
                  </div>
                  <div className="col-auto">
                    <p className="d-flex align-items-center fs-14 mb-0">
                      <i className="isax isax-language-circle text-dark me-2" />
                      { jobTypeOptions.find(option => option.value === prof.job_type)?.label}
                    </p>
                  </div>
                  <div className="col-auto">
                    <p className="d-flex align-items-center mb-0 fs-14 ">
                      <i className="isax isax-language-circle text-dark me-2" />
                      {langOptions.find(option => option.value === prof.languages)?.label}
                    </p>
                  </div>
                  <div className="col-auto">
                    <p className="mb-0 fs-14">
                      Work Setting - {workExperienceOptions.find(option => option.value === prof.work_setting)?.label}
                    </p>
                  </div>
                  <div className="col-auto">
                    <p className="d-flex align-items-center mb-0 fs-14">
                      <i className="isax isax-archive-14 text-dark me-2" />
                      {prof.years_of_exp} Years of Experience
                    </p>
                  </div>
                  <div className="col-auto">
                    <p className="d-flex align-items-center mb-0 fs-14">
                      <i className="isax isax-location me-2" />
                      {stateOptions.find(option => option.value == prof.state)?.label},&nbsp;{prof.zipcode},&nbsp;{cntryOptions.find(option => option.value == prof.country)?.label}
                    </p>
                  </div>
                    {/* <div className="col-sm-4">
                      <div>
                       
                        <p className="mb-2">
                          Discipline - {disciplineOptions.find(option => option.value === prof.discipline)?.label} 
                        </p>
                        <p className="mb-2">
                          Speciality - {specialtyOptions.find(option => option.value === prof.speciality)?.label}
                        </p>
                        <p className="mb-2">
                          Work Setting - {workExperienceOptions.find(option => option.value === prof.work_setting)?.label}
                        </p>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-like-1 text-dark me-2" />
                          License - {prof.license ? prof.license : "N/A"}
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-language-circle text-dark me-2" />
                          {langOptions.find(option => option.value === prof.languages)?.label}
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-frame-4 text-dark me-2" />
                          { jobTypeOptions.find(option => option.value === prof.job_type)?.label}
                        </p>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-flag text-dark me-2" />
                          {visitType.find(option => option.value === prof.visit_type)?.label}
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-archive-14 text-dark me-2" />
                          {prof.years_of_exp} Years of Experience
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-location me-2" />
                          {stateOptions.find(option => option.value == prof.state)?.label},&nbsp;{prof.zipcode},&nbsp;{cntryOptions.find(option => option.value == prof.country)?.label}
                        </p>
                      </div>
                    </div> */}
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mt-3">
                  <div className="d-flex align-items-center flex-wrap row-gap-3">
                    <div className="me-3">
                      {/* <p className="mb-1">Consultation Fees</p>
                      <h3 className="text-orange">$600</h3> */}
                    </div>
                    {/* <p className="mb-0">
                      Next available at <br />
                      10:00 AM - 15 Oct, Tue
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))
    }
      {/* <div className="col-lg-12">
        <div className="card doctor-list-card">
          <div className="d-md-flex align-items-center">
            <div className="card-body p-0">
              <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                <Link to="#" className="text-teal fw-medium fs-14">
                Professional
                </Link>
                <span className="badge bg-success-light d-inline-flex align-items-center">
                  <i className="fa-solid fa-circle fs-5 me-1" />
                  Available
                </span>
              </div>
              <div className="p-3">
                <div className="doctor-info-detail pb-3">
                  <div className="row align-items-center gy-3">
                    <div className="col-sm-6">
                      <div>
                        <h6 className="d-flex align-items-center mb-1">
                          <Link to="/patient/doctor-profile">Professional Name</Link>
                          <i className="isax isax-tick-circle5 text-success ms-2" />
                        </h6>
                        <p className="mb-2">Discipline, Speciality</p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-location me-2" />
                          State, City
                          <Link
                            to="#"
                            className="text-primary text-decoration-underline ms-2"
                          >
                            Get Direction
                          </Link>
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-language-circle text-dark me-2" />
                          English, French
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-like-1 text-dark me-2" />
                          98% (252 / 287 Votes)
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-archive-14 text-dark me-2" />
                          0-3 Years of Experience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mt-3">
                  <div className="d-flex align-items-center flex-wrap row-gap-3">
                    <div className="me-3">
                      <p className="mb-1">Consultation Fees</p>
                      <h3 className="text-orange">$600</h3>
                    </div>
                    <p className="mb-0">
                      Next available at <br />
                      10:00 AM - 15 Oct, Tue
                    </p>
                  </div>
                  <Link
                    to="/booking"
                    className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                  >
                    <i className="isax isax-calendar-1 me-2" />
                    Send Request
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="col-lg-12">
        <div className="card doctor-list-card">
          <div className="d-md-flex align-items-center">
            <div className="card-body p-0">
              <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                <Link to="#" className="text-teal fw-medium fs-14">
                Professional
                </Link>
                <span className="badge bg-success-light d-inline-flex align-items-center">
                  <i className="fa-solid fa-circle fs-5 me-1" />
                  Available
                </span>
              </div>
              <div className="p-3">
                <div className="doctor-info-detail pb-3">
                  <div className="row align-items-center gy-3">
                    <div className="col-sm-6">
                      <div>
                        <h6 className="d-flex align-items-center mb-1">
                          <Link to="/patient/doctor-profile">Professional Name</Link>
                          <i className="isax isax-tick-circle5 text-success ms-2" />
                        </h6>
                        <p className="mb-2">Discipline, Speciality</p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-location me-2" />
                          State, City
                          <Link
                            to="#"
                            className="text-primary text-decoration-underline ms-2"
                          >
                            Get Direction
                          </Link>
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-language-circle text-dark me-2" />
                          English, French
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-like-1 text-dark me-2" />
                          98% (252 / 287 Votes)
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-archive-14 text-dark me-2" />
                          0-3 Years of Experience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mt-3">
                  <div className="d-flex align-items-center flex-wrap row-gap-3">
                    <div className="me-3">
                      <p className="mb-1">Consultation Fees</p>
                      <h3 className="text-orange">$600</h3>
                    </div>
                    <p className="mb-0">
                      Next available at <br />
                      10:00 AM - 15 Oct, Tue
                    </p>
                  </div>
                  <Link
                    to="/booking"
                    className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                  >
                    <i className="isax isax-calendar-1 me-2" />
                    Send Request
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="col-lg-12">
        <div className="card doctor-list-card">
          <div className="d-md-flex align-items-center">
            <div className="card-body p-0">
              <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                <Link to="#" className="text-teal fw-medium fs-14">
                Professional
                </Link>
                <span className="badge bg-success-light d-inline-flex align-items-center">
                  <i className="fa-solid fa-circle fs-5 me-1" />
                  Available
                </span>
              </div>
              <div className="p-3">
                <div className="doctor-info-detail pb-3">
                  <div className="row align-items-center gy-3">
                    <div className="col-sm-6">
                      <div>
                        <h6 className="d-flex align-items-center mb-1">
                          <Link to="/patient/doctor-profile">Professional Name</Link>
                          <i className="isax isax-tick-circle5 text-success ms-2" />
                        </h6>
                        <p className="mb-2">Discipline, Speciality</p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-location me-2" />
                          State, City
                          <Link
                            to="#"
                            className="text-primary text-decoration-underline ms-2"
                          >
                            Get Direction
                          </Link>
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-language-circle text-dark me-2" />
                          English, French
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-like-1 text-dark me-2" />
                          98% (252 / 287 Votes)
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-archive-14 text-dark me-2" />
                          0-3 Years of Experience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mt-3">
                  <div className="d-flex align-items-center flex-wrap row-gap-3">
                    <div className="me-3">
                      <p className="mb-1">Consultation Fees</p>
                      <h3 className="text-orange">$600</h3>
                    </div>
                    <p className="mb-0">
                      Next available at <br />
                      10:00 AM - 15 Oct, Tue
                    </p>
                  </div>
                  <Link
                    to="/booking"
                    className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                  >
                    <i className="isax isax-calendar-1 me-2" />
                    Send Request
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="col-lg-12">
        <div className="card doctor-list-card">
          <div className="d-md-flex align-items-center">
            <div className="card-body p-0">
              <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                <Link to="#" className="text-teal fw-medium fs-14">
                Professional
                </Link>
                <span className="badge bg-success-light d-inline-flex align-items-center">
                  <i className="fa-solid fa-circle fs-5 me-1" />
                  Available
                </span>
              </div>
              <div className="p-3">
                <div className="doctor-info-detail pb-3">
                  <div className="row align-items-center gy-3">
                    <div className="col-sm-6">
                      <div>
                        <h6 className="d-flex align-items-center mb-1">
                          <Link to="/patient/doctor-profile">Professional Name</Link>
                          <i className="isax isax-tick-circle5 text-success ms-2" />
                        </h6>
                        <p className="mb-2">Discipline, Speciality</p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-location me-2" />
                          State, City
                          <Link
                            to="#"
                            className="text-primary text-decoration-underline ms-2"
                          >
                            Get Direction
                          </Link>
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-language-circle text-dark me-2" />
                          English, French
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-like-1 text-dark me-2" />
                          98% (252 / 287 Votes)
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-archive-14 text-dark me-2" />
                          0-3 Years of Experience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mt-3">
                  <div className="d-flex align-items-center flex-wrap row-gap-3">
                    <div className="me-3">
                      <p className="mb-1">Consultation Fees</p>
                      <h3 className="text-orange">$600</h3>
                    </div>
                    <p className="mb-0">
                      Next available at <br />
                      10:00 AM - 15 Oct, Tue
                    </p>
                  </div>
                  <Link
                    to="/booking"
                    className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                  >
                    <i className="isax isax-calendar-1 me-2" />
                    Send Request
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="col-lg-12">
        <div className="card doctor-list-card">
          <div className="d-md-flex align-items-center">
            <div className="card-body p-0">
              <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                <Link to="#" className="text-teal fw-medium fs-14">
                Professional
                </Link>
                <span className="badge bg-success-light d-inline-flex align-items-center">
                  <i className="fa-solid fa-circle fs-5 me-1" />
                  Available
                </span>
              </div>
              <div className="p-3">
                <div className="doctor-info-detail pb-3">
                  <div className="row align-items-center gy-3">
                    <div className="col-sm-6">
                      <div>
                        <h6 className="d-flex align-items-center mb-1">
                          <Link to="/patient/doctor-profile">Professional Name</Link>
                          <i className="isax isax-tick-circle5 text-success ms-2" />
                        </h6>
                        <p className="mb-2">Discipline, Speciality</p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-location me-2" />
                          State, City
                          <Link
                            to="#"
                            className="text-primary text-decoration-underline ms-2"
                          >
                            Get Direction
                          </Link>
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-language-circle text-dark me-2" />
                          English, French
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-like-1 text-dark me-2" />
                          98% (252 / 287 Votes)
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-archive-14 text-dark me-2" />
                          0-3 Years of Experience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mt-3">
                  <div className="d-flex align-items-center flex-wrap row-gap-3">
                    <div className="me-3">
                      <p className="mb-1">Consultation Fees</p>
                      <h3 className="text-orange">$600</h3>
                    </div>
                    <p className="mb-0">
                      Next available at <br />
                      10:00 AM - 15 Oct, Tue
                    </p>
                  </div>
                  <Link
                    to="/booking"
                    className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                  >
                    <i className="isax isax-calendar-1 me-2" />
                    Send Request
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="col-lg-12">
        <div className="card doctor-list-card">
          <div className="d-md-flex align-items-center">
            <div className="card-body p-0">
              <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                <Link to="#" className="text-teal fw-medium fs-14">
                Professional
                </Link>
                <span className="badge bg-success-light d-inline-flex align-items-center">
                  <i className="fa-solid fa-circle fs-5 me-1" />
                  Available
                </span>
              </div>
              <div className="p-3">
                <div className="doctor-info-detail pb-3">
                  <div className="row align-items-center gy-3">
                    <div className="col-sm-6">
                      <div>
                        <h6 className="d-flex align-items-center mb-1">
                          <Link to="/patient/doctor-profile">Professional Name</Link>
                          <i className="isax isax-tick-circle5 text-success ms-2" />
                        </h6>
                        <p className="mb-2">Discipline, Speciality</p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-location me-2" />
                          State, City
                          <Link
                            to="#"
                            className="text-primary text-decoration-underline ms-2"
                          >
                            Get Direction
                          </Link>
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-language-circle text-dark me-2" />
                          English, French
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-like-1 text-dark me-2" />
                          98% (252 / 287 Votes)
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-archive-14 text-dark me-2" />
                          0-3 Years of Experience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mt-3">
                  <div className="d-flex align-items-center flex-wrap row-gap-3">
                    <div className="me-3">
                      <p className="mb-1">Consultation Fees</p>
                      <h3 className="text-orange">$600</h3>
                    </div>
                    <p className="mb-0">
                      Next available at <br />
                      10:00 AM - 15 Oct, Tue
                    </p>
                  </div>
                  <Link
                    to="/booking"
                    className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                  >
                    <i className="isax isax-calendar-1 me-2" />
                    Send Request
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="col-lg-12">
        <div className="card doctor-list-card">
          <div className="d-md-flex align-items-center">
            <div className="card-body p-0">
              <div className="d-flex align-items-center justify-content-between border-bottom p-3">
                <Link to="#" className="text-teal fw-medium fs-14">
                Professional
                </Link>
                <span className="badge bg-success-light d-inline-flex align-items-center">
                  <i className="fa-solid fa-circle fs-5 me-1" />
                  Available
                </span>
              </div>
              <div className="p-3">
                <div className="doctor-info-detail pb-3">
                  <div className="row align-items-center gy-3">
                    <div className="col-sm-6">
                      <div>
                        <h6 className="d-flex align-items-center mb-1">
                          <Link to="/patient/doctor-profile">Professional Name</Link>
                          <i className="isax isax-tick-circle5 text-success ms-2" />
                        </h6>
                        <p className="mb-2">Discipline, Speciality</p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-location me-2" />
                          State, City
                          <Link
                            to="#"
                            className="text-primary text-decoration-underline ms-2"
                          >
                            Get Direction
                          </Link>
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-language-circle text-dark me-2" />
                          English, French
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14 mb-2">
                          <i className="isax isax-like-1 text-dark me-2" />
                          98% (252 / 287 Votes)
                        </p>
                        <p className="d-flex align-items-center mb-0 fs-14">
                          <i className="isax isax-archive-14 text-dark me-2" />
                          0-3 Years of Experience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mt-3">
                  <div className="d-flex align-items-center flex-wrap row-gap-3">
                    <div className="me-3">
                      <p className="mb-1">Consultation Fees</p>
                      <h3 className="text-orange">$600</h3>
                    </div>
                    <p className="mb-0">
                      Next available at <br />
                      10:00 AM - 15 Oct, Tue
                    </p>
                  </div>
                  <Link
                    to="/booking"
                    className="btn btn-md btn-primary-gradient d-inline-flex align-items-center rounded-pill"
                  >
                    <i className="isax isax-calendar-1 me-2" />
                    Send Request
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="col-md-12">
        <div className="pagination dashboard-pagination mt-md-3 mt-0 mb-4">
          <ul>
            <li>
              <Link to="#" className="page-link prev">
                Prev
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
              <Link to="#" className="page-link next">
                Next
              </Link>
            </li>
          </ul>
        </div>
      </div> */}
    </div>
  </>
  
  );
};

export default Doctors;
