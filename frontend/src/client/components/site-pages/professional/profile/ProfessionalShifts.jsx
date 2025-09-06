import React, {useState, useEffect} from "react";
import SiteHeader from "../../home/header.jsx";
import SiteFooter from "../../home/footer.jsx";
import { doctordashboardprofile01, doctordashboardprofile02, doctordashboardprofile04, doctordashboardprofile05, doctordashboardprofile06, doctordashboardprofile07, doctordashboardprofile08, doctordashboardprofile3 } from "../../../imagepath.jsx";
import { Link, useHistory } from "react-router-dom";
import ImageWithBasePath from "../../../../../core/img/imagewithbasebath.jsx";
import WorkHours from "../../work_hours/workHours.jsx";
import WorkHoursCalender from "../../work_hours/workCalender.jsx";
import axios from "axios";
import {AUTH_TOKEN, API_BASE_URL} from '../../config';
import ProfessionalNav from "./ProfessionalNav.jsx";
import { FaTimesCircle, FaEye, FaSearch, FaHourglassHalf, FaPlusCircle, FaPlus } from "react-icons/fa";
import { Calendar, theme } from 'antd';

const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
};

const ProfessionalShift = (props) => {
  
  const [showWorkHours, setShowWorkHours] = useState(false);
  const ProfID = atob(localStorage.getItem('userID')) || "";
  const [profData, setProfData] = useState([]);
  const history = useHistory();

  const { token } = theme.useToken();
  const wrapperStyle = {
    width: '100%',
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  useEffect(() => {
      axios
        .get( `${API_BASE_URL}/professional/GetProfSlot/?ProfUserID=${ProfID}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN,
          }
        })
        .then((response) => {
          setProfData(response.data.data);
        })
        .catch((err) => {
          console.error('Error fetching facility data:', err)
        });
    }, [ProfID, AUTH_TOKEN]);

    const handleAdd = () => history.push('/professional/addshift')


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
                    {/* <li className="breadcrumb-item active">
                        <Link to="/professional/myprofile">Profile</Link>
                    </li> */}
                  </ol>
                  <h2 className="breadcrumb-title">My Shifts</h2>
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
      <div className="content pt-5">
        <div className="container">
         {/* <ProfessionalNav/> */}
          <div className="row">
            <div className="col-lg-12 col-xl-12">
            <div className="card border-0">
                <div className="card-body">
                    <div className="dashboard-header">
                        <h5></h5>
                        {
                        profData.length === 0 ? null :
                        <ul className="header-list-btns">
                        <li>
                            <div className="view-icons">
                            <Link to="#" className = {showWorkHours ? "" : "active"} onClick={()=>setShowWorkHours(false)}>
                            <i className="isax isax-calendar-tick"></i>
                            </Link>
                            </div>
                        </li>
                        <li>
                            <div className="view-icons">
                            <Link to="#" className = {showWorkHours ? "active" : ""} onClick={()=>setShowWorkHours(true)}>
                            <i className="isax isax-grid-7"></i>
                            </Link>
                            </div>
                        </li>
                        </ul>
                    }
                    </div>
                    <div className="tab-content appointment-tab-content">
                      <div className="row-sm d-flex justify-content-end mb-2">
                          <button className="btn btn-primary" onClick={handleAdd}><FaPlus className="text-white bg-primary"/> Create Shifts</button>
                      </div>
                        {showWorkHours
                        ?
                        <WorkHours ID={ProfID} Role={'ProfessionalSlots'} View={'AdminStyle'}/>
                        :
                        <fieldset style={{display:'block'}} className="mt-4">
                            <div className="card booking-card mb-0">
                                <div className="card-body booking-body">
                                <div className="card mb-0">
                                    <div className="card-body pb-1">
                                    <div className="row">
                                        <div className="col-lg-5">
                                        <div className="card">
                                            <div className="card-body p-2 pt-3">
                                            <div style={wrapperStyle}>
                                            <Calendar fullscreen={false} onPanelChange={onPanelChange} />
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                        <div className="col-lg-7">
                                        <div className="card booking-wizard-slots">
                                            <div className="card-body">
                                            <div className="book-title">
                                                <h6 className="fs-14 mb-2">Morning</h6>
                                            </div>
                                            <div className="token-slot mt-2 mb-2">
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    defaultChecked
                                                    />
                                                    <span className="visit-rsn">09:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">-</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">10:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">10:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">10:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">-</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">09:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">-</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">10:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">10:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">10:45</span>
                                                </label>
                                                </div>
                                            </div>
                                            <div className="book-title">
                                                <h6 className="fs-14 mb-2">Afternoon</h6>
                                            </div>
                                            <div className="token-slot mt-2 mb-2">
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    defaultChecked
                                                    />
                                                    <span className="visit-rsn">09:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">-</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">10:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">10:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">10:45</span>
                                                </label>
                                                </div>
                                            </div>
                                            <div className="book-title">
                                                <h6 className="fs-14 mb-2">Evening</h6>
                                            </div>
                                            <div className="token-slot mt-2 mb-2">
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    defaultChecked
                                                    />
                                                    <span className="visit-rsn">09:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">-</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">10:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">10:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">10:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">-</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">09:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">-</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">10:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">10:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">10:45</span>
                                                </label>
                                                </div>
                                                <div className="form-check-inline visits me-1">
                                                <label className="visit-btns">
                                                    <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="appintment"
                                                    />
                                                    <span className="visit-rsn">-</span>
                                                </label>
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
                            </fieldset>
                        }
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

export default ProfessionalShift;
