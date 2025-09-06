import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { Calendar, theme } from 'antd';
import SiteHeader from '../home/header';
import SiteFooter from "../home/footer.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL, AUTH_TOKEN, workSettingOptions, jobTypeOptions,disciplineOptions, specialtyOptions, yearOptions, boolOption, langOptions, visitType, stateOptions, cntryOptions, ColourOption, SingleValue, MultiValueLabel, ShiftHoursOptions } from "../config";
import { useHistory } from 'react-router-dom';
import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
import moment from 'moment';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import { convertToUS } from '../utils.js';
import { FaTimesCircle} from "react-icons/fa";
import dayjs from 'dayjs';

const onPanelChange = (value, mode) => {
  console.log(value.format('YYYY-MM-DD'), mode);
};
const JobRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const history = useHistory();
  const facID = atob(localStorage.getItem('RecordID')) || "";
  const currentUser = atob(localStorage.getItem('userID')) || "";
  const userEmail = atob(localStorage.getItem('email')) || ""
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
      job_title: "",
      facility: facID,
      discipline:"",
      years_of_exp: "",
      speciality: "",
      license: "",
      work_setting: "",
      job_type: "",
      languages:"",
      visit_type:"",
      pay:"",
      cpr_bls:"",
      contact_person:"",
      address1:"",
      address2:"",
      city:"",
      state:"",
      country:1,
      zipcode:"",
      created_by:currentUser,
      start_date:"",
      end_date:"",
      contact_phone:"",
      contact_phone_area: "",
      contact_phone_prefix: "",
      contact_phone_line: "",
      status:"Inactive"
  });

  
  const [hourForm, setHourForm] = useState({
    job:"",
    facility:"",
    date: "",
    hours: "",
    status:""
  })

  const [hoursForm, setHoursForm] = useState([])

  // Job work hours
  
      const currentJobID = atob(localStorage.getItem('facJobID')) || "";
      
      const [value, onChange] = useState(new Date());
      const [startDate, setStartDate] = useState(null);
      const [endDate, setEndDate] = useState(null);
      const [scheduleVisible, setScheduleVisible] = useState(true);
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
      const [jobData, setJobData] = useState(null)
      const [bulkSelect, setBulkSelect] = useState(false);
      const [success, setSuccess] = useState(null);
      const [updateJobStatus, setUpdateJobStatus] = useState(null);
      const localizer = momentLocalizer(moment);
      const todayDate = new Date();
      
      const [show, setShow] = useState(false);
      const [addPopup, setAddPopup] = useState(false)
      const [advanceFields, setAdvanceFields] = useState(false)
      const [preference, setPreference] = useState([])

