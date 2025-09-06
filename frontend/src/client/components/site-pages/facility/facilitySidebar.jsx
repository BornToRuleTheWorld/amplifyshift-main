import React, {useState, useEffect} from "react";
import { NavLink, useHistory} from "react-router-dom";
import { doctordashboardprofile06 } from "../../imagepath";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN } from "../config";

export const FacilitySidebar = () => {
  const pathnames = window.location.pathname;
  const history = useHistory()
  const [facData, setFacData] = useState(null);
  const facEmail = atob(localStorage.getItem('email')) || "";

  const handleLogout = () => {
    localStorage.clear();
    history.push('/site-login')
  };

  useEffect(() => {
      axios
        .get(`${API_BASE_URL}/facility/GetFacility/?FacEmail=${facEmail}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
          }
        })
        .then((response) => {
          setFacData(response.data.data);
          localStorage.setItem("RecordID", btoa(response.data.data.id))
        })
        .catch((err) => {
          console.error('Error:', err);
        });
    }, [facEmail]); 


    console.log("Sidebar", facData)
    console.log("facEmail",facEmail)

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
                <NavLink to="#">{facData?.fac_first_name}&nbsp;{facData?.fac_last_name}</NavLink>
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
                <NavLink to="/facility/myprofile">
                  <i className="isax isax-category-2"></i>
                  <span>Profile</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/facility/preference">
                  <i className="isax isax-calendar-1"></i>
                  <span>Preference</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/facility/document">
                  <i className="isax isax-note-21"></i>
                  <span>Job Documents</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/facility/billable">
                  <i className="isax isax-user-octagon"></i>
                  <span>Billable</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/facility/billable-shifts">
                  <i className="isax isax-user-octagon"></i>
                  <span>Billable Shifts</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/facility/cancelled-shifts">
                  <i className="isax isax-star-1"></i>
                  <span>Cancelled Shits</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/facility/invoices">
                  <i className="isax isax-wallet-2"></i>
                  <span>Invoices</span>
                </NavLink>
              </li>
              {/* <li>
                <NavLink to="/professional/history">
                  <i className="isax isax-document-text"></i>
                  <span>Employee History</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/professional/reference">
                  <i className="isax isax-messages-1"></i>
                  <span>Professional Reference</span>
                  <small className="unread-msg">7</small>
                </NavLink>
              </li>
              <li>
                <NavLink to="/professional/emergency">
                  <i className="isax isax-note-1"></i>
                  <span>Emergency Contact</span>
                </NavLink>
              </li> */}
              <li>
                <NavLink to="/facility/change-password">
                  <i className="isax isax-setting-2"></i>
                  <span>Change Password</span>
                </NavLink>
              </li>
              
            </ul>
          </nav>
        </div>
      </div>
      {/* /Profile Sidebar */}
    </>

  );
};
export default FacilitySidebar;
