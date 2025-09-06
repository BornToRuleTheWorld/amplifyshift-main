import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import { DatePicker, Slider } from "antd";
import { specialtyOptions, langOptions, yearOptions, workSettingOptions, visitType, jobTypeOptions, boolOption, disciplineOptions } from "../config";
import { FiX } from "react-icons/fi";

const Searchfilter = ({data,setData,setSearch}) => {
    const formatter = (value) => `$${value}`;
  
    const [showMenu,setShowMenu] = useState(false)
    const [showMenu2,setShowMenu2] = useState(false)
    const [showMenu3,setShowMenu3] = useState(false)
    const [showMenu4,setShowMenu4] = useState(false)

      const handleCheckboxChangeInt = (field) => (event) => {
        const { value, checked } = event.target;
        console.log("field",field)
        console.log("event",event.target.value)
        console.log("checked",event.target.checked)
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

      const handleCheckboxChange = (field) => (event) => {
        const { value } = event.target;
        setData(prevState => ({
            ...prevState,
            [field]: value
        }));
        setSearch(true)
      }

      const handleKeyword = (event) => {
        console.log("Keyword",event)
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
          visit_type:[],
          job_type:[],
          work_setting:[],
          discipline:[],
          license:'',
          cpr_bls:'',
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
          {workSettingOptions.map((option) => (
            <div key={option.value} className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`checkbox-sm-${option.value}`}
                  value = {option.value}
                  checked={data.work_setting.includes(option.value)}
                  onChange={handleCheckboxChangeInt('work_setting')}
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
              <h5>Visit Type</h5>
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
          {visitType.map((option) => (
            <div key={option.value} className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`checkbox-sm-${option.value}`}
                  value = {option.value}
                  checked={data.visit_type.includes(option.value)}
                  onChange={handleCheckboxChangeInt('visit_type')}
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
              <h5>Job Type</h5>
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
          {jobTypeOptions.map((option) => (
            <div key={option.value} className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`checkbox-sm-${option.value}`}
                  value = {option.value}
                  checked={data.job_type.includes(option.value)}
                  onChange={handleCheckboxChangeInt('job_type')}
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
          {boolOption.map((option) => (
            <div key={option.value} className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id={`checkbox-sm-${option.value}`}
                  value = {option.value}
                  checked={option.value === data.license}
                  onChange={handleCheckboxChange('license')}
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
          {boolOption.map((option) => (
            <div key={option.value} className="d-flex align-items-center justify-content-between mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id={`checkbox-sm-${option.value}`}
                  value = {option.value}
                  checked={option.value === data.cpr_bls}
                  onChange={handleCheckboxChange('cpr_bls')}
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
    </div>
  </div>
  );
};

export default Searchfilter;
