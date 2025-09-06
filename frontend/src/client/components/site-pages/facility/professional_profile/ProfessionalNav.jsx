import React from "react";
import { Link,NavLink } from "react-router-dom";


const SearchProfessionalNav = (props) => {

    return (
        <nav className="settings-tab mb-1">
            <ul className="nav nav-tabs-bottom" role="tablist">
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to='/facility/professional/profile'>
                        Profile
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/facility/professional/license">
                        License
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/facility/professional/certificate">
                        Certificate
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/facility/professional/education">
                        Education
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/facility/professional/reference">
                        Reference
                    </NavLink>
                </li>
                <li className="nav-item" role="presentation">
                    <NavLink className="nav-link" to="/facility/professional/emergency">
                        Emergency contact
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default SearchProfessionalNav;
