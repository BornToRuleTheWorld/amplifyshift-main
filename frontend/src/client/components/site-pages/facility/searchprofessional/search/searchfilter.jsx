import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../../../core/img/imagewithbasebath";
import { DatePicker, Slider } from "antd";
import { specialtyOptions, langOptions, workExperienceOptions, yearOptions, weeklyOptions, docOptions, disciplineOptions } from "../../../config";
import { FiX } from "react-icons/fi";

const Searchfilter = ({data,setData,setSearch, keyword}) => {
    const formatter = (value) => `$${value}`;
  
    const [showMenu,setShowMenu] = useState(false)
      const [showMenu2,setShowMenu2] = useState(false)
      const [showMenu3,setShowMenu3] = useState(false)
      const [showMenu4,setShowMenu4] = useState(false)

      const handleCheckboxChangeInt = (field) => (event) => {
        const { value, checked } = event.target;
      
        setData(prevState => {
          const updatedField = checked
            ? [...prevState[field], parseInt(value)]
            : prevState[field].filter(item => item !== parseInt(value));
      
          return {
            ...prevState,
            [field]: updatedField
          };
        });
        setSearch(true)
      };

      const handleCheckboxChangeStr = (field) => (event) => {
        console.log("field",field)
        console.log("event",event.target.value)
        console.log("checked",event.target.checked)
        const { value, checked } = event.target;
      
        setData(prevState => {
          const updatedField = checked
            ? [...prevState[field], value]
            : prevState[field].filter(item => item !== value);
      
          return {
            ...prevState,
            [field]: updatedField
          };
        });
        setSearch(true)
      };

      const handleKeyword = (event) => {
        const value = event.target.value;
        setData(prevState => ({
            ...prevState,
            keyword: value
        }));
        setSearch(true)
      }

      const handleClearAll = () => {
        setData((prev)=>({
          ...prev,
          speciality:[],
          languages:[],
          years_of_exp:[],
          doc_software:[],
          weekly_aval:[],
          discipline:[],
          work_setting_exp:[],
          keyword:''
        }))
        setSearch(true)
      }
    

  return (
    <div className="card filter-lists">
    <div className="card-header">
      <div className="d-flex align-items-center filter-head justify-content-between">
        <h4>Filter</h4>
        <FiX className="fs-3" title="Clear All" onClick={handleClearAll}/>
        {/* <Link to="#" className="text-secondary fs-3">
          <i className="isax isax-close-square" />
        </Link> */}
      </div>
      <div className="filter-input">
        <div className="position-relative input-icon">
          <input type="text" className="form-control" value={data.keyword} onChange={handleKeyword} />
          <span>
            <i className="isax isax-search-normal-1" />
          </span>
        </div>
      </div>
    </div>
    <div className="card-body p-0">
      {/* <div className="accordion-item border-bottom">
        <div className="accordion-header" id="heading1">
          <div
            className="accordion-button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse1"
            aria-controls="collapse1"
            role="button"
          >
            <div className="d-flex align-items-center w-100">
              <h5>Specialities</h5>
              <div className="ms-auto">
                <span>
                  <i className="fas fa-chevron-down" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          id="collapse1"
          className="accordion-collapse show"
          aria-labelledby="heading1"
        >
          <div className="accordion-body pt-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultValue=""
                  id="checkebox-sm2"
                  defaultChecked=""
                />
                <label
                  className="form-check-label"
                  htmlFor="checkebox-sm2"
                >
                  General
                </label>
              </div>
              <span className="filter-badge">21</span>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultValue=""
                  id="checkebox-sm3"
                />
                <label
                  className="form-check-label"
                  htmlFor="checkebox-sm3"
                >
                  Neuro
                </label>
              </div>
              <span className="filter-badge">21</span>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultValue=""
                  id="checkebox-sm4"
                />
                <label
                  className="form-check-label"
                  htmlFor="checkebox-sm4"
                >
                  Orthopedics
                </label>
              </div>
              <span className="filter-badge">21</span>
            </div>
            
            <div className="view-content" >
              <div className="viewall-one" style={{ display: !showMenu ? 'none' : 'block' }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultValue=""
                      id="checkebox-sm5"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="checkebox-sm5"
                    >
                      Pelvic Floor Rehab
                    </label>
                  </div>
                <span className="filter-badge">21</span>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue=""
                    id="checkebox-sm6"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="checkebox-sm6"
                  >
                    Sports Rehab
                  </label>
                </div>
                <span className="filter-badge">21</span>
              </div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultValue=""
                      id="checkebox-sm9"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="checkebox-sm9"
                    >
                      Pediatrics
                    </label>
                  </div>
                  <span className="filter-badge">21</span>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultValue=""
                      id="checkebox-sm10"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="checkebox-sm10"
                    >
                      Geriatrics
                    </label>
                  </div>
                  <span className="filter-badge">21</span>
                </div>
              </div>
              <div className="view-all">
                <Link
                  to="#" onClick={()=>{setShowMenu(!showMenu)}}
                  className="viewall-button-one text-secondary text-decoration-underline"
                >
                  {showMenu ?'View Less':'View More'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="accordion-item border-bottom">
        <div className="accordion-header" id="heading1">
          <div
            className="accordion-button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse1"
            aria-controls="collapse1"
            role="button"
          >
            <div className="d-flex align-items-center w-100">
              <h5>Discipline</h5>
              <div className="ms-auto">
                <span>
                  <i className="fas fa-chevron-down" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          id="collapse1"
          className="accordion-collapse show"
          aria-labelledby="heading1"
        >
        <div className="accordion-body pt-3">
          {disciplineOptions.map((option) => (
            <div key={option.value} className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`checkbox-sm-${option.value}`}
                  value = {option.value}
                  checked={data.discipline.includes(option.value)}
                  onChange={handleCheckboxChangeInt('discipline')}
                />
                <label
                  className="form-check-label"
                  htmlFor={`checkbox-sm-${option.value}`}
                >
                  {option.label}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div> */}
      <div className="accordion-item border-bottom">
        <div className="accordion-header" id="heading1">
          <div
            className="accordion-button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse1"
            aria-controls="collapse1"
            role="button"
          >
            <div className="d-flex align-items-center w-100">
              <h5>Specialities</h5>
              <div className="ms-auto">
                <span>
                  <i className="fas fa-chevron-down" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          id="collapse1"
          className="accordion-collapse show"
          aria-labelledby="heading1"
        >
        <div className="accordion-body pt-3">
          {specialtyOptions.map((option) => (
            <div key={option.value} className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`checkbox-sm-${option.value}`}
                  value = {option.value}
                  checked={data.speciality.includes(option.value)}
                  onChange={handleCheckboxChangeInt('speciality')}
                />
                <label
                  className="form-check-label"
                  htmlFor={`checkbox-sm-${option.value}`}
                >
                  {option.label}
                </label>
              </div>
            </div>
          ))}
          {/* <div className="view-content">
            <div className="viewall-one" style={{ display: !showMenu ? 'none' : 'block' }}>
              {specialtyOptions.slice(3).map((option) => (
                <div key={option.value} className="d-flex align-items-center justify-content-between mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`checkbox-sm-${option.value}`}
                      value = {option.value}
                      checked={data.speciality.includes(option.value)}
                      onChange={handleCheckboxChange('speciality')}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`checkbox-sm-${option.value}`}
                    >
                      {option.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="view-all">
              <Link
                to="#"
                onClick={() => setShowMenu(!showMenu)}
                className="viewall-button-one text-secondary text-decoration-underline"
              >
                {showMenu ? 'View Less' : 'View More'}
              </Link>
            </div>
          </div> */}
        </div>
      </div>
      </div>
      {/* <div className="accordion-item border-bottom">
        <div className="accordion-header" id="heading1">
          <div
            className="accordion-button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse1"
            aria-controls="collapse1"
            role="button"
          >
            <div className="d-flex align-items-center w-100">
              <h5>Discipline</h5>
              <div className="ms-auto">
                <span>
                  <i className="fas fa-chevron-down" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          id="collapse1"
          className="accordion-collapse show"
          aria-labelledby="heading1"
        >
        <div className="accordion-body pt-3">
          {disciplineOptions.map((option) => (
            <div key={option.value} className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`checkbox-sm-${option.value}`}
                  value = {option.value}
                  checked={data.discipline.includes(option.value)}
                  onChange={handleCheckboxChangeInt('discipline')}
                />
                <label
                  className="form-check-label"
                  htmlFor={`checkbox-sm-${option.value}`}
                >
                  {option.label}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div> */}
      <div className="accordion-item border-bottom">
        <div className="accordion-header" id="heading5">
          <div
            className="accordion-button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse5"
            aria-controls="collapse5"
            role="button"
          >
            <div className="d-flex align-items-center w-100">
              <h5>Experience</h5>
              <div className="ms-auto">
                <span>
                  <i className="fas fa-chevron-down" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          id="collapse5"
          className="accordion-collapse show"
          aria-labelledby="heading5"
        >
        <div className="accordion-body pt-3">
          {yearOptions.map((option) => (
            <div key={option.value} className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`checkbox-sm-${option.value}`}
                  value = {option.value}
                  checked={data.years_of_exp.includes(option.value)}
                  onChange={handleCheckboxChangeStr('years_of_exp')}
                />
                <label
                  className="form-check-label"
                  htmlFor={`checkbox-sm-${option.value}`}
                >
                  {option.label}
                </label>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
      <div className="accordion-item border-bottom">
        <div className="accordion-header" id="heading5">
          <div
            className="accordion-button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse5"
            aria-controls="collapse5"
            role="button"
          >
            <div className="d-flex align-items-center w-100">
              <h5>Weekly Availability</h5>
              <div className="ms-auto">
                <span>
                  <i className="fas fa-chevron-down" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          id="collapse5"
          className="accordion-collapse show"
          aria-labelledby="heading5"
        >
        <div className="accordion-body pt-3">
          {weeklyOptions.map((option) => (
            <div key={option.value} className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`checkbox-sm-${option.value}`}
                  value = {option.value}
                  checked={data.weekly_aval.includes(option.value)}
                  onChange={handleCheckboxChangeStr('weekly_aval')}
                />
                <label
                  className="form-check-label"
                  htmlFor={`checkbox-sm-${option.value}`}
                >
                  {option.label}
                </label>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
      <div className="accordion-item border-bottom">
        <div className="accordion-header" id="heading8">
          <div
            className="accordion-button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse8"
            aria-controls="collapse8"
            role="button"
          >
            <div className="d-flex align-items-center w-100">
              <h5>Languages</h5>
              <div className="ms-auto">
                <span>
                  <i className="fas fa-chevron-down" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          id="collapse8"
          className="accordion-collapse show"
          aria-labelledby="heading8"
        >
        <div className="accordion-body pt-3">
          {langOptions.map((option) => (
            <div key={option.value} className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`checkbox-sm-${option.value}`}
                  value = {option.value}
                  checked={data.languages.includes(option.value)}
                  onChange={handleCheckboxChangeInt('languages')}
                />
                <label
                  className="form-check-label"
                  htmlFor={`checkbox-sm-${option.value}`}
                >
                  {option.label}
                </label>
              </div>
            </div>
          ))}
          {/* <div className="view-content">
            <div className="viewall-one" style={{ display: !showMenu4 ? 'none' : 'block' }}>
              {langOptions.slice(3).map((option) => (
                <div key={option.value} className="d-flex align-items-center justify-content-between mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`checkbox-sm-${option.value}`}
                      value = {option.value}
                      checked={data.languages.includes(option.value)}
                      onChange={handleCheckboxChange('languages')}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`checkbox-sm-${option.value}`}
                    >
                      {option.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="view-all">
              <Link
                to="#"
                onClick={() => setShowMenu4(!showMenu4)}
                className="viewall-button-one text-secondary text-decoration-underline"
              >
                {showMenu4 ? 'View Less' : 'View More'}
              </Link>
            </div>
          </div> */}
        </div>
        </div>
      </div>
      <div className="accordion-item border-bottom">
        <div className="accordion-header" id="heading8">
          <div
            className="accordion-button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse8"
            aria-controls="collapse8"
            role="button"
          >
            <div className="d-flex align-items-center w-100">
              <h5>Work Setting</h5>
              <div className="ms-auto">
                <span>
                  <i className="fas fa-chevron-down" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          id="collapse8"
          className="accordion-collapse show"
          aria-labelledby="heading8"
        >
        <div className="accordion-body pt-3">
          {workExperienceOptions.map((option) => (
            <div key={option.value} className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`checkbox-sm-${option.value}`}
                  value = {option.value}
                  checked={data.work_setting_exp.includes(option.value)}
                  onChange={handleCheckboxChangeInt('work_setting_exp')}
                />
                <label
                  className="form-check-label"
                  htmlFor={`checkbox-sm-${option.value}`}
                >
                  {option.label}
                </label>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
      <div className="accordion-item border-bottom">
        <div className="accordion-header" id="heading8">
          <div
            className="accordion-button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse8"
            aria-controls="collapse8"
            role="button"
          >
            <div className="d-flex align-items-center w-100">
              <h5>Documentation Software</h5>
              <div className="ms-auto">
                <span>
                  <i className="fas fa-chevron-down" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          id="collapse8"
          className="accordion-collapse show"
          aria-labelledby="heading8"
        >
        <div className="accordion-body pt-3">
          {docOptions.map((option) => (
            <div key={option.value} className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`checkbox-sm-${option.value}`}
                  value = {option.value}
                  checked={data.doc_software.includes(option.value)}
                  onChange={handleCheckboxChangeInt('doc_software')}
                />
                <label
                  className="form-check-label"
                  htmlFor={`checkbox-sm-${option.value}`}
                >
                  {option.label}
                </label>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
      {/* <div className="accordion-item border-bottom">
        <div className="accordion-header" id="heading8">
          <div
            className="accordion-button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse8"
            aria-controls="collapse8"
            role="button"
          >
            <div className="d-flex align-items-center w-100">
              <h5>License</h5>
              <div className="ms-auto">
                <span>
                  <i className="fas fa-chevron-down" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          id="collapse8"
          className="accordion-collapse show"
          aria-labelledby="heading8"
        >
          <div className="accordion-body pt-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  name = "License"
                  className="form-check-input"
                  type="radio"
                  defaultValue=""
                  id="checkebox-sm34"
                  defaultChecked=""
                />
                <label
                  className="form-check-label"
                  htmlFor="checkebox-sm34"
                >
                  Yes
                </label>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  name = "License"
                  className="form-check-input"
                  type="radio"
                  defaultValue=""
                  id="checkebox-sm35"
                />
                <label
                  className="form-check-label"
                  htmlFor="checkebox-sm35"
                >
                  No
                </label>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="accordion-item border-bottom">
        <div className="accordion-header" id="heading8">
          <div
            className="accordion-button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse8"
            aria-controls="collapse8"
            role="button"
          >
            <div className="d-flex align-items-center w-100">
              <h5>CPR/BLS</h5>
              <div className="ms-auto">
                <span>
                  <i className="fas fa-chevron-down" />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          id="collapse8"
          className="accordion-collapse show"
          aria-labelledby="heading8"
        >
          <div className="accordion-body pt-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  name = "CPR/BLS"
                  className="form-check-input"
                  type="radio"
                  defaultValue=""
                  id="checkebox-sm34"
                  defaultChecked=""
                />
                <label
                  className="form-check-label"
                  htmlFor="checkebox-sm34"
                >
                  Yes
                </label>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  name = "CPR/BLS"
                  className="form-check-input"
                  type="radio"
                  defaultValue=""
                  id="checkebox-sm35"
                />
                <label
                  className="form-check-label"
                  htmlFor="checkebox-sm35"
                >
                  No
                </label>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  </div>
  );
};

export default Searchfilter;
