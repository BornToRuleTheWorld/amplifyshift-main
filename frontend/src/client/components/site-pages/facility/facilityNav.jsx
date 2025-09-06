import React from "react";
import { Link,NavLink } from "react-router-dom";


const FacilityNav = (props) => {

    return (
        <nav className="settings-tab mb-1">
            <ul className="nav nav-tabs-bottom" role="tablist">
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to='/facility/myprofile'>
                        Profile
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/facility/preference">
                        Preference
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/facility/document">
                        Job Documents
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/facility/billable">
                        Billable
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/facility/change-password">
                        Change Password
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default FacilityNav;
