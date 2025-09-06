import React, {useState, useEffect} from "react";
import { NavLink, useHistory} from "react-router-dom";
import { doctordashboardprofile06 } from "../../../imagepath";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN } from "../../config";

export const ProfessionalSidebar = () => {
  const pathnames = window.location.pathname;
  const history = useHistory()
  const [profData, setProfData] = useState(null);
  const profEmail = atob(localStorage.getItem('email')) || "";

  const handleLogout = () => {
    localStorage.clear();
    history.push('/site-login')
  };

  useEffect(() => {
      axios
        .get(`${API_BASE_URL}/professional/getProf/?ProfEmail=${profEmail}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
          }
        })
        .then((response) => {
          setProfData(response.data.data);
          localStorage.setItem("RecordID", btoa(response.data.data.id))
        })
        .catch((err) => {
          console.error('Error:', err);
        });
    }, [profEmail]);

  return (
    <>
      {/* Profile Sidebar */}
      <div className="profile-sidebar patient-sidebar profile-sidebar-new">
        <div className="widget-profile pro-widget-content">
          <div className="profile-info-widget">
            <NavLink to="/patient/profile" className="booking-doc-img">
              <img
                src={doctordashboardprofile06}
                alt="User Image"
              />
            </NavLink>
            <div className="profile-det-info">
              <h3>
                <NavLink to="/patient/profile">{profData?.prof_first_name}&nbsp;{profData?.prof_last_name}</NavLink>
              </h3>
              {/* <div className="patient-details">
                <h5 className="mb-0">Patient ID : PT254654</h5>
              </div>
              <span>
                Female <i className="fa-solid fa-circle" /> 32 years 03 Months
              </span> */}
            </div>
          </div>
        </div>
        <div className="dashboard-widget">
          <nav className="dashboard-menu">
            <ul>
              <li>
                <NavLink to="/professional/myprofile">
                  <i className="isax isax-category-2"></i>
                  <span>Profile</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/professional/license">
                  <i className="isax isax-calendar-1"></i>
                  <span>License</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/professional/certificate">
                  <i className="isax isax-star-1"></i>
                  <span>Certificate</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/professional/education">
                  <i className="isax isax-user-octagon"></i>
                  <span>Education</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/professional/document">
                  <i className="isax isax-note-21"></i>
                  <span>Documents</span>
                </NavLink>
              </li>
              {/* <li>
                <NavLink to="/patient/accounts">
                  <i className="isax isax-wallet-2"></i>
                  <span>Wallet</span>
                </NavLink>
              </li> */}
              <li>
                <NavLink to="/professional/history">
                  <i className="isax isax-document-text"></i>
                  <span>Employee History</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/professional/reference">
                  <i className="isax isax-messages-1"></i>
                  <span>Professional Reference</span>
                  {/* <small className="unread-msg">7</small> */}
                </NavLink>
              </li>
              <li>
                <NavLink to="/professional/emergency">
                  <i className="isax isax-note-1"></i>
                  <span>Emergency Contact</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/professional/change-password">
                  <i className="isax isax-setting-2"></i>
                  <span>Change Password</span>
                </NavLink>
              </li>
              {/* <li>
                <NavLink to="#" onClick={handleLogout}>
                  <i className="isax isax-logout"></i>
                  <span>Logout</span>
                </NavLink>
              </li> */}
            </ul>
          </nav>
        </div>
      </div>
      {/* /Profile Sidebar */}
    </>

  );
};
export default ProfessionalSidebar;
