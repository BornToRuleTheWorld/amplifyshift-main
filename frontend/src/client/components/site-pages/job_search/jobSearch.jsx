import React, { useEffect, useState } from "react";
import SiteHeader from "../home/header";
import SiteFooter from "../home/footer";
import StickyBox from "react-sticky-box";
import Doctors from "./doctors";
import { Link } from "react-router-dom";
// import { DatePicker } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Searchfilter from "./searchfilter";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath";
import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN, yearOptions, ColourOption, SingleValue, MultiValueLabel } from "../config";
import Select from "react-select";
import { convertToUS, getCurrentUserDiscipline } from "../utils";
import { parse } from 'date-fns';
import moment from 'moment';

const JobSearch = (props) => {

  const disciplineOptions = getCurrentUserDiscipline();

  const today = new Date();
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(today.getDate() + 14);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(twoWeeksFromNow);
  const [jobData, setJobData] = useState([]);
  const [search, setSearch] = useState(false);

  const logged_in = localStorage.getItem("logged_in") || "";
  const profEmail = atob(localStorage.getItem('email')) || "";

  const [searchData, setSearchData] = useState({
    start_date: startDate,
    end_date:endDate,
    keyword:'',
    years_of_exp: [],
    work_setting: [],
    discipline: [],
    languages: [],
    job_type: [],
    speciality: [],
    visit_type: [],
    zipcode: '',
    license: '',
    cpr_bls:'',
  });

  useEffect(() => {
      axios
        .get(`${API_BASE_URL}/professional/getProf/?ProfEmail=${profEmail}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
          }
        })
        .then((response) => {
          console.log("Professional data :", response.data)
          setSearchData((prev) => ({
            ...prev,
            zipcode   : response.data.data.prof_zip_primary,
            discipline: disciplineOptions.filter(option =>
              response.data.data.Discipline.includes(option.value)
            )
          }));
          localStorage.setItem("RecordID", btoa(response.data.data.id));
          setSearch(true);
        })
        .catch((err) => {
          console.error('Error:', err);
        });
    }, [profEmail]);

  const validiteFormInputs = async(data) => {
    console.log("validiteFormInputs",data)
    setError(null)
    let errorObj = true;

    // if (data.discipline.length === 0 && data.zipcode === "") {
    //   setError("Please choose discipline and zipcode");
    //   errorObj = false
    // }else if (data.discipline.length === 0) {
    //   setError("Please choose atleast one discipline");
    //   errorObj = false
    if (data.zipcode === "") {
      setError("Zipcode must not be empty");
      errorObj = false
    }else if((data.start_date === "" && data.end_date !== "") || (data.start_date !== "" && data.end_date === "")){
      setError("Please choose both start date and end date");
      errorObj = false
    }else{
      errorObj = true
    }

    return errorObj

  }

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

  // const fetchjob = async () => {
  //       const data = {}
  //       try {
  //           const response = await axios.post(`${API_BASE_URL}/jobs/GetAllJobs/`,data,{
  //             headers: { 
  //               "Content-Type": "application/json",
  //               'Authorization': AUTH_TOKEN
  //             },
  //           });
  //           if (response?.status === 200) {
  //             if (response.data.data.length > 0) {
  //               setJobData(response.data.data);
  //               setSuccess(null);
  //               setError(null);
  //             }
  //             else {
  //               setJobData([]);
  //               setSuccess('No job data available');
  //               setError(null);
  //             }
      
  //           }
  //         } catch (err) {
  //           console.log('responseError', err);
  //           setJobData([]);
  //           setError("An error occurred while fetching job list");
  //           setSuccess(null);
  //         }
  //     };
    
  //   useEffect(()=>{
  //     fetchjob()
  //   },[])

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      const validate =  await validiteFormInputs(searchData)
      if(validate){  
        facilitySearch();
      }else{
        setIsLoading(false)
      }                       
    };

    const facilitySearch = async () => {
        setError(null);
        const updatedData = {...searchData, discipline:searchData.discipline.map(item => item.value), start_date:moment(searchData.start_date).format('YYYY-MM-DD'),end_date:moment(searchData.end_date).format('YYYY-MM-DD')}
        try {
          const response = await axios.post(
              `${API_BASE_URL}/jobs/JobSearch/`,
              updatedData,
              {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': AUTH_TOKEN,
              },
              }
          );
          console.log('Search data:', response.data);
          setJobData(response.data.data);
      } catch (err) {
          console.error('Search Error:', err);
          setError('An error occurred while fetching data');
      } finally {
          setIsLoading(false);
          setSearch(false);
      }
        
    }
    
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setSearchData(prevState => ({
      ...prevState,
      [name]: value
      }));
    };

    const handleStartDate = (date) =>{ console.log(date); setStartDate(date);}
    const handleEndDate   = (date) =>{ console.log(date); setEndDate(date);}

    const handleSelectChange = (selectedOptions, fieldName) => {
      setSearchData(prevState => ({
        ...prevState,
        [fieldName]: selectedOptions
      }));
    };

    useEffect(()=>{
      facilitySearch()
    },[search, profEmail])
    
    console.log("jobData :",jobData)
    console.log("searchData", searchData)
    console.log('startDate:',startDate)
    console.log('endDate:',endDate)
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
                  <li className="breadcrumb-item">Search</li>
                  {/* <li className="breadcrumb-item active">Search</li> */}
                </ol>
                <h2 className="breadcrumb-title">Job Search</h2>
              </nav>
            </div>
          </div>
          <div className="bg-primary-gradient rounded-pill doctors-search-box w-100">
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
                    value={searchData.discipline}
                    onChange={(selected) => handleSelectChange(selected, 'discipline')}
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
                  </div>
                </div>
                <div className="search-input search-map-line">
                  <i className="isax isax-location5" />
                  <div className=" mb-0">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Zipcode"
                      name="zipcode"
                      value={searchData.zipcode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="search-input search-calendar-line border-right">
                  <i className="isax isax-calendar-tick5" />
                  <div className=" mb-0">
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
                {(logged_in)
                ?
                <div className="col-lg-3  theiaStickySidebar">
                  <StickyBox offsetTop={20} offsetBottom={20}>
                   <Searchfilter data={searchData} setData={setSearchData} setSearch={setSearch}/>
                  </StickyBox>
                </div>
                :
                null}
                {(logged_in)
                ?
                <div className="col-lg">
                  <Doctors data={jobData} success={setSuccess} error={setError} />
                </div>
                :
                <div className="col-lg-9 mx-auto">
                  <Doctors data={jobData} success={setSuccess} error={setError} />
                </div>
              }
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter {...props} />
    </div>
  );
};

export default JobSearch;
