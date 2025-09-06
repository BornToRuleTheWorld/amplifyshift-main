import React, {useState, useEffect} from "react";
import Header from "../../header.jsx";
import SiteHeader from "../home/header.jsx";
import SiteFooter from "../home/footer.jsx";
import DoctorFooter from "../../common/doctorFooter/index.jsx";
import { doctordashboardprofile01, doctordashboardprofile02, doctordashboardprofile04, doctordashboardprofile05, doctordashboardprofile06, doctordashboardprofile07, doctordashboardprofile08, doctordashboardprofile3 } from "../../imagepath.jsx";
import { Link, useHistory} from "react-router-dom";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
import axios from "axios";
import {AUTH_TOKEN, API_BASE_URL, disciplineOptions} from '../config';
import {convertTo12HourFormat} from "../utils";
import FacilityHourCalender from "../work_hours/facilityWorkHours.jsx";

const FacilityShifts = (props) => {
  const FacID = atob(localStorage.getItem('RecordID')) || "";
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
      <div className="content pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-xl-12">
              <div className="tab-content appointment-tab-content">
                <FacilityHourCalender ID={FacID} Role={'Facility'}/>
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

export default FacilityShifts;