// Create Job

  const updateFieldAndTitle = (field, selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : "";
    const selectedLabel = selectedOption ? selectedOption.label : "";
  
    const updatedFormData = {
      ...formData,
      [field]: selectedValue,
    };
  
    const disciplineLabel =
      field === "discipline"
        ? selectedLabel
        : disciplineOptions.find((opt) => opt.value === updatedFormData.discipline)?.label || "";
  
    const workSettingLabel =
      field === "work_setting"
        ? selectedLabel
        : workSettingOptions.find((opt) => opt.value === updatedFormData.work_setting)?.label || "";
  
    const jobTypeLabel =
      field === "job_type"
        ? selectedLabel
        : jobTypeOptions.find((opt) => opt.value === updatedFormData.job_type)?.label || "";
  
    const jobTitleParts = [disciplineLabel, workSettingLabel, jobTypeLabel].filter(Boolean);
    updatedFormData.job_title = jobTitleParts.join(" - ");
  
    setFormData(updatedFormData);
  };
  
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/facility/GetFacility/?FacEmail=${userEmail}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN,
        }
      })
      .then((response) => {
        console.log("Facility Response :", response.data.data)
        const fac_data = response.data.data
        setFormData((prev)=>({
          ...prev,
          address1             : fac_data.fac_address,
          address2             : fac_data.fac_address_2,
          city                 : fac_data.fac_city,
          state                : fac_data.fac_state,
          zipcode              : fac_data.fac_zipcode,
          contact_person       : `${fac_data.fac_first_name} ${fac_data.fac_last_name}`,
          contact_phone_area   : fac_data.fac_contact_num.slice(0,3),
          contact_phone_prefix : fac_data.fac_contact_num.slice(3,6),
          contact_phone_line   : fac_data.fac_contact_num.slice(6,10),
        }))
        localStorage.setItem("RecordID", btoa(response.data.data.id))
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  }, [userEmail]);


  const fetchPreference = async () => {
    setError(null)
    setSuccess(null)
    setFormErrors({})
    try {
        const response = await axios.get(`${API_BASE_URL}/facility/preference/?FacUserID=${currentUser}`,{
            headers: { 
                "Content-Type": "application/json",
                'Authorization': AUTH_TOKEN
              },
        });
        console.log("Preference List",response.data)
        setPreference(response.data)
    } catch (err) {
        setError(err.response?.data?.Result || "An error occurred");
    }
  };

  useEffect(()=>{
    fetchPreference()
  },[currentUser])

  useEffect(() => {
    if (formData.discipline && preference?.length) {
      const matchedPref = preference.find(pref => pref.discipline === formData.discipline);
      let titleDiscipline = formData.discipline ? disciplineOptions.find(option => option.value == formData.discipline).label : "";
      if (matchedPref) {
        let titleSetting    = matchedPref.work_setting ? workSettingOptions.find(option => option.value == matchedPref.work_setting).label : "";
        let titleJobType    = matchedPref.job_type ? jobTypeOptions.find(option => option.value == matchedPref.job_type).label : "";

        setFormData(prev => ({
          ...prev,
          work_setting : matchedPref.work_setting || "",
          speciality   : matchedPref.speciality || "",
          job_type     : matchedPref.job_type || "",
          languages    : matchedPref.languages || "",
          visit_type   : matchedPref.visit_type || "",
          years_of_exp : matchedPref.years_of_exp || "",
          cpr_bls      : matchedPref.cpr_bls || "",
          job_title    : `${titleDiscipline}${titleSetting ? ` - ${titleSetting}` : ""}${titleJobType ? ` - ${titleJobType}` : ""}`,
          license      : matchedPref.license || "",
          pay          : matchedPref.pay || "",
        }));
      } else if (matchedPref === undefined) {
        setFormData(prev => ({
          ...prev,
          work_setting : "",
          speciality   : "",
          job_type     : "",
          languages    : "",
          visit_type   : "",
          years_of_exp : "",
          cpr_bls      : "",
          job_title    : titleDiscipline,
          license      : "",
          pay          : ""
        }));
      }
    }
  }, [formData.discipline]);
  
  
  
  const { token } = theme.useToken();
  const wrapperStyle = {
    width: '100%',
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value,
    });
  };

  const handleAdvance= () =>{
    // e.preventDefault();
    setAdvanceFields(!advanceFields);
  }

  const handleJobCancel= (e) =>{
    e.preventDefault();
    history.push("/facility/jobs")
  }


  const validiteFormInputs = (data) => {
      
    const errorObj = {};
    const phoneRegx = /\d/g

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(data.start_date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(data.end_date);
    start.setHours(0, 0, 0, 0);

      if (data.start_date == '') {
        errorObj.start_date = "Start date is required";
      }

      if (data.end_date == '') {
        errorObj.end_date = "End date is required";
      }

      if (start.getTime() < today.getTime()){
        errorObj.start_date = "Start date must be a future date. Please select a date after today.";
      }

      if (end.getTime() < today.getTime()){
        errorObj.end_date = "End date must be a future date. Please select a date after today.";
      }

      if (start.getTime() >= end.getTime()){
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

      if (data.contact_phone_area != '' || data.contact_phone_prefix != '' || data.contact_phone_line != '') {
        if (!Number.isInteger(parseInt(data.contact_phone_area)) || !Number.isInteger(parseInt(data.contact_phone_prefix)) || !Number.isInteger(parseInt(data.contact_phone_line))) {
          errorObj.contact_phone = "Invalid phone number";
        }else{
          if (data.contact_phone_area.length < 3 || data.contact_phone_prefix.length < 3 || data.contact_phone_line.length < 4 ){
            errorObj.contact_phone = "Invalid phone number";
          }
        }
      }

      // if (data.contact_phone != '') {
      //   if (!phoneRegx.test(data.contact_phone)) {
      //     errorObj.contact_phone = "Invalid contact number";
      //   }
      // }
      
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

      // if (data.cpr_bls == '') {
      //   errorObj.cpr_bls = "CPR/BLS is required";
      // }

      if (data.license == '') {
        errorObj.license = "License is required";
      }

      if (workHourData.length === 0 && hoursForm.length === 0) {
        errorObj.work_hours = "Please add work hours for this job"
        setError("Please add work hours for this job")
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
        let url = `${API_BASE_URL}/jobs/CreateJobs/`;
        let method = "POST";
        const updatedData = {...formData,start_date:moment(formData.start_date).format('YYYY-MM-DD'),end_date:moment(formData.end_date).format('YYYY-MM-DD'),contact_phone:`${formData.contact_phone_area}${formData.contact_phone_prefix}${formData.contact_phone_line}`}
        const response = await axios({
            method: method,
            url: url,
            data: updatedData,
            headers: { 
                "Content-Type": "application/json",
                'Authorization': AUTH_TOKEN
            }
        });
        localStorage.setItem('facJobID',btoa(response.data.JobID))
        setWorkHourData(prev => prev.map(item => ({ ...item, job: response.data.JobID })));
        setHoursForm((prev) => prev.map(item => ({ ...item, job:response.data.JobID })));
        setAddPopup(true)
      } catch (err) {
          console.log("CreateJobError",err)
          setError(err.response?.data?.Result || "An error occurred");
      } finally {
          setIsLoading(false);
      }
    }else{
      setFormErrors(formValidate)
      return false;
    }
  };

  console.log("JobData",formData)


  //Job work hours

    const handleYes = () => {
    setShow(false);
    setAddPopup(true)
    }

    const handleNo = () => {
    setShow(false);
    setAddPopup(false)
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const [schedule, setSchedule] = useState([])
    const scheduleOptions =  [
        {value:"All", label:"All Days"},
        {value:"Weekdays", label:"Weekdays"},
        {value:"Weekend", label:"Weekend"},
        {value:"Custom", label:"Custom"},
        {value:"Days", label:"Days Of Week"}
    ]

    useEffect(()=>{
        if(startDate){
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);

            if (today.getTime() > start.getTime()){
                setError("Start date must be a future date. Please select a date after today.")
                setScheduleVisible(false)
            }
        }
    },[startDate])

    useEffect(()=>{
        if(endDate){

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            start.setHours(0, 0, 0, 0);

            if (today.getTime() > end.getTime()){
                setError("End date must be a future date. Please select a date after today.")
                setScheduleVisible(false)
            }
        }
    },[endDate])

    // useEffect(() => {
    //     axios
    //       .get(`${API_BASE_URL}/jobs/GetJobs/?JobID=${currentJobID}&method=single`, {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'Authorization': AUTH_TOKEN,
    //         }
    //     })
    //     .then((response) => {
    //         setJobData(response.data.data);
    //         setStartDate(new Date(response.data.data.start_date));
    //         setEndDate(new Date(response.data.data.end_date));
    //     })
    //     .catch((err) => {
    //         console.error('Error:', err);
    //     });
    // }, [currentJobID]);

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
    
  
    const convertTo12HourFormat = (time24) => {
        const [hours, minutes] = time24.split(':');
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        const minutesFormatted = minutes.padStart(2, '0');
        return `${hours12}:${minutesFormatted} ${period}`;
    };

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
 

    // Days of week
    const dayOptions = [
        { value: 'Monday', label: 'Monday' },
        { value: 'Tuesday', label: 'Tuesday' },
        { value: 'Wednesday', label: 'Wednesday' },
        { value: 'Thursday', label: 'Thursday' },
        { value: 'Friday', label: 'Friday' },
        { value: 'Saturday', label: 'Saturday' },
        { value: 'Sunday', label: 'Sunday' }
    ];

    // Handle start and end dates
    const handleStartDate = (date) => {
        setError(null)
        if (date.getTime() <= todayDate.getTime()){
            setError("Start date must be a future date. Please select a date after today.")
            setScheduleVisible(false)
        }else{
            setStartDate(date)
            setScheduleVisible(true)
        }
        
    };
    const handleEndDate = (date) => { 
        setError(null)
        if (date.getTime() <= todayDate.getTime()){
            setError("End date must be a future date. Please select a date after today.")
            setScheduleVisible(false)
        }else{
            setEndDate(date); 
            setScheduleVisible(true)
        };
    }

    //For weekdays, weekend, custom
    // const handleScheduleChange = (e) => {
    //     const value = e.target.value;
    //     setSelectedSchedule([value]);
    // };

    const handleScheduleChange = (selected) => {
        setSuccess(null)
        setError(null)
        if (selected) {
            setSchedule(selected);
            setSelectedSchedule([selected.value]);
        } else {
            setSchedule([]);
            setSelectedSchedule([]);
            setShowCalender(false)
            setShowSlots({
                date:"",
                bulk:false,
                scheduleOption:[],
                show:false
            });
        }
    };
    
    
    const handleBulkChange = (e) => {
        const isChecked = e.target.checked;
        setBulkSelect(isChecked);
        setShowSlots({...showSlots, show:isChecked, bulk:isChecked, scheduleOption:selectedSchedule})
    };

    //For days of the week 
    const handleDaysOfWeekChange = (e) => {
        const value = e.target.value;
        setSelectedSchedule(prev =>
            prev.includes(value) 
            ? prev.filter(day => day !== value) 
            : [...prev, value]
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

    useEffect(() => {
        const days = [];
        let start = new Date(startDate)
        let end = new Date(endDate)
        start.setHours(0, 0, 0, 0)
        end.setHours(0, 0, 0, 0)
        selectedMonths.forEach(month => {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const year = month.split(" ")[1];
            const monthIndex = months.findIndex(monthName => monthName === month.split(" ")[0]);
            const lastDateOfMonth = new Date(year, monthIndex + 1, 0).getDate();
    
            let currentMonthDays = [];

            if (selectedSchedule[0] === "Custom"){
                currentMonthDays.push((new Date(startDate)).toLocaleDateString())
            }else{
                currentMonthDays = [];
                for (let day = 1; day <= lastDateOfMonth; day++) {
                    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    const currentDate = new Date(year, monthIndex, day);
        
                    let scheduleArray = [];
                    if (selectedSchedule) {
                        if (selectedSchedule[0] === "Weekdays") {
                            scheduleArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
                        } else if (selectedSchedule[0] === "Weekend") {
                            scheduleArray = ["Saturday", "Sunday"];
                        }else if (selectedSchedule[0] === "All"){
                            scheduleArray = daysOfWeek
                        }else{
                            scheduleArray = selectedSchedule
                        }
                    }
        
                    if (scheduleArray.includes(daysOfWeek[currentDate.getDay()])) {
                       if (currentDate >= start && currentDate <= end) {
                            currentMonthDays.push(currentDate.toLocaleDateString());
                        }
                    }
                }
            }
            days.push({ month: month.split(" ")[0], days: currentMonthDays });
        });

        if (selectedSchedule.length > 0){
            if (selectedSchedule[0] !== "Days"){
                setShowCalender(true)
            }else{
                if (selectedSchedule.length >= 2){
                    setShowCalender(true)
                }else{
                    setShowCalender(false)
                }
            }
        }
    
        setCalendarDates(days);
    }, [selectedSchedule, selectedMonths]);


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

    function dayPropGetter(date) {
        for (const calender of calendarDates) {
            if (calender.days.includes(date.toLocaleDateString())) {
                return { className: "selected-calender" };
            }
        }
        return {};
    }

    const handleSelectSlot = (date) => {
      const formattedDate = convertToUS(date, "Date");
      const isoDate = moment(formattedDate).format('YYYY-MM-DD');

      const savedSlots = eventDetails.find(event => event.date === formattedDate)?.slots || [];
      setSelectedSlots(savedSlots);

      setShowSlots({ ...showSlots, show: true, date: formattedDate });

      const existingHour = hoursForm.find(event => event.date === isoDate)?.hours || "";

      setHourForm((prev) => ({
        ...prev,
        date: formattedDate,
        hours: existingHour,
        job: "",
        facility: facID,
        status: "Available"
      }));
    };



    const handleHours = async () => {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      try {    
          const response = await axios.post(`${API_BASE_URL}/jobs/CreateJobWorkHours/`, hoursForm, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': AUTH_TOKEN
              }
          });
          if(response.data){
              setError(null)
              setSuccess("Hours Created Successfully")
              setUpdateJobStatus(true)
            }
      } catch (err) {
          console.error('Error:', err);
          setSuccess(null)
          setError('An error occurred while submitting the form.');
      } finally {
          setIsLoading(false);
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
                setSuccess("Job Created Successfully")
                setUpdateJobStatus(true)
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
          if (hourForm.hours){
            handleHours();
          }else{
            handleWorkHourSubmit();
          }
        }
    }, [addPopup]);
    

    const jobStatus = async(id) => {

        const statusData = {
            status:"Active"
        }

        try {    
            const response = await axios.put(`${API_BASE_URL}/jobs/UpdateJobs/${id}/`, statusData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                }
            });
            if(response.status === 200){
                setSuccess("Job updated Successfully")
                localStorage.setItem('searchJobID',btoa(id))
                localStorage.setItem('setJobSearch',true)
                history.push('/facility/search')
            }   
        } catch (err) {
            console.error('Error:', err);
            setSuccess(null)
            setError( err.response.data.Result || 'An error occurred while submitting the form.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if(updateJobStatus){
            jobStatus(currentJobID)
        }
    },[updateJobStatus])

    useEffect(() => {
      if (!hourForm.date) return;

      setHoursForm(prev => {
        const exists = prev.some(entry => entry.date === hourForm.date);

        if (exists) {
          return prev.map(entry =>
            entry.date === hourForm.date
              ? { ...entry, hours: hourForm.hours }
              : entry
          );
        } else {
          return [...prev, { ...hourForm }];
        }
      });
    }, [hourForm]);


    console.log("showSlots",showSlots)
    console.log("selectedSlots",selectedSlots)
    console.log("eventDetails",eventDetails)
    console.log("workHourData",workHourData)
    console.log("hoursForm",hoursForm)
    
  return (
  <div className="main-wrapper">
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
              <h2 className="breadcrumb-title">Create Job</h2>
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
          <div className="booking-wizard">
            {/* <ul
              className="form-wizard-steps d-sm-flex align-items-center justify-content-center"
              id="progressbar2"
            >
              <li className={
                      currentStep === 1
                        ? 'progress-active'
                        : currentStep > 1
                        ? 'progress-activated'
                        : ''
                    }>
                <div className="profile-step">
                  <span className="multi-steps">1</span>
                  <div className="step-section">
                    <h6>Job</h6>
                  </div>
                </div>
              </li>
              <li className={
                      currentStep === 2
                        ? 'progress-active'
                        : currentStep > 2
                        ? 'progress-activated'
                        : ''
                    }>
                <div className="profile-step">
                  <span className="multi-steps">2</span>
                  <div className="step-section">
                    <h6>Job Work Hours</h6>
                  </div>
                </div>
              </li>
              
              <li className={
                      currentStep === 3
                        ? 'progress-active'
                        : currentStep > 3
                        ? 'progress-activated'
                        : ''
                    }>
                <div className="profile-step">
                  <span className="multi-steps">3</span>
                  <div className="step-section">
                    <h6>Confirmation</h6>
                  </div>
                </div>
              </li>
            </ul> */}
          </div>
          <div className="booking-widget multistep-form mb-5">
          {currentStep === 1 && (
          <div>
            <form onSubmit={handleSubmit} className='mb-3'>
            <fieldset id="first">
              <div className="card booking-card mb-0">
                {/* <div className="card-header">
                  <h3>Create Job</h3>
                </div> */}
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
                          <div className="mb-3">
                            <label className="form-label">Select Discipline <span className="text-danger">*</span></label> 
                            <Select
                              className="select"
                              name = "discipline"
                              options={disciplineOptions}
                              value={formData.discipline ? disciplineOptions.find(option => option.value == formData.discipline):null}
                              onChange={(selected) => updateFieldAndTitle("discipline", selected)}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                              components={{ Option : ColourOption, SingleValue }}
                            />
                            {formErrors.discipline && <div className="form-label text-danger m-1">{formErrors.discipline}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Start Date <span className="text-danger">*</span>
                            </label>
                            <div className="form-icon">
                            <DatePicker
                            className="form-control datetimepicker"
                            name="start_date"
                            minDate={new Date()}
                            selected={formData.start_date}
                            onChange={(date) => setFormData({...formData, start_date: date})}
                            dateFormat="MM/dd/yyyy"
                            showDayMonthYearPicker
                            autoComplete='off'
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
                            minDate={new Date()}
                            name="end_date"
                            selected={formData.end_date}
                            onChange={(date) => setFormData({...formData, end_date: date})}
                            dateFormat="MM/dd/yyyy"
                            showDayMonthYearPicker
                            autoComplete='off'
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
                            <input type="text" name="job_title" value={formData.job_title} onChange={handleInputChange} className="form-control" />
                            {formErrors.job_title && <div className="form-label text-danger m-1">{formErrors.job_title}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Address 1 <span className="text-danger">*</span></label>
                            <input type="text" name="address1" value={formData.address1} onChange={handleInputChange} className="form-control" />
                            {formErrors.address1 && <div className="form-label text-danger m-1">{formErrors.address1}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Address 2</label>
                            <input type="text" name="address2" value={formData.address2} onChange={handleInputChange} className="form-control" />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">City <span className="text-danger">*</span></label>
                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="form-control" />
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
                              value={formData.state ? stateOptions.find(option => option.value == formData.state) : null}
                              onChange={(selected) => setFormData({...formData, state: selected.value})}
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
                              //value={cntryOptions.find(option => option.value == formData.country)}
                              value={cntryOptions[0]}
                              onChange={(selected) => setFormData({...formData, country: selected.value})}
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
                            <input type="text" name="zipcode" value={formData.zipcode} onChange={handleInputChange} className="form-control" />
                            {formErrors.zipcode && <div className="form-label text-danger m-1">{formErrors.zipcode}</div>}
                          </div>
                        </div>
                        
                        {advanceFields &&
                        <>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Select Work Experience</label>
                            
                            <Select
                              className="select"
                              name="years_of_exp"
                              options={yearOptions}
                              value={formData.years_of_exp ? yearOptions.find(option => option.value == formData.years_of_exp) : null}
                              onChange={(selected) => setFormData({...formData, years_of_exp: selected ? selected.value : null})}
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
                              value={formData.speciality ? specialtyOptions.find(option => option.value == formData.speciality) : null}
                              onChange={(selected) => setFormData({...formData, speciality: selected ? selected.value : null})}
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
                              value={formData.work_setting ? workSettingOptions.find(option => option.value == formData.work_setting) : null}
                              onChange={(selected) => updateFieldAndTitle("work_setting", selected)}
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
                              value={formData.job_type ? jobTypeOptions.find(option => option.value == formData.job_type) : null}
                              onChange={(selected) => updateFieldAndTitle("job_type", selected)}
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
                              value={formData.languages ? langOptions.find(option => option.value == formData.languages) : null}
                              onChange={(selected) => setFormData({...formData, languages: selected ? selected.value : null})}
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
                              value={formData.visit_type ? visitType.find(option => option.value == formData.visit_type) : null}
                              onChange={(selected) => setFormData({...formData, visit_type: selected ? selected.value : null})}
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
                            <input type="text" name="contact_person" value={formData.contact_person} onChange={handleInputChange} className="form-control" />
                            {formErrors.contact_person && <div className="form-label text-danger m-1">{formErrors.contact_person}</div>}
                          </div>
                        </div>
                        
                        {/* <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Contact <span className="text-danger">*</span></label>
                            <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleInputChange} className="form-control" />
                            {formErrors.contact_phone && <div className="form-label text-danger m-1">{formErrors.contact_phone}</div>}
                          </div>
                        </div> */}
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Contact</label>
                            <div className="row g-2">
                              <div className="col-4">
                              <input
                                type="text"
                                maxLength={3}
                                name="contact_phone_area"
                                value={formData.contact_phone_area}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                              </div>
                              <div className="col-4">
                              <input
                                type="text"
                                maxLength={3}
                                name="contact_phone_prefix"
                                value={formData.contact_phone_prefix}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                              </div>
                              <div className="col-4">
                              <input
                                type="text"
                                maxLength={4}
                                name="contact_phone_line"
                                value={formData.contact_phone_line}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                              </div>
                              {formErrors.contact_phone && (
                                <div className="form-label text-danger m-1">{formErrors.contact_phone}</div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">CPR/BLS:</label>
                            
                            <Select
                              className="select"
                              name="cpr_bls"
                              options={boolOption}
                              value={formData.cpr_bls ? boolOption.find(option => option.value === formData.cpr_bls) : null}
                              onChange={(selected) => setFormData({...formData, cpr_bls: selected ? selected.value : null})}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            {formErrors.cpr_bls && <div className="form-label text-danger m-1">{formErrors.cpr_bls}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Pay:</label>
                            <input type="text" name="pay" value={formData.pay} onChange={handleInputChange} className="form-control" />
                            {formErrors.pay && <div className="form-label text-danger m-1">{formErrors.pay}</div>}
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">License:</label>
                            
                            <Select
                              className="select"
                              name="license"
                              options={boolOption}
                              value={formData.license ? boolOption.find(option => option.value === formData.license) : null}
                              onChange={(selected) => setFormData({...formData, license: selected ? selected.value : null})}
                              placeholder="Select"
                              isClearable={true}
                              isSearchable={true}
                            />
                            {formErrors.license && <div className="form-label text-danger m-1">{formErrors.license}</div>}
                          </div>
                        </div>
                        </>
                        }
                        <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-end mb-2 mt-1">
                        <Link
                          to="#"
                          className="text-primary font-weight-bold"
                          disabled= {isLoading ? true : false}
                          onClick={handleAdvance}
                          >
                          {advanceFields ? (
                            <>
                              Remove Fields <i className="fas fa-chevron-up ms-1"></i>
                            </>
                          ) : (
                            <>
                              Advance Fields <i className="fas fa-chevron-down ms-1"></i>
                            </>
                          )}
                        </Link>
                        </div>

                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="card booking-card mb-0"> */}
            {/* <div className="card-header">
            <h3>Work Shifts</h3>
            </div> */}
            {formData.start_date && formData.end_date 
            ? <>
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
                            const start = formData.start_date ? dayjs(formData.start_date): "";
                            const end = formData.end_date ? dayjs(formData.end_date) : "";
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
                                        name="discipline"
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
                    <Link
                      to="#"
                      // className="btn btn-md btn-dark inline-flex align-items-center rounded-pill"
                    >
                      {/* <i className="isax isax-arrow-left-2 me-1" />
                      Back */}
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-md btn-primary-gradient rounded-pill mx-2"
                      disabled= {isLoading ? true : false}
                    >
                      {isLoading ?
                      <> 
                          <div class="spinner-border spinner-border-sm text-light col-1 mt-1" role="status">
                              <span class="sr-only">Submitting.....</span>
                          </div>
                          <span className="col text-light text-start p-1">Submitting.....</span>
                      </>
                              
                      : "Submit"}
                    </button>

                    <button 
                      className="btn btn-md btn-primary-gradient rounded-pill"
                      disabled= {isLoading ? true : false}
                      onClick={(e)=>handleJobCancel(e)}
                      >
                        Cancel
                    </button>
                  </div>
                </div>
                </>
              :null}
              </div>
            </fieldset>
          </form>
        </div>
          )}
            {currentStep === 2 && (
            <fieldset style={{display:'block'}}>
              <div className="card booking-card mb-0">
                <div className="card-header">
                <h3>Job Work Hours</h3>
                </div>
                <div className="card-body booking-body">
                  <div className="card mb-0">
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-lg-5">
                          <div className="card">
                            <div className="card-body p-2 pt-3">
                            <div style={wrapperStyle}>
                            <Calendar fullscreen={false}  validRange={[startDate, endDate]} onPanelChange={onPanelChange} />
                            </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-7 px-3'>
                            <div className="card booking-wizard-slots mb-2">
                                <div className="card-body">
                                    <div className="book-title">
                                    <h6 className="fs-14 mb-2">Select Shifts for {showSlots?.date}</h6>
                                    </div>
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
                                    <button onClick={() => saveSelectedEvent(showSlots?.date)} className="btn btn-primary col-12">
                                    Save Selected Shifts
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* <div className="col-lg-7">
                          <div className="card booking-wizard-slots">
                            <div className="card-body">
                              <div className="book-title">
                                <h6 className="fs-14 mb-2">Morning</h6>
                              </div>
                              <div className="token-slot mt-2 mb-2">
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                      defaultChecked
                                    />
                                    <span className="visit-rsn">09:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">-</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">-</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">09:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">-</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                              </div>
                              <div className="book-title">
                                <h6 className="fs-14 mb-2">Afternoon</h6>
                              </div>
                              <div className="token-slot mt-2 mb-2">
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                      defaultChecked
                                    />
                                    <span className="visit-rsn">09:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">-</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                              </div>
                              <div className="book-title">
                                <h6 className="fs-14 mb-2">Evening</h6>
                              </div>
                              <div className="token-slot mt-2 mb-2">
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                      defaultChecked
                                    />
                                    <span className="visit-rsn">09:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">-</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">-</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">09:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">-</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">10:45</span>
                                  </label>
                                </div>
                                <div className="form-check-inline visits me-1">
                                  <label className="visit-btns">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="appintment"
                                    />
                                    <span className="visit-rsn">-</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="d-flex align-items-center flex-wrap rpw-gap-2 justify-content-between">
                    <Link
                      to="#"
                      className="btn btn-md btn-dark prev_btns inline-flex align-items-center rounded-pill"
                      onClick={handlePrev}
                    >
                      <i className="isax isax-arrow-left-2 me-1" />
                      Back
                    </Link>
                    <Link
                      to="#"
                      className="btn btn-md btn-primary-gradient next_btns inline-flex align-items-center rounded-pill"
                      onClick={handleNext}
                    >
                      Submit
                      <i className="isax isax-arrow-right-3 ms-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </fieldset>
        )}
            {currentStep === 3 && (
            <fieldset style={{display:'block'}}>
              <div className="card booking-card">
                <div className="card-body pb-1">
                  <div className="login-content-info">
                    <div className="container">
                      {/* Login Phone */}
                      <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-8">
                          <div className="account-content">
                            <div className="account-info">
                              <div className="login-verify-img">
                                <i className="isax isax-tick-circle" />
                              </div>
                              <div className="login-title">
                                <h3>Success</h3>
                                <p>Job Registration has been Successfully</p>
                              </div>
                              <form>
                                <div className="mb-3">
                                  <Link
                                    className="btn btn-primary-gradient w-100"
                                    to='/site-login'
                                  >
                                    Sign In
                                  </Link>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    {/* /Login Phone */}
                  </div>
                </div>
                </div>
              </div>
              <div>
                <Link to="#" className="" onClick={()=>setCurrentStep(1)}>
                  <i className="isax isax-arrow-left-2 me-1" />
                  Back to first
                </Link>
              </div>
            </fieldset>
        )}
          </div>
          {/* <div className="text-center">
            <p className="mb-0">
              Copyright © {new Date().getFullYear()}. All Rights Reserved, AmplifyShift
            </p>
          </div> */}
        </div>
      </div>
    </div>
  </div>
    <SiteFooter />
</div>

  )
}

export default JobRegistration