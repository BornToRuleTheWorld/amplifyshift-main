import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { AUTH_TOKEN,API_BASE_URL } from "../../config.js";
import { useLocation, useHistory,Link } from 'react-router-dom';
import SiteHeader from "../../home/header.jsx";
import SiteFooter from "../../home/footer.jsx";
import ImageWithBasePath from "../../../../../core/img/imagewithbasebath.jsx";
import { FaTimesCircle} from "react-icons/fa";
import ProfessionalNav from "./ProfessionalNav.jsx";
import Select from "react-select";
import MessagePopup from "../../messagePopup.js";

function ProfessionalSlot(){
    const email = atob(localStorage.getItem('email'));
    const [value, onChange] = useState(new Date());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [error, setError] = useState('');
    const [scheduleVisible, setScheduleVisible] = useState(false);
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
    const [profData, setProfData] = useState(null);
    const [slotOptions, setSlotOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState([])
    const [bulkSelect, setBulkSelect] = useState(false);
    const [success, setSuccess] = useState(null);
    const [schedule, setSchedule] = useState([])
    const scheduleOptions =  [
        {value:"All", label:"All Days"},
        {value:"Weekdays", label:"Weekdays"},
        {value:"Weekend", label:"Weekend"},
        {value:"Custom", label:"Custom"},
        {value:"Days", label:"Days Of Week"}
    ]
    const history = useHistory();
    const localizer = momentLocalizer(moment);
    const todayDate = new Date();

    const [show, setShow] = useState(false);
    const [addPopup, setAddPopup] = useState(false)

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

    useEffect(() => {
        axios
          .get(`${API_BASE_URL}/professional/getProf/?ProfEmail=${email}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': AUTH_TOKEN,
            }
        })
        .then((response) => {
            setProfData(response.data);
        })
        .catch((err) => {
            console.error('Error:', err);
        });
    }, [email]);
    

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
        
            console.log(response);

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
        setSelectedSlots(prevState => {
            if (prevState.includes(slot)) {
                return prevState.filter(s => s !== slot);
            }
            return [...prevState, slot];
        });
    };

    const saveSelectedEvent = (start) => {
        console.log("saveSelectedEvent",selectedSlots)
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
                                setFormData(prev => [
                                    ...prev,
                                    {
                                        user: profData.data.user,
                                        professional: profData.data.id,
                                        date: day,
                                        status: "Available",
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
                
                                setFormData(prev => 
                                    prev.map(item => 
                                        item.date === day && item.status === "Available"
                                    ? {...item, slot:selectedSlots.map(slot => slot.value)}
                                    : item
                                ));
                            }
                    
                    }
                }
            }else{
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
                    setFormData(prev => [
                        ...prev,
                        {
                            user: profData.data.user,
                            professional: profData.data.id,
                            date: start,
                            status: "Available",
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

                    setFormData(prev => 
                        prev.map(item => 
                            item.date === start && item.status === "Available"
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

        setFormData(prev =>
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
        }else{
            setStartDate(date)
        }
        
    };
    const handleEndDate = (date) => { 
        setError(null)
        if (date.getTime() <= todayDate.getTime()){
            setError("End date must be a future date. Please select a date after today.")
        }else{
            setEndDate(date); 
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
            let start = new Date(startDate);
            let end = new Date(endDate);
                let diffTime = start.getTime() - end.getTime();
                let diffDays = Math.round(diffTime / (1000 * 3600 * 24));

                if (Math.abs(diffDays) >= 7 && Math.abs(diffDays) <= 90) {
                    setScheduleVisible(true);
                } else {
                    setScheduleVisible(false);
                }

                if (Math.abs(diffDays) > 90) {
                    setError("Invalid date range, must be between 3 months");
                    setScheduleVisible(false);
                    setCalendarDates([]);
                } else if (Math.abs(diffDays) < 7) {
                    setError("Invalid date range, must be greater than a week");
                    setScheduleVisible(false);
                    setCalendarDates([]);
                } else {
                    setError(null);
                }
        }
    }, [startDate, endDate]);

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
                        if (currentDate >= startDate && currentDate <= endDate) {
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


    console.log(calendarDates)
    const handleSelectSlot = ({ start }) => {
        setSelectedSlots([])
        for (const calender of calendarDates) {
            if (calender.days.includes(start.toLocaleDateString())) {
                setShowSlots({...showSlots, show:true, date:start.toLocaleDateString()})
            }
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true)
        setError(null)
        setSuccess(null)
        try {    
            const response = await axios.post(`${API_BASE_URL}/professional/CreateProfSlot/`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                }
            });
            if(response.data){
                localStorage.setItem('slotID',btoa(response.data.ProfSlot))
                setError(null)
                setStartDate(null)
                setEndDate(null)
                setSelectedSchedule([])
                setScheduleVisible(false)
                setShowCalender(false)
                setShowSlots({
                    date:"",
                    bulk:false,
                    scheduleOption:[],
                    show:false
                });
                setSuccess("Shifts Created Successfully")
                history.push('/professional/myshifts')
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

    useEffect(() => {
        if(addPopup){
            handleSubmit();
        }
    }, [addPopup]);


console.log("selectedEvent",selectedEvent)
console.log("calendarDates",calendarDates)
console.log("selectedSlots",selectedSlots)
return (
    <div>
    <SiteHeader />
    <>
    <div className="breadcrumb-bar">
      <div className="container">
        <div className="row align-items-center inner-banner">
          <div className="col-md-12 col-12 text-center">
            <nav aria-label="breadcrumb" className="page-breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/home">
                    <i className="isax isax-home-15" />
                  </a>
                </li>
                <li className="breadcrumb-item" aria-current="page">
                    <Link to="/professional/dashboard">Professional</Link>
                </li>
                <li className="breadcrumb-item active">
                    <Link to="/professional/myshifts">Shifts</Link>
                </li>
              </ol>
              <h2 className="breadcrumb-title">MyShifts</h2>
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
    </>
    <div className="container mt-4 mb-4">
    {/* <ProfessionalNav/> */}
    <div className="row mb-4">
        <div className="row mb-3">
            <div className="col-12 p-4">
                <h3>Create Shifts</h3><hr/>
            </div>
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
            <div className="col-3">
                <label className="form-label">Start Date:</label>
                <DatePicker
                    selected={startDate}
                    onChange={handleStartDate}
                    placeholderText="MM:DD:YYY"
                    className="form-control datepicker"
                />
            </div>
            <div className="col-3">
                <label className="form-label">End Date:</label>
                <DatePicker
                    selected={endDate}
                    onChange={handleEndDate}
                    placeholderText="MM:DD:YYY"
                    className="form-control datepicker"
                />
            </div>
        </div>

        {scheduleVisible && (
            <div className="container">
                <div className="row mb-4 w-100">
                    <label className="form-label py-2">Schedule:</label>
                    <div className="col-3">
                        <Select
                            className="select"
                            options={scheduleOptions}
                            value={schedule}
                            onChange={handleScheduleChange}
                            placeholder="Select"
                            isClearable={true}
                            isSearchable={true}
                        />
                    </div>
                    {/* <div className="col-2">
                        <label>
                            <input
                                type="radio"
                                value="All"
                                checked={selectedSchedule.includes("All")}
                                onChange={handleScheduleChange}
                            />
                            &nbsp;
                            All Days
                        </label>
                    </div>
                    <div className="col-2">
                        <label>
                            <input
                                type="radio"
                                value="Weekdays"
                                checked={selectedSchedule.includes("Weekdays")}
                                onChange={handleScheduleChange}
                            />
                            &nbsp;
                            Weekdays
                        </label>
                    </div>
                    <div className="col-2">
                        <label>
                            <input
                                type="radio"
                                value="Weekend"
                                checked={selectedSchedule.includes("Weekend")}
                                onChange={handleScheduleChange}
                            />
                            &nbsp;
                            Weekend
                        </label>
                    </div>
                    <div className="col-2">
                        <label>
                            <input
                                type="radio"
                                value="Custom"
                                checked={selectedSchedule.includes("Custom")}
                                onChange={handleScheduleChange}
                            />
                            &nbsp;
                            Custom
                        </label>
                    </div>
                    <div className="col-2">
                        <label>
                            <input
                                type="radio"
                                value="Days"
                                checked={selectedSchedule.includes("Days")}
                                onChange={handleScheduleChange}
                            />
                            &nbsp;
                            Days Of Week
                        </label>
                    </div> */}
                </div>

                <div className="row mb-4">
                    <label className="form-label">Bulk Select:</label>
                    <div class="col-2">
                        {/* <input class="form-check-input border" type="checkbox" value="" id="flexCheckDefault" checked={bulkSelect} onChange={handleBulkChange}/>
                        <label class="form-check-label" for="flexCheckDefault">
                        Select All
                    </label> */}
                    <label>
                    <input
                        type="checkbox"
                        checked={bulkSelect}
                        onChange={handleBulkChange}
                    />
                    &nbsp;
                    Select All</label>
                    </div>
                </div>

                {selectedSchedule.includes('Days') && (
                    <div className="row">
                        {dayOptions.map(day => (
                            <div key={day.value} className="mb-2">
                                <input
                                    type="checkbox"
                                    value={day.value}
                                    onChange={handleDaysOfWeekChange}
                                    checked={selectedSchedule.includes(day.value)}
                                />&nbsp;
                                <label>{day.label}</label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {showCalender && (
            <div className="row mb-4">
                {calendarDates.map((calender, index) => (
                    <div className="col" key={calender.month}>
                        <Calendar
                            minDate={startDate}
                            maxDate={endDate}
                            onChange={onChange}
                            value={calender.days}
                            isMultiSelection={true}
                            onClickDay={(value, event) => {
                                if (value) {
                                    const formattedDate = value.toLocaleDateString();
                                    let updatedDays;

                                    if (calender.days.includes(formattedDate)) {
                                        updatedDays = calender.days.filter(day => day !== formattedDate);
                                    } else {
                                        updatedDays = [...calender.days, formattedDate];
                                    }

                                    setCalendarDates(prevCalendarDates => {
                                        const newCalendarDates = [...prevCalendarDates];
                                        newCalendarDates[index] = { ...calender, days: updatedDays };
                                        return newCalendarDates;
                                    });
                                }
                            }}
                            tileClassName={({ date, view }) => {
                                if (calender.days.includes(date.toLocaleDateString())) {
                                    return "selected-calender";
                                }
                            }}
                        />
                    </div>
                ))}
            </div>
        )}

        {showCalender && (
            <div className="row mb-4">
                <div className="col-7">
                    <BigCalendar
                        localizer={localizer}
                        events={selectedEvent}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height:600,border:"1px solid grey", padding:"10px",borderRadius:"7px"}}
                        views={['month','week','day']}
                        selectable={true}
                        dayPropGetter = {dayPropGetter}
                        onSelectSlot={handleSelectSlot}
                    />
                </div> 
                <div className="col-6 mb-2">
                    <div className="row">
                    {/* {showSlots.show && (
                        <div className="col mb-2">
                            <h3 className="form-label">Select Shifts for {showSlots.date}</h3>
                            <div>
                                {slotOptions.map((slot, index) => (
                                    <div key={index} className="p-1">
                                        <input
                                            type="checkbox"
                                            value={slot.value}
                                            checked={selectedSlots.includes(slot)}
                                            onChange={() => handleSlotSelection(slot)}
                                        />&nbsp;
                                        <label>{slot.label}</label>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => saveSelectedEvent(showSlots.date)} className="btn btn-primary col-11">Save Selected Shifts</button>
                        </div>
                    )} */}
                    {showSlots.show && (
                        <div className="card booking-wizard-slots mb-3">
                            <div className="card-body">
                            <div className="book-title">
                                <h6 className="fs-14 mb-2">Select Shifts for {showSlots.date}</h6>
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
                                    <span className="visit-rsn" style={{minWidth:"130px"}}>{slot.label}</span>
                                    </label>
                                </div>
                                ))}
                            </div>
                            <button onClick={() => saveSelectedEvent(showSlots.date)} className="btn btn-primary col-12">
                                Save Selected Shifts
                            </button>
                            </div>
                        </div>
                        )}

                    <div className="col mb-2">
                        {eventDetails.length > 0 ?
                        <>
                            <h3 className="form-label">Selected Shifts:</h3>
                            <ul>
                                {eventDetails.map((item, index) => (
                                    <li key={index}>
                                        <strong>{item.event} on {item.date}</strong><br/>
                                        <div>
                                            {item.slots.map((slot, slotIndex) => (
                                                <div key={slotIndex} className="d-flex align-items-center">
                                                    <span>{slot.label}</span>
                                                    <FaTimesCircle onClick={() => handleDeleteSlot(item.date,slot)} className="text-danger mx-1" />
                                                </div>
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            </>
                        :null}
                    </div>
                    </div>
                    {eventDetails.length === 0 ? null :
                    <button type="button" className="btn btn-primary mb-3 col-5" disabled={isLoading} onClick={handleShow}>
                        {isLoading ?
                        <> 
                            <div class="spinner-border spinner-border-sm text-light col-1 mt-1" role="status">
                                <span class="sr-only">Submitting.....</span>
                            </div>
                            <span className="col text-light text-start p-1">Submitting.....</span>
                        </>
                                
                        : "Submit"}
                    </button>
                    }
                </div>
            </div>
        )}
    </div>
    
    </div>
    <MessagePopup title={"Shifts"} message={"Are you sure want to create shift hours?"} close={handleClose} show={show} yes={handleYes} no={handleNo}/>
    <SiteFooter />
    </div>
);
}

export default ProfessionalSlot;
