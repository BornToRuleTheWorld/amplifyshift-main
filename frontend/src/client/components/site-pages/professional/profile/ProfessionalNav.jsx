import React from "react";
import { Link,NavLink } from "react-router-dom";


const ProfessionalNav = (props) => {

    return (
        <nav className="settings-tab mb-1">
            <ul className="nav nav-tabs-bottom" role="tablist">
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to='/professional/myprofile'>
                        Profile
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/professional/license">
                        License
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/professional/certificate">
                        Certificate
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/professional/education">
                        Education
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/professional/document">
                        Documentation
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/professional/history">
                        Employment History
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/professional/reference">
                        Professional Reference
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/professional/emergency">
                        Emergency Contact
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/professional/change-password">
                        Change Password
                    </NavLink>
                </li>
                {/* <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/professional/myshifts">
                        Myshifts
                    </NavLink>
                </li> */}
            </ul>
        </nav>
    );
};

export default ProfessionalNav;
