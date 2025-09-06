import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { Calendar, theme } from 'antd';
import SiteHeader from '../home/header';
import SiteFooter from "../home/footer.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL, AUTH_TOKEN, workSettingOptions, jobTypeOptions,disciplineOptions, specialtyOptions, yearOptions, boolOption, langOptions, visitType, stateOptions, cntryOptions, ColourOption, SingleValue, MultiValueLabel,ShiftHoursOptions} from "../config";
import { useHistory } from 'react-router-dom';
import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
import moment from 'moment';
import { convertToUS } from '../utils.js';
import MessagePopup from '../messagePopup.js';
import { convertTo12HourFormat, formatDateToMMDDYYYY } from '../utils.js';
import { momentLocalizer } from 'react-big-calendar';
import { FaTimesCircle} from "react-icons/fa";
import dayjs from 'dayjs';

const onPanelChange = (value, mode) => {
  console.log(value.format('YYYY-MM-DD'), mode);
};

const JobUpdate = () => {  
  const JobID = atob(localStorage.getItem('updateJobID')) || "";
  const facID = atob(localStorage.getItem('RecordID')) || "";
  console.log("JobID",JobID)
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState(null)
  const [phoneArea, setPhoneArea] = useState('')
  const [phonePrefix, setPhonePrefix] = useState('')
  const [phoneLine, setPhoneLine] = useState('')

  const [workHours, setWorkHours] = useState([])
  const [jobHours, setJobHours] = useState([])
  const [slots, setSlots] = useState([])
  const [show, setShow] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false)
  const [deleteID, setDeleteID] = useState(null)
  const [deleteService, setDeleteService] = useState(null)
  const [deleteJobID, setDeleteJobID] = useState(null)
  const [deleteDate, setDeleteDate] = useState(null)
  const [deleteHour, setDeleteHour] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null);

  // Job work hours  
  const [value, onChange] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [calendarDates, setCalendarDates] = useState([]);
  const [showCalender, setShowCalender] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [eventDetails, setEventDetails] = useState([]); 
  const [showSlots, setShowSlots] = useState({
      date:"",
      bulk:false,
      scheduleOption:[],
      show:false
  });
  const [slotOptions, setSlotOptions] = useState([]);
  const [workHourData, setWorkHourData] = useState([])
  const [bulkSelect, setBulkSelect] = useState(false);
  const [success, setSuccess] = useState(null);
  const localizer = momentLocalizer(moment);
  const [addPopup, setAddPopup] = useState(false)
  const todayDate = new Date();

  // Hour Form
  const [hourForm, setHourForm] = useState({
    job:"",
    facility:"",
    date: "",
    hours: "",
    status:""
  })
  const [hourForms, setHourForms] = useState([]);

  const handleShow = (id, service, job_id = null, date = null, hours = null) => {
    setPendingDelete({ id, service, job_id, date, hours });
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleNo = () => {
    setShow(false);
    setPendingDelete(null);
  };

  const handleYes = () => {
    setShow(false);
    confirmDelete();
  };
  
  const fetchjob = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/jobs/GetJobs/?method=single&JobID=${id}`, {
            headers: { 
                "Content-Type": "application/json",
                'Authorization': AUTH_TOKEN
            },
        });
        setFormData(response.data.data);
        setPhoneArea(response.data.data.contact_phone.slice(0,3))
        setPhonePrefix(response.data.data.contact_phone.slice(3,6))
        setPhoneLine(response.data.data.contact_phone.slice(6,10))
    } catch (err) {
        setError(err.response?.data?.Result || "An error occurred");
    }
  };

  const fetchJobWorkHours = async(id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs/GetJobWorkHours/?JobID=${id}&Type=Slots`, {
          headers: { 
              "Content-Type": "application/json",
              'Authorization': AUTH_TOKEN
          },
      });
      setWorkHours(response.data.data);
    } catch (err) {
        setError(err.response?.data?.Result || "An error occurred");
    }
  }

  const fetchJobHours = async(id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs/GetJobWorkHours/?JobID=${id}&Type=Hour_slots`, {
          headers: { 
              "Content-Type": "application/json",
              'Authorization': AUTH_TOKEN
          },
      });
      setJobHours(response.data.data);
    } catch (err) {
        setError(err.response?.data?.Result || "An error occurred");
    }
  }

  const fetchAllSlots = async() => {
    try {
      const response = await axios.get(`${API_BASE_URL}/GetSlots/`, {
          headers: { 
              "Content-Type": "application/json",
              'Authorization': AUTH_TOKEN
          },
      });
      setSlots(response.data.data);
    } catch (err) {
        setError(err.response?.data?.Result || "An error occurred");
    }
  }

  const confirmDelete = async() => {
    if (!pendingDelete) return;
    console.log("pendingDelete",pendingDelete)
    const { id, service, job_id, date, hours } = pendingDelete;

    try {
      let url = '';
      let data = {};

      if (service === 'hours') {
        url = `${API_BASE_URL}/jobs/DeleteJobHours/`;
        data = { JobID: job_id, SlotDate: moment(date).format('YYYY-MM-DD'), SlotHours: hours };
      } else {
        url = `${API_BASE_URL}/jobs/DeleteJobWorkHours/`;
        data = { HourID: id };
      }

      const response = await axios.delete(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN,
        },
        data: data,
      });

      console.log("Deleted:", response.data);
      fetchJobHours(JobID);
      fetchJobWorkHours(JobID);
    } catch (err) {
      console.log("Delete job hours error", err)
      setError(err.response?.data?.Result || 'An error occurred');
    } finally {
      setDeletePopup(false);
      setPendingDelete(null);
    }
  }

  const { token } = theme.useToken();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value,
    });
  };

  const validiteFormInputs = (data) => {
      
    const errorObj = {};
    const phoneRegx = /\d/g
    const todayData = new Date()

      if (data.start_date == '') {
        errorObj.start_date = "Start date is required";
      }

      if (data.end_date == '') {
        errorObj.end_date = "End date is required";
      }

      if (new Date(data.start_date).getTime() > new Date(data.end_date).getTime()){
        errorObj.end_date = "End date is must be greater than start date";
      }

      if (data.job_title == '') {
        errorObj.job_title = "Title is required";
      }

      if (data.discipline == '') {
        errorObj.discipline = "Please choose a discipline";
      }

      // if (data.years_of_exp == '') {
      //   errorObj.years_of_exp = "Please choose a experience";
      // }

      // if (data.speciality == '') {
      //   errorObj.speciality = "Please choose a speciality";
      // }

      // if (data.work_setting == '') {
      //   errorObj.work_setting = "Please choose a work setting";
      // }

      // if (data.job_type == '') {
      //   errorObj.job_type = "Please choose a job type";
      // }

      // if (data.languages == '') {
      //   errorObj.languages = "Please choose a language";
      // }

      // if (data.visit_type == '') {
      //   errorObj.visit_type = "Please choose a visit type";
      // }

      if (data.state == '') {
        errorObj.state = "Please choose a state";
      }

      if (data.country == '') {
        errorObj.country = "Please choose an country";
      }

      // if (data.contact_phone == '') {
      //   errorObj.contact_phone = "Contact is required";
      // }

      // if (phoneArea == '' || phonePrefix == '' || phoneLine == '') {
      //   errorObj.contact_phone = "Contact is required";
      // }else{
      //   if (!Number.isInteger(parseInt(phoneArea)) || !Number.isInteger(parseInt(phonePrefix)) || !Number.isInteger(parseInt(phoneLine))) {
      //       errorObj.contact_phone = "Invalid phone number";
      //   }
      // }

      // if (phoneArea.length < 3 || phonePrefix.length < 3 || phoneLine.length < 4 ){
      //   errorObj.contact_phone = "Invalid phone number";
      // }

      if (data.contact_phone != '') {
        if (!phoneRegx.test(data.contact_phone)) {
          errorObj.contact_phone = "Invalid contact number";
        }
      }
      
      // if (data.contact_person == '') {
      //   errorObj.contact_person = "Contact person is required";
      // }

      if (data.address1 == '') {
        errorObj.address1 = "Address1 is required";
      }

      if (data.city == '') {
        errorObj.city = "City is required";
      }

      if (data.zipcode == '') {
        errorObj.zipcode = "Zipcode is required";
      }

      if (data.pay == '') {
        errorObj.pay = "Pay is required";
      }
  
    return errorObj
  }

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setFormErrors({});
  const formValidate = validiteFormInputs(formData)
  if (Object.keys(formValidate).length === 0) {
    setIsLoading(true);
    try {
        let url = `${API_BASE_URL}/jobs/UpdateJobs/${JobID}/`;
        let method = "PUT";
        const updatedData = {...formData,start_date:moment(formData.start_date).format('YYYY-MM-DD'),end_date:moment(formData.end_date).format('YYYY-MM-DD'),contact_phone:`${phoneArea}${phonePrefix}${phoneLine}`}
        delete updatedData.created_by;
        const response = await axios({
            method: method,
            url: url,
            data: updatedData,
            headers: { 
                "Content-Type": "application/json",
                'Authorization': AUTH_TOKEN
            }
        });
        setWorkHourData(prev => prev.map(item => ({ ...item, job: JobID })));
        setAddPopup(true)
      } catch (err) {
          console.log("JobUpdate", err)
          setError( err.response.data.Result || "An error occurred while updating.......");
          setIsLoading(false)
      }
    }else{
      setFormErrors(formValidate)
      return false;
    }
  };

  useEffect(()=>{
    if(JobID){
      fetchjob(JobID)
      fetchJobWorkHours(JobID)
      fetchJobHours(JobID)
      fetchAllSlots()
    }
  },[JobID])



  //Job work hours  
      useEffect(()=>{
          if(startDate){
              if (todayDate.getTime() > startDate.getTime()){
                  setError("Start date must be a future date. Please select a date after today.")
              }
          }
          if(endDate){
              if (todayDate.getTime() > endDate.getTime()){
                  setError("End date must be a future date. Please select a date after today.")
              }
          }
      },[startDate,endDate])

      useEffect(() => {
          const fetchSlots = async () => {
              try {
                  setIsLoading(true);
                  const response = await axios.get(`${API_BASE_URL}/GetSlots/`, {
                      headers: {
                      'Content-Type': 'application/json',
                      'Authorization': AUTH_TOKEN,
                      },
                  });
  
                  const slotData = response.data.data;
                  if (Array.isArray(slotData)) {
                      const transformedSlots = slotData.map((slot) => {
                          const startTime = convertTo12HourFormat(slot.start_hr);
                          const endTime = convertTo12HourFormat(slot.end_hr);
                          return {
                              value: slot.id,
                              label: `${startTime} - ${endTime}`,
                          };
                      });
                      setSlotOptions(transformedSlots);
                  } else {
                      console.error("API response 'data' is not an array:", slotData);
                  }
              } catch (err) {
                  console.error("Error fetching slots:", err);
              } finally {
                  setIsLoading(false);
              }
          };
      
      fetchSlots();
      }, [AUTH_TOKEN]);
  
      const handleSlotSelection = (slot) => {
        console.log("slot",slot)
          setSelectedSlots(prevState => {
              if (prevState.includes(slot)) {
                  return prevState.filter(s => s !== slot);
              }
              return [...prevState, slot];
          });
      };
  
      const saveSelectedEvent = (start) => {
          setError(null)
          if (selectedSlots.length > 0){
              if (bulkSelect) {
                  for (const calendar of calendarDates) {
                      for (const day of calendar.days) {
                              const eventExists = eventDetails.some(item => item.date === day && item.event === "Available");
                              if (!eventExists) {
                                  setEventDetails(prevState => [
                                      ...prevState,
                                      {
                                          date: day,
                                          event: "Available",
                                          slots: selectedSlots 
                                      }
                                  ]);
                                  setWorkHourData(prev => [
                                      ...prev,
                                      {
                                          job: "",
                                          date: day,
                                          slot: selectedSlots.map(slot => slot.value)
                                      }
                                  ]);
                              } else {
                                  setEventDetails(prevState => 
                                      prevState.map(item => 
                                          item.date === day && item.event === "Available" 
                                          ? { ...item, slots: selectedSlots }
                                          : item
                                      ).filter(item => item.slots.length > 0)
                                  );
                  
                                  setWorkHourData(prev => 
                                      prev.map(item => 
                                          item.date === day && item.status === "Available"
                                      ? {...item, slot:selectedSlots.map(slot => slot.value)}
                                      : item
                                  ));
                              }
                      
                      }
                  }
              } else {
                  if (selectedSlots) {
                      const eventExists = eventDetails.some(item => item.date === start && item.event === "Available");
                      if (!eventExists) {
                          setEventDetails(prevState => [
                              ...prevState,
                              {
                                  date: start,
                                  event: "Available",
                                  slots: selectedSlots 
                              }
                          ]);
                          setWorkHourData(prev => [
                              ...prev,
                              {
                                  job: "",
                                  date: start,
                                  slot: selectedSlots.map(slot => slot.value)
                              }
                          ]);
                      } else {
                          setEventDetails(prevState => 
                              prevState.map(item => 
                                  item.date === start && item.event === "Available" 
                                  ? { ...item, slots: selectedSlots }
                                  : item
                              )
                          );
  
                          setWorkHourData(prev => 
                              prev.map(item => 
                                  item.date === start
                              ? {...item, slot:selectedSlots.map(slot => slot.value)}
                              : item
                          ));
                      }
                  }
              }
          }else{
              setError("Please select atleast one slot")
          }
      };
      
  
      const handleDeleteSlot = (date, slotToDelete) => {
          setSelectedSlots(prevState => prevState.filter(slot => slot !== slotToDelete));
          
          setEventDetails(prevState => 
              prevState.map(item => 
                  item.date === date ? { ...item, slots: item.slots.filter(slot => slot !== slotToDelete) } : item
              ).filter(item => item.slots.length > 0)
          );
  
          setWorkHourData(prev =>
              prev.map(item =>
                  item.date === date ? { ...item, slot: item.slot.filter(s => s !== slotToDelete.value)} : item
              ).filter(item => item.slot.length > 0)
          );
      };
  
      useEffect(() => {
          if (startDate && endDate) {
              const start = new Date(startDate);
              const end = new Date(endDate);
              const startDateOfMonth = new Date(start.getFullYear(),start.getMonth(),1)
              let months = [];
              while (startDateOfMonth <= end) {
                  const month = startDateOfMonth.toLocaleString("default", { month: "long", year: "numeric" });
                  if (!months.includes(month)) {
                      months.push(month);
                  }
                  startDateOfMonth.setMonth(startDateOfMonth.getMonth() + 1);
              }
              setSelectedMonths(months);
          }
      }, [startDate, endDate]);

      const addRemoveEvents = () => {
          const newEvents = [];
          eventDetails.forEach(item => {
              item.slots.forEach(slot => {
                  const [startTime, endTime] = slot.label.split(' - ');
              
                  const startDateTime = new Date(item.date);  
                  const endDateTime = new Date(item.date);
                  
                  const startHour = parseInt(startTime.slice(0, -5)); 
                  const startPeriod = startTime.slice(-2);
                  
                  const endHour = parseInt(endTime.slice(0, -5));
                  const endPeriod = endTime.slice(-2);
  
                  startDateTime.setHours(startPeriod === 'PM' && startHour !== 12 ? startHour + 12 : startPeriod === 'AM' && startHour === 12 ? 0 : startHour, 0, 0);
                  endDateTime.setHours(endPeriod === 'PM' && endHour !== 12 ? endHour + 12 : endPeriod === 'AM' && endHour === 12 ? 0 : endHour, 0, 0);
                  newEvents.push({
                      start: startDateTime,
                      end: endDateTime,
                      title: item.event,
                      allDay: false
                  });
              });    
          });
          setSelectedEvent(newEvents);
      }
      
      useEffect(() => {
          addRemoveEvents();
      }, [eventDetails]);
  
      const handleSelectSlot = (date) => {
        const formattedDate = convertToUS(date, "Date");
        const normalizedDate = formatDateToMMDDYYYY(formattedDate);
        const savedSlots = workHours.filter(event => event.date === normalizedDate).map(event => event.slot);
        const hourData   = jobHours.find(event => convertToUS(event.date, "Date") === formattedDate)?.hours || "";
        const filteredSlots = slotOptions.filter(slotObj => savedSlots.includes(slotObj.value));
        setSelectedSlots(filteredSlots);
        setShowSlots({ ...showSlots, show: true, date: formattedDate });
        setHourForm((prev) => ({ ...prev, hours:hourData, job:JobID, date: formattedDate ? formattedDate : "", status:"Available", facility:facID }))
        setHourForms(prev => [...prev, { hours:hourData, job:JobID, date: formattedDate ? formattedDate : "", status:"Available", facility:facID }])
        
    };

    useEffect(() => {
      if (!hourForm.date) return;

      setHourForms(prev => {
        const exists = prev.some(entry => entry.date === hourForm.date);
        if (exists) {
          return prev.map( entry => entry.date === hourForm.date ? { ...entry, hours: hourForm.hours } : entry );
        } else {
          return [...prev, { ...hourForm }];
        }
      });

    }, [hourForm]);


  
      const handleHours = async () => {
        setIsLoading(true)
        setError(null)
        setSuccess(null)
  
        try {    
            const response = await axios.post(`${API_BASE_URL}/jobs/CreateJobWorkHours/`, hourForms, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                }
            });
            if(response.data){
                setError(null)
                setSuccess("Hours Updated Successfully")
                history.push('/facility/jobs')
              }
        } catch (err) {
            console.error('Error:', err);
            setSuccess(null)
            setError('An error occurred while submitting the form.');
        } finally {
            setIsLoading(false);
            setAddPopup(false)
        }
    }
  
      const handleWorkHourSubmit = async () =>{
          setIsLoading(true)
          setError(null)
          setSuccess(null)
          try {    
              const response = await axios.post(`${API_BASE_URL}/jobs/CreateJobWorkHours/`, workHourData, {
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': AUTH_TOKEN
                  }
              });
              if(response.status === 201){
                setSuccess("Job Work Hours Updated Successfully")
                history.push('/facility/jobs')
              }
          } catch (err) {
              console.error('Error:', err);
              setError( err.response.data.Result || 'An error occurred while submitting the form.');
          } finally {
              setIsLoading(false);
              setAddPopup(false)
          }
      }
  
      useEffect(() => {
          if(addPopup){
            handleHours();
            handleWorkHourSubmit();
          }
      }, [addPopup]);

  console.log("JobData",formData)
  console.log("workhours", workHours)
  console.log("jobHours", jobHours)
  console.log("slots", slots)
  console.log("deleteID",deleteID)
  console.log("deleteService",deleteService)
  console.log("selected slots", selectedSlots)
  console.log("EventDetails", eventDetails)
  console.log("slotOptions",slotOptions)
  console.log("hourForms", hourForms)
  return (
  <div classname="main-wrapper">
  <SiteHeader />
  <>
    {/* Breadcrumb */}
    <div className="breadcrumb-bar">
      <div className="container">
        <div className="row align-items-center inner-banner">
          <div className="col-md-12 col-12 text-center">
            <nav aria-label="breadcrumb" className="page-breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">
                    <i className="isax isax-home-15" />
                  </a>
                </li>
                <li className="breadcrumb-item" aria-current="page">
                   <Link to="/facility/dashboard">Facility</Link> 
                </li>
                <li className="breadcrumb-item active">
                   <Link to="/facility/jobs">Jobs</Link> 
                </li>
              </ol>
              <h2 className="breadcrumb-title">Update Job</h2>
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
  <div className="doctor-content pt-5 pb-0">
    <div className="container">
      <div className="row">
        <div className="col-lg-9 mx-auto">
        <div className="booking-widget multistep-form mb-3">
        <form onSubmit={handleSubmit} >
            <fieldset id="first">
              <div className="card booking-card mb-0">
                <div className="card-header">
                  <h3>Update Job</h3>
                </div>
                {error ? (
                  <div className="alert alert-danger alert-dismissible fade show mt-2" role="alert">
                      {error}
                  </div>
                  ) : ''}
                <div className="card-body booking-body">
                  <div className="card mb-0">
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-lg-4 col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Start Date <span className="text-danger">*</span>
                            </label>
                            <div className="form-icon">
                            <DatePicker
                            className="form-control datetimepicker"
                            name="start_date"
                            selected={formData?.start_date}
                            onChange={(date) => setFormData({...formData, start_date: date})}
                            dateFormat="MM/dd/yyyy"
                            showDayMonthYearPicker
                            autoComplete='off'
                            disabled
                            />
                              <span className="icon">
                                <i className="fa-regular fa-calendar-days" />
                              </span>
                            </div>
                            {formErrors.start_date && <div className="form-label text-danger m-1">{formErrors.start_date}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              End Date <span className="text-danger">*</span>
                            </label>
                            <div className="form-icon">
                            <DatePicker
                            className="form-control datetimepicker"
                            name="end_date"
                            selected={formData?.end_date}
                            onChange={(date) => setFormData({...formData, end_date: date})}
                            dateFormat="MM/dd/yyyy"
                            showDayMonthYearPicker
                            autoComplete='off'
                            disabled
                          />
                              <span className="icon">
                                <i className="fa-regular fa-calendar-days" />
                              </span>
                            </div>
                            {formErrors.end_date && <div className="form-label text-danger m-1">{formErrors.end_date}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Job Title <span className="text-danger">*</span></label>
                            <input type="text" name="job_title" value={formData?.job_title} onChange={handleInputChange} className="form-control" />
                            {formErrors.job_title && <div className="form-label text-danger m-1">{formErrors.job_title}</div>}
                          </div>
                        </div>
                        
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Select Discipline <span className="text-danger">*</span></label>
                            
                            <Select
                              className="select"
                              name = "discipline"
                              options={disciplineOptions}
                              value={formData?.discipline ? disciplineOptions.find(option => option.value == formData.discipline):null}
                              onChange={(selected) => setFormData({...formData, discipline: selected ? selected.value : null})}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                              components={{ Option : ColourOption, SingleValue }}
                              isDisabled={true}
                            />
                            {formErrors.discipline && <div className="form-label text-danger m-1">{formErrors.discipline}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Address 1<span className="text-danger">*</span></label>
                            <input type="text" name="address1" value={formData?.address1} onChange={handleInputChange} className="form-control" />
                            {formErrors.address1 && <div className="form-label text-danger m-1">{formErrors.address1}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Address 2</label>
                            <input type="text" name="address2" value={formData?.address2} onChange={handleInputChange} className="form-control" />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">City <span className="text-danger">*</span></label>
                            <input type="text" name="city" value={formData?.city} onChange={handleInputChange} className="form-control" />
                            {formErrors.city && <div className="form-label text-danger m-1">{formErrors.city}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Select State <span className="text-danger">*</span></label>
                            
                            <Select
                              className="select"
                              name="state"
                              options={stateOptions}
                              value={formData?.state ? stateOptions.find(option => option.value == formData.state) : ""}
                              onChange={(selected) => setFormData({...formData, state: selected ? selected.value : ""})}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            {formErrors.state && <div className="form-label text-danger m-1">{formErrors.state}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Select Country <span className="text-danger">*</span></label>
                            
                            <Select
                              className="select"
                              name="country"
                              options={cntryOptions}
                              value={formData?.country ? cntryOptions.find(option => option.value == formData.country) : ""}
                              //onChange={(selected) => setFormData({...formData, country: selected ? selected.value : ""})}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                              isDisabled={true}
                            />
                            {formErrors.country && <div className="form-label text-danger m-1">{formErrors.country}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Zipcode <span className="text-danger">*</span></label>
                            <input type="text" name="zipcode" value={formData?.zipcode} onChange={handleInputChange} className="form-control" />
                            {formErrors.zipcode && <div className="form-label text-danger m-1">{formErrors.zipcode}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Pay <span className="text-danger">*</span></label>
                            <input type="text" name="pay" value={formData?.pay} onChange={handleInputChange} className="form-control" />
                            {formErrors.pay && <div className="form-label text-danger m-1">{formErrors.pay}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">CPR/BLS: <span className="text-danger">*</span></label>
                            
                            <Select
                              className="select"
                              name="cpr_bls"
                              options={boolOption}
                              value={formData?.cpr_bls ? boolOption.find(option => option.value === formData.cpr_bls) : ""}
                              onChange={(selected) => setFormData({...formData, cpr_bls: selected ? selected.value : ""})}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">License: <span className="text-danger">*</span></label>
                            
                            <Select
                              className="select"
                              name="license"
                              options={boolOption}
                              value={formData?.license ? boolOption.find(option => option.value === formData.license) : ""}
                              onChange={(selected) => setFormData({...formData, license: selected ? selected.value : ""})}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Select Work Experience </label>
                            
                            <Select
                              className="select"
                              name="years_of_exp"
                              options={yearOptions}
                              value={formData?.years_of_exp ? yearOptions.find(option => option.value == formData.years_of_exp):""}
                              onChange={(selected) => setFormData({...formData, years_of_exp: selected ? selected.value : ""})}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            {formErrors.years_of_exp && <div className="form-label text-danger m-1">{formErrors.years_of_exp}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Select Specialty </label>
                            
                            <Select
                              className="select"
                              name="speciality"
                              options={specialtyOptions}
                              value={formData?.speciality ? specialtyOptions.find(option => option.value == formData.speciality) : ""}
                              onChange={(selected) => setFormData({...formData, speciality: selected ? selected.value : ""})}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            {formErrors.speciality && <div className="form-label text-danger m-1">{formErrors.speciality}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Select Work Setting </label>
                            
                            <Select
                              className="select"
                              name = "work_setting"
                              options={workSettingOptions}
                              value={formData?.work_setting ? workSettingOptions.find(option => option.value == formData.work_setting) : ""}
                              onChange={(selected) => setFormData({...formData, work_setting: selected ? selected.value : ""})}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            {formErrors.work_setting && <div className="form-label text-danger m-1">{formErrors.work_setting}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Select Job Type </label>
                            
                            <Select
                              className="select"
                              name="job_type"
                              options={jobTypeOptions}
                              value={formData?.job_type ? jobTypeOptions.find(option => option.value == formData.job_type): ""}
                              onChange={(selected) => setFormData({...formData, job_type: selected ? selected.value : ""})}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            {formErrors.job_type && <div className="form-label text-danger m-1">{formErrors.job_type}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Select Languages </label>
                            
                            <Select
                              className="select"
                              options={langOptions}
                              value={formData?.languages ? langOptions.find(option => option.value == formData.languages) : ""}
                              onChange={(selected) => setFormData({...formData, languages: selected ? selected.value : ""})}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            {formErrors.languages && <div className="form-label text-danger m-1">{formErrors.languages}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Select Visit Type </label>
                            
                            <Select
                              className="select"
                              name="visit_type"
                              options={visitType}
                              value={formData?.visit_type ? visitType.find(option => option.value == formData.visit_type) : ""}
                              onChange={(selected) => setFormData({...formData, visit_type: selected ? selected.value : ""})}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            {formErrors.visit_type && <div className="form-label text-danger m-1">{formErrors.visit_type}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Contact Person </label>
                            <input type="text" name="contact_person" value={formData?.contact_person} onChange={handleInputChange} className="form-control" />
                            {formErrors.contact_person && <div className="form-label text-danger m-1">{formErrors.contact_person}</div>}
                          </div>
                        </div>
                        
                        {/* <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Contact <span className="text-danger">*</span></label>
                            <input type="text" name="contact_phone" value={formData?.contact_phone} onChange={handleInputChange} className="form-control" />
                            {formErrors.contact_phone && <div className="form-label text-danger m-1">{formErrors.contact_phone}</div>}
                          </div>
                        </div> */}
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Contact </label>
                            <div className="row g-2">
                              <div className="col-4">
                              <input
                                type="text"
                                maxLength={3}
                                name="contact_phone_area"
                                value={phoneArea}
                                onChange={(e) => setPhoneArea(e.target.value)}
                                className="form-control"
                              />
                              </div>
                              <div className="col-4">
                              <input
                                type="text"
                                maxLength={3}
                                name="contact_phone_prefix"
                                value={phonePrefix}
                                onChange={(e) => setPhonePrefix(e.target.value)}
                                className="form-control"
                              />
                              </div>
                              <div className="col-4">
                              <input
                                type="text"
                                maxLength={4}
                                name="contact_phone_line"
                                value={phoneLine}
                                onChange={(e) => setPhoneLine(e.target.value)}
                                className="form-control"
                              />
                              </div>
                              {formErrors.contact_phone && (
                                <div className="form-label text-danger m-1">{formErrors.contact_phone}</div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body booking-body">
                  <div className="card mb-0">
                      <div className="card-body pb-1">
                        <div className="appointment-tabs user-tab">
                          <ul className="nav">
                            <li className="nav-item">
                              <Link
                                className="nav-link active"
                                to="#work_hours"
                                data-bs-toggle="tab"
                              >
                                Job Work Hours
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                className="nav-link"
                                to="#hours"
                                data-bs-toggle="tab"
                              >
                                Job Hours
                              </Link>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="tab-content pt-0">
                          <div id="work_hours" className="tab-pane fade show active">
                            <div className="table-responsive" id='work_hours'>
                              <table className="table table-center mb-4 table-striped table-hover border">
                                  <thead className="bg-primary text-white">
                                      <tr className="bg-primary text-white">
                                          <th className="bg-primary text-white">Date</th>
                                          <th className="bg-primary text-white">Slot</th>
                                          <th className="bg-primary text-white">Action</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                    {workHours.length === 0 ? (
                                      <tr>
                                        <td colSpan={7}>No work hours found for this job</td>
                                      </tr>
                                    ) : (
                                      workHours.map((hour) => {
                                        const slotDetails = slots.find(slot => slot.id === hour.slot);
                                        return (
                                          <tr key={hour.id}>
                                            <td>{hour?.date}</td>
                                            <td>
                                              {convertTo12HourFormat(slotDetails?.start_hr)} - {convertTo12HourFormat(slotDetails?.end_hr)}
                                            </td>
                                            <td>
                                              <div className="action-item">
                                                <Link to="#" onClick={() => handleShow(hour.id, "workHours")}>
                                                  <i className="isax isax-trash" />
                                                </Link>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })
                                    )}
                                  </tbody>
                              </table>
                            </div>
                          </div>
                        </div>  
                        
                        <div className="tab-content pt-0">
                          <div id="hours" className="tab-pane fade">
                            <div className="table-responsive" id='hours'>
                              <table className="table table-center mb-2 table-striped table-hover border">
                                  <thead className="bg-primary text-white">
                                      <tr className="bg-primary text-white">
                                        <th className="bg-primary text-white">Date</th>
                                        <th className="bg-primary text-white">Hours</th>
                                        <th className="bg-primary text-white">Action</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      { jobHours.length === 0 ?
                                          <tr><td colSpan={7}>No job hours found for this job</td></tr>
                                      :
                                      jobHours.map((hour) => (
                                          <tr key={hour.date}>
                                              <td>{hour?.date ? convertToUS(hour.date, 'Date') : "-"}</td>
                                              <td>{hour?.hours ? `${hour.hours} ${hour.hours > 1 ? "Hrs" : "Hr"}` : "-"}</td>
                                              <td>
                                                  <div className="action-item">
                                                      <Link to="#" onClick={() => handleShow(hour.id, "hours", hour.job_id, hour.date, hour.hours)}>
                                                          <i className="isax isax-trash" />
                                                      </Link>
                                                  </div>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div className="card-body booking-body pt-0">
                    <div className="card mb-0">
                      <div className="card-body pb-1">
                        <div className="row">
                          <div className="col-lg-4">
                            {/* <div className="card">
                              <div className="card-body p-2 pt-3"> */}
                              <div style={{ width: "90%", maxHeight: "250px", overflow: "hidden", border:"1px solid #e6e7e8", marginLeft:"15px",borderRadius:"7px" }}>
                              <div style={{ transform: "scale(0.8)", transformOrigin: "top left", width: "125%" }}>
                              <Calendar
                                fullscreen={false}
                                onPanelChange={onPanelChange}
                                onSelect={handleSelectSlot}
                                disabledDate={(currentDate) => {
                                  const start = formData?.start_date ? dayjs(formData.start_date): "";
                                  const end = formData?.end_date ? dayjs(formData.end_date) : "";
                                  return currentDate.isBefore(start, 'day') || currentDate.isAfter(end, 'day');
                                }}
                              />
                              {/* </div>
                              </div> */}
                              </div>
                            </div>
                          </div>
                          <div className='col-8 px-3'>
                            <div className="card booking-wizard-slots mb-2">
                                <div className="card-body">
                                    <div className="book-title">
                                      <h6 className="fs-14 mb-2">{showSlots?.date ? `Select Shifts for ${showSlots?.date}` : "Select Shifts" }</h6>
                                    </div>
                                    {selectedSlots.length === 0 &&
                                    <div className="token-slot mb-2">
                                      <div className="row align-items-center g-2">
                                        <div className="col-md-11">
                                          <Select
                                            className="select"
                                            name="hours"
                                            options={ShiftHoursOptions}
                                            value={hourForm.hours ? ShiftHoursOptions.find(option => option.value === hourForm.hours) : null}
                                            onChange={(selected) =>
                                              setHourForm((prev) => ({ ...prev, hours: selected ? selected.value : "" }))
                                            }
                                            placeholder="Select"
                                            isClearable={true}
                                            isSearchable={true}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    }
                                    {!hourForm.hours &&
                                    <> 
                                    <div className="token-slot mt-2 mb-2">
                                      {slotOptions.map((slot, index) => (
                                          <div key={index} className="form-check-inline visits me-1">
                                            <label className="visit-btns">
                                                <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="appointment"
                                                checked={selectedSlots.includes(slot)}
                                                onChange={() => handleSlotSelection(slot)}
                                                />
                                                <span className="visit-rsn" style={{ minWidth: "130px" }}>{slot?.label}</span>
                                            </label>
                                          </div>
                                      ))}
                                    </div>
                                    <button onClick={(e) => {e.preventDefault(); saveSelectedEvent(showSlots?.date);}} className="btn btn-primary col-12">
                                    Save Selected Shifts
                                    </button>
                                    </>
                                    }
                                </div>
                            </div>
                          </div>
                          {eventDetails.length > 0 && (
                            <div className='col-12 px-3 mt-3'>
                              <div className="card booking-wizard-slots mb-1">
                                  <div className="card-body">
                                  <div className="book-title">
                                      <h6 className="fs-14 mb-2">Selected Shifts</h6>
                                  </div>
                              {eventDetails.map((item, index) => (
                                  <div key={index} className="mb-3">
                                  <strong className='form-label'>{item.event} on {item.date}</strong>
                                  <div className="token-slot mt-2 mb-2 d-flex flex-wrap">
                                      {item.slots.map((slot, slotIndex) => (
                                      <div key={slotIndex} className="d-flex align-items-center me-2 mb-2" style={{ border: '1px solid #ddd', borderRadius: '20px', padding: '5px 10px', background: '#f8f9fa' }}>
                                          <span className="me-2 visit-rsn form-label">{slot.label}</span>
                                          <FaTimesCircle
                                          onClick={() => handleDeleteSlot(item.date, slot)}
                                          className="text-danger"
                                          style={{ cursor: 'pointer', fontSize: '16px' }}
                                          />
                                      </div>))}
                                    </div>
                                  </div>))}
                                </div>
                              </div>
                            </div>)}
                          </div>
                        </div>
                      </div>
                    {/* </div> */}
                  </div>
                <div className="card-footer">
                  <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-end">
                    <Link to="#" ></Link>
                    <>
                    <button className="btn btn-md btn-primary-gradient rounded-pill" onClick={()=>history.push('/facility/jobs')}>Cancel</button>&nbsp;&nbsp;
                    <button
                      type="submit"
                      className="btn btn-md btn-primary-gradient rounded-pill"
                      disabled= {isLoading ? true : false}
                    >
                      {isLoading ?
                      <> 
                          <div className="spinner-border spinner-border-sm text-light col-1 mt-1" role="status">
                              <span className="sr-only">Submitting.....</span>
                          </div>
                          <span className="col text-light text-start p-1">Submitting.....</span>
                      </>
                              
                      : "Submit"}
                    </button>
                    </>
                  </div>
                </div>
              </div>
            </fieldset>
          </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <MessagePopup title={"Jobs"} message={"Are you sure want to delete job work hours?"} close={handleClose} show={show} yes={handleYes} no={handleNo}/>
    <SiteFooter />
</div>

  )
}

export default JobUpdate