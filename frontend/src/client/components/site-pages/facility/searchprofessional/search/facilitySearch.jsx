import React, { useEffect, useState } from "react";
import SiteHeader from "../../../home/header";
import SiteFooter from "../../../home/footer";
import StickyBox from "react-sticky-box";
import Doctors from "./doctors";
import { Link, useLocation } from "react-router-dom";
// import { DatePicker } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Searchfilter from "./searchfilter";
import ImageWithBasePath from "../../../../../../core/img/imagewithbasebath";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN, disciplineOptions, yearOptions, ColourOption, SingleValue, MultiValueLabel } from "../../../config";
import Select from "react-select";
import { convertToUS } from "../../../utils";
import { parse } from 'date-fns';
import moment from 'moment';

const FacilitySearch = (props) => {
  
  let jobID = ""
  if (localStorage.getItem('searchJobID')){
    jobID = atob(localStorage.getItem('searchJobID')) || "";
  }
  const setJobSearch = localStorage.getItem('setJobSearch') || "";
  const currentUser = atob(localStorage.getItem('userID')) || "";
  const facID = atob(localStorage.getItem('RecordID')) || "";

  let start_date = ""
  if (localStorage.getItem('startDate')){
    start_date = atob(localStorage.getItem('startDate')) || "";
  }
  
  let end_date = ""
  if (localStorage.getItem('endDate')){
    end_date = atob(localStorage.getItem('endDate')) || "";
  }

  let discipline = ""
  if (localStorage.getItem('discipline')){
    discipline = atob(localStorage.getItem('discipline')) || "";
  }

  let IndexSearch = ""
  if (localStorage.getItem('indexSearch')){
    IndexSearch = atob(localStorage.getItem('indexSearch')) || "";
  }
  
  const [tiggerSearch, setTriggerSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [value, onChange] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [search, setSearch] = useState(false);
  const [calendarDates, setCalendarDates] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [profData, setProfData] = useState([]);
  const [indexSearch, setIndexSearch] = useState(false)
  const [formData, setFormData] = useState({
    facility_id:facID,
    keyword:'',
    zipcode: '',
    license: '',
    dates:{
      start: startDate,
      end:endDate,
      dates:calendarDates,
      schedule:selectedSchedule
    },
    years_of_exp: [],
    weekly_aval: [],
    work_setting: [],
    work_setting_exp: [],
    doc_software: [],
    weekly_aval: [],
    doc_software: [],
    discipline: [],
    languages: [],
    job_type: [],
    speciality: [],
    visit_type: [],
    pay:"",
    cpr_bls:"",
    result_count:"",
    professional_ids:[]
  });

  const searchData = {
    keyword:formData.keyword,
    prof_zip_primary: formData.zipcode,
    //prof_discipline:(formData.discipline) ? jobID ? formData?.discipline?.map(disp => disp.value) : formData.discipline : [],
    prof_discipline: (formData.discipline) ? formData.discipline : [],
    prof_langs:formData.languages,
    prof_speciality:formData.speciality,
    prof_years_in: formData.years_of_exp,
    prof_wrk_setting:formData.work_setting_exp,
    prof_weekly_aval:formData.weekly_aval,
    prof_doc_soft:formData.doc_software,
    start_date:startDate ? moment(startDate).format('YYYY-MM-DD') : '',
    end_date:endDate ? moment(endDate).format('YYYY-MM-DD') : '',
    job_id:""
  }


  // --Search from index page--
  useEffect(()=>{
    if (IndexSearch){
      setIndexSearch(true)
    }
  },[IndexSearch])
  

  useEffect(()=>{
    if (indexSearch){
    
    setFormData((prev)=>({
      ...prev,
      discipline: discipline ? [disciplineOptions.find(option => option.value == discipline)?.value] : []
    }))

    start_date ? setStartDate(start_date) : setStartDate(null)
    end_date ? setEndDate(end_date) : setEndDate(null)
    setSearch(true)
    setIndexSearch(true)
  }
  },[indexSearch])

  const removeIndexSearch = () => {
    localStorage.removeItem('startDate')
    localStorage.removeItem('endDate')
    localStorage.removeItem('discipline')
    localStorage.removeItem('indexSearch')
  }

  //------------------------------


  const validiteFormInputs = async(data) => {
    console.log("validiteFormInputs",data)
    setError(null)
    let errorObj = true;

    // if (data.prof_discipline.length === 0 && data.prof_zip_primary === "") {
    //   setError("Please choose discipline and zipcode");
    //   errorObj = false
    // }else if (data.prof_discipline.length === 0) {
    //   setError("Please choose atleast one discipline");
    //   errorObj = false

    if (start_date || end_date || discipline){
      if((data.start_date === "" && data.end_date !== "") || (data.start_date !== "" && data.end_date === "")){
        setError("Please choose both start date and end date");
        errorObj = false
      }
    }else{
      if (data.prof_zip_primary === "") {
        setError("Zipcode must not be empty");
        errorObj = false
      }else if((data.start_date === "" && data.end_date !== "") || (data.start_date !== "" && data.end_date === "")){
        setError("Please choose both start date and end date");
        errorObj = false
      }else{
        errorObj = true
      }
    }

    return errorObj

  }
  useEffect(() => {
    if(setJobSearch){
      axios
        .get(`${API_BASE_URL}/jobs/GetJobs/?JobID=${jobID}&method=single`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN,
          }
      })
      .then((response) => {
          const jobData = response.data.data;
          console.log(jobData)
          if(jobData){
            setFormData(prevState => ({
              ...prevState,
              zipcode: jobData.zipcode || '',
              discipline: jobData.discipline ? [jobData.discipline] : [],
              languages: jobData.languages ? [jobData.languages] : [],
              speciality: jobData.speciality ? [jobData.speciality] : [],
              years_of_exp: jobData.years_of_exp ? [jobData.years_of_exp] : [],
              cpr_bls:jobData.cpr_bls || '',
              work_setting:jobData.work_setting ? [jobData.work_setting] : [],
              visit_type:jobData.visit_type ? [jobData.visit_type] : [],
              pay:jobData.pay || '',
              job_type:jobData.job_type ? [jobData.job_type] : [],
            }));
          setStartDate(convertToUS(jobData.start_date,"Date"))
          setEndDate(convertToUS(jobData.end_date,"Date"))
          setTriggerSearch(true)
        }
          
        localStorage.removeItem('setJobSearch')
      })
      .catch((err) => {
          console.error('Error:', err);
      });
    }
  }, [jobID]);

  const [minValue, setMinValue] = useState(10);
  const [maxValue, setMaxValue] = useState(5000);

  useEffect(() => {
    if (document.getElementById("price-range")) {
      setMinValue(10);
      setMaxValue(10000);

      const slider = document.getElementById("price-range");
      slider.addEventListener("input", handleSliderChange);

      return () => {
        slider.removeEventListener("input", handleSliderChange);
      };
    }
  }, []);

  const handleSliderChange = (event) => {
    const min = parseInt(event.target.value.split(",")[0]);
    const max = parseInt(event.target.value.split(",")[1]);

    setMinValue(min);
    setMaxValue(max);
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      localStorage.removeItem('setJobSearch');
      facilitySearch();                                     
    };

    const facilitySearch = async () => {

      let data = null;
      (tiggerSearch) ? data = {...searchData, job_id:jobID} : data = searchData

      const validate =  await validiteFormInputs(data)
      if(validate){
        try {
          const response = await axios.post(
              `${API_BASE_URL}/facility/facilitySearch/`,
              data,
              {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': AUTH_TOKEN,
              },
              }
          );
          console.log('Search data:', response.data);
          setProfData(response.data.data);

          setFormData(prev => ({
              ...prev,
              professional_ids:response.data.prof_ids,
              result_count:response.data.count
          }));

          // setSearch(true)

      } catch (err) {
          console.error('Search Error:', err);
          setError('An error occurred while fetching data');
      } finally {
          setSearch(false)
          removeIndexSearch();
          setIsLoading(false);
          setIndexSearch(false);
          setTriggerSearch(false);
          localStorage.removeItem('setJobSearch');
         
          // localStorage.removeItem('searchJobID')
         
      }
      }
        
    }
    // useEffect(() => {
    //   if (search){
    //     const updatedFormData = { 
    //       ...formData, 
    //       discipline: formData?.discipline?.map(disp => disp.value),
    //       years_of_exp: formData?.years_of_exp?.map(exp => {
    //         const option = yearOptions.find(option => option.value === exp);
    //         return option ? option.label : null;
    //         }).join(', ') || 'N/A'
    //     };
    //     try {
    //       const response = axios.post(
    //         `${API_BASE_URL}/facility/CreateFacSearch/`,
    //         updatedFormData,
    //         {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': AUTH_TOKEN,
    //         },
    //         }
    //       );
    //     } catch (err) {
    //         setError(err.response.data.Result || 'An error occurred while fetching data');
    //     } finally {
    //         setSearch(false);
    //         localStorage.removeItem('searchJobID')
    //     }
    //   }
    // },[search])

    useEffect(() => {
        if (tiggerSearch) {
          facilitySearch()
          localStorage.setItem('setJobSearch',true)
        }
    }, [tiggerSearch]);
    

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
      ...prevState,
      [name]: value
      }));
    };

    const handleStartDate = (date) =>{ console.log(date); setStartDate(date);}
    const handleEndDate   = (date) =>{ console.log(date); setEndDate(date);}

    const handleSelectChange = (selectedOptions, fieldName) => {
      setFormData(prevState => ({
        ...prevState,
        [fieldName]: selectedOptions
      }));
    };

    useEffect(()=>{
      if (search){
        facilitySearch()
      }
    },[search])

    console.log("profData",profData)
    
  return (
    <div className="main-wrapper">
      <SiteHeader {...props} />

      {/* Breadcrumb */}
      <div className="breadcrumb-bar overflow-visible">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/home">
                      <i className="isax isax-home-15" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item"><Link to="/facility/dashboard">Facility</Link></li>
                </ol>
                <h2 className="breadcrumb-title">Professional Search</h2>
              </nav>
            </div>
          </div>
          <div className="bg-primary-gradient rounded-pill doctors-search-box">
            <div className="search-box-one rounded-pill">
              <form onSubmit={handleSubmit}>
                <div className="search-input search-line">
                  <i className="isax isax-hospital5 bficon" />
                  <div className=" mb-0 h-25 p-3">
                  <Select
                    isMulti
                    className="text-dark"
                    name="discipline"
                    options={disciplineOptions}
                    value={
                    (formData.discipline && formData.discipline !== "") 
                    ? 
                      disciplineOptions.filter(disp => formData.discipline.includes(disp.value)) 
                    :   
                      []
                    }
                    // value={formData.discipline}
                    onChange={(selected) => setFormData({ ...formData, discipline: selected.map(option => option.value) })}
                    placeholder="Select discipline"
                    isClearable={true}
                    isSearchable={true}
                    components={{ Option : ColourOption, SingleValue, MultiValueLabel }}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: 'none',
                        boxShadow: 'none',
                      }),
                      
                      controlIsFocused: (provided) => ({
                        ...provided,
                        border: 'none',
                        boxShadow: 'none',
                      }),
                    }}
                  />
                    {/* <input
                      type="text"
                      className="form-control"
                      placeholder="Search for Discipline"
                    /> */}
                  </div>
                </div>
                <div className="search-input search-map-line">
                  <i className="isax isax-location5" />
                  <div className=" mb-0">
                  {/* <label className="form-label">Zipcode</label> */}
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Zipcode"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="search-input search-calendar-line border-right">
                  <i className="isax isax-calendar-tick5" />
                  <div className=" mb-0">
                  {/* <label className="form-label">Start Date</label> */}
                    <DatePicker
                      className="form-control datetimepicker"
                      placeholder="Start Date"
                      selected={startDate}
                      onChange={handleStartDate}
                      format={"MM/DD/YYYY"}
                      dateFormat="MM/dd/yyyy"
                      placeholderText="Start Date"
                      minDate={new Date()} 
                    />
                  </div>
                </div>
                <div className="search-input search-calendar-line">
                  <i className="isax isax-calendar-tick5" />
                  <div className=" mb-0">
                  {/* <label className="form-label">End Date</label> */}
                    <DatePicker
                      className="form-control"
                      placeholder="End Date"
                      selected={endDate}
                      onChange={handleEndDate}
                      format={"MM/DD/YYYY"}
                      dateFormat="MM/dd/yyyy"
                      placeholderText="End Date"
                      minDate={new Date()} 
                    />
                  </div>
                </div>
                <div className="form-search-btn">
                  <button
                    className="btn btn-primary d-inline-flex align-items-center rounded-pill"
                    type="submit"
                  >
                    <i className="isax isax-search-normal-15 me-2" />
                    Search
                  </button>
                </div>
              </form>
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
      <div className="doctor-content content">
        <div className="container">
        {error ? (
        <div className="alert alert-danger alert-dismissible fade show mt-2" role="alert">
            {error}
        </div>
        ) : ''}
        {success ? (
        <div className="alert alert-success alert-dismissible fade show mt-2" role="alert">
            {success}
        </div>
        ) : ''}
          <div className="row">
            <div className="col-xl-12 col-lg-12 map-view">
              <div className="row">
                <div className="col-lg-3  theiaStickySidebar">
                  <StickyBox offsetTop={20} offsetBottom={20}>
                   <Searchfilter data={formData} setData={setFormData} setSearch={setTriggerSearch}/>
                  </StickyBox>
                </div>

                <div className="col-lg-9">
                  <Doctors data={profData} success={setSuccess} error={setError} trigger={setTriggerSearch} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter {...props} />
    </div>
  );
};

export default FacilitySearch;
