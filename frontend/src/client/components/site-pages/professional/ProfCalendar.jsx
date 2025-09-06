import React, {useState, useEffect} from "react";
import SiteHeader from "../home/header.jsx";
import SiteFooter from "../home/footer.jsx";
import { doctordashboardprofile01, doctordashboardprofile02, doctordashboardprofile04, doctordashboardprofile05, doctordashboardprofile06, doctordashboardprofile07, doctordashboardprofile08, doctordashboardprofile3 } from "../../imagepath.jsx";
import { Link, useHistory } from "react-router-dom";
// import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
import ImageWithBasePath from "../../../../core/img/imagewithbasebath.jsx";
import WorkHours from "../work_hours/workHours.jsx";
import axios from "axios";
import {AUTH_TOKEN, API_BASE_URL, shiftColor} from '../config';
import { FaTimesCircle, FaEye, FaSearch, FaHourglassHalf, FaPlusCircle, FaPlus } from "react-icons/fa";
import { Calendar, theme } from 'antd';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import moment from 'moment';
import ShiftPopup from "../shiftPopup.js";
import CalendarPopup from "../calendarPopup.js";
import { format } from "date-fns";
import EventPopup from "../eventPopup.js";
import { convertToUS } from "../utils.js";


const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
};

const ProfCalendar = (props) => {
  
    const [showWorkHours, setShowWorkHours] = useState(false);
    const ProfID = atob(localStorage.getItem('userID')) || "";
    const currentUserID = atob(localStorage.getItem('RecordID')) || "";

    const [showCal, setShowCal] = useState(false);
    const [showViewPage, setShowViewPage] = useState(false);
    const [showEvent, setShowEvent] = useState(false);
    const [eventUpdateID, setEventUpdateID] = useState(null)

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
    const [profData, setProfData] = useState([]);
    const [profSlotData, setProfSlotData] = useState([]);
    const [slotOptions, setSlotOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [formData, setFormData] = useState([])
    const [bulkSelect, setBulkSelect] = useState(false);
    const [success, setSuccess] = useState(null);
    const [schedule, setSchedule] = useState([])
    const scheduleOptions =  [
        {value:"All", label:"All Days"},
        {value:"Weekdays", label:"Weekdays"},
        {value:"Weekend", label:"Weekend"},
        // {value:"Days", label:"Days Of Week"}
        { value: 'Monday', label: 'All Monday' },
        { value: 'Tuesday', label: 'All Tuesday' },
        { value: 'Wednesday', label: 'All Wednesday' },
        { value: 'Thursday', label: 'All Thursday' },
        { value: 'Friday', label: 'All Friday' },
        { value: 'Saturday', label: 'All Saturday' },
        { value: 'Sunday', label: 'All Sunday' }
    ]
    const history = useHistory();
    const localizer = momentLocalizer(moment);
    const todayDate = new Date();

    const [show, setShow] = useState(false);
    const [addPopup, setAddPopup] = useState(false)

    const [showSlots, setShowSlots] = useState({
        date:"",
        bulk:false,
        scheduleOption:[],
        show:false
    });

    // For Available data of professional
    const [facData, setFacData] = useState([]);
    const [slotData, setSlotData] = useState([]);
    const [fetchSlot, setFetchSlot] = useState(false);
    const [calendarData, setCalendarData] = useState([]);
    const [slotID, setSlotID] = useState({slot_ids: []});
    // const [showSlots, setShowSlots] = useState({
    //     date:"",
    //     show:false,
    //     slots:[]
    // });
    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());
    const [eventData, setEventData] = useState(null)
    const [hourData, setHourData] = useState(null)
    const [createdSlotData, setCreatedSlotData] = useState([])
    const [createdHourData, setCreatedHourData] = useState([])
    const [requestedHours, setRequestedHours] = useState([])
    const [contractHours, setContractHours] = useState([])

    const[viewPopupID, setViewPopupID] = useState(null)
    const[viewType, setViewType] = useState(null)
    const[viewCount, setViewCount] = useState(null)

  const { token } = theme.useToken();
  const wrapperStyle = {
    width: '100%',
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG
  };


   const [eventForm, setEventForm] = useState({
        user:"",
        professional:"",
        title:"",
        date: "",
        description:""
    })

    const [hourForm, setHourForm] = useState({
        user:"",
        professional:"",
        date: "",
        hours: "",
        status:""
    })

    const [hourForms, setHourForms] = useState([]);
    

    const handleCancelEvent = () =>{
        setEventForm({
            user:profData.data.user,
            professional:profData.data.id,
            title:"",
            date:showSlots.date ? format(showSlots.date, 'yyyy-MM-dd') : "",
            description:""
        })
    }

    const handleCancelHours = () => {
        setStartDate(null)
        setEndDate(null)
        setSelectedSchedule([])
        setSchedule([])
        setSelectedSlots([])
        setHourForm({
            user:"",
            professional:"",
            date: "",
            hour: "",
            status:""
        })
        setBulkSelect(false)
    }
  const convertTo12HourFormat = (time24) => {
    const [hours, minutes] = time24.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutesFormatted = minutes.padStart(2, '0');
    return `${hours12}:${minutesFormatted} ${period}`;
  };

  const handleSlotSelection = (slot) => {
    console.log("handleSlotSelection",slot)
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
            console.log("Enters if case")
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
            const eventExists = eventDetails.some(item => item.date === start && item.event === "Available");
            console.log("eventExists",eventExists)
            console.log("Enters else case")
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
    }else{
        setError("Please select atleast one slot")
    }
};


const saveMultiHours = () => {
    if (bulkSelect) {
        for (const calendar of calendarDates) {
            for (const day of calendar.days) {
                setHourForms(prevForms => [
                    ...prevForms,
                    {
                        user: profData.data.user,
                        professional: profData.data.id,
                        date: format(day,'yyyy-MM-dd'),
                        hours: hourForm.hours,
                        status: "Available"
                    }
                ]);
                

            }
        }
    }else{
        setHourForms([])
    }
}


useEffect(()=>{
    if(hourForm.hours){
        saveMultiHours()
    }
},[hourForm])


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
            const encoded = btoa(JSON.stringify(response.data.data.Discipline));
            localStorage.setItem("currentDiscipline", encoded);
        })
        .catch((err) => {
            console.error('Error:', err);
        });
    }, [email]);


    const fetchProfSlotList = async () => {
        await axios.get( `${API_BASE_URL}/professional/GetProfSlot/?ProfUserID=${ProfID}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN,
        }
        })
        .then((response) => {
        setProfSlotData(response.data.data);
        setFacData(response.data.data);
        const extractedSlotIds = response.data.data ? response.data.data.map(slot => slot.slot) : [];
        setSlotID({ slot_ids: extractedSlotIds });
        setFetchSlot(true)
        })
        .catch((err) => {
        console.error('Error fetching facility data:', err)
        });
    }  
    useEffect(() => {
        fetchProfSlotList();
    }, [ProfID, AUTH_TOKEN]);


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
        setSlotData(response.data.data);
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

    const fetchProfSlots = async () => {
        try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/professional/GetProfSlot/?ProfUserID=${ProfID}`, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN,
            },
        });
            if (response.status === 200){
                console.log("response",response)
                setCreatedSlotData(response.data.data)
            }
        } catch (err) {
            console.error("Error fetching slots:", err);
        } finally {
        setIsLoading(false);
        }
    };

    const fetchHours = async () => {
        try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/professional/GetHourSlots/?ProfID=${ProfID}`, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN,
            },
        });
            if (response.status === 200){
                console.log("response",response)
                setCreatedHourData(response.data.data)
            }
        } catch (err) {
            console.error("Error fetching hours:", err);
        } finally {
        setIsLoading(false);
        }
    };


    const fetchRequstedHours = async () => {
        try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/professional/GetRequestedHours/?ProfID=${currentUserID}`, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN,
            },
        });
            if (response.status === 200){
                console.log("RequestedHours",response.data)
                setRequestedHours(response.data.data)
            }
        } catch (err) {
            console.error("Error fetching requested Hours:", err);
        } finally {
        setIsLoading(false);
        }
    }

    const fetchContractHours = async () => {
        try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/professional/GetContractHours/?ProfID=${currentUserID}`, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN,
            },
        });
            if (response.status === 200){
                console.log("GetContractHours",response.data)
                setContractHours(response.data.data)
            }
        } catch (err) {
            console.error("Error fetching contract hours:", err);
        } finally {
        setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchSlots();
        fetchProfSlots();
        fetchHours();
        fetchRequstedHours();
        fetchContractHours();
    }, [AUTH_TOKEN]);

    const handleAdd   = () => history.push('/professional/addshift')
    const handleClose = () => setShowCal(false);
    const handleShow  = () => setShowCal(true);
    const handleYes   = () => setAddPopup(true)

    const handleViewClose  = () => setShowViewPage(false);
    const handleEventClose = () => {
        setShowEvent(false);
        setEventUpdateID(null)
        setEventForm({
            user:"",
            professional:"",
            title:"",
            date:"",
            description:""
        })
    } 
        

    const handleNo = () => {
        setShowCal(false);
        setAddPopup(false);
        setFormData([])
        setStartDate(null)
        setEndDate(null)
        setSelectedSchedule([])
        setSchedule([])
        setSelectedSlots([])
        setScheduleVisible(false)
        setShowCalender(false)
        setEventDetails([])
        setShowSlots({
            date:"",
            bulk:false,
            scheduleOption:[],
            show:false
        });
    }
    
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
    
    // Handle start and end dates
    const handleStartDate = (date) => {
        setError(null)
        if(date){
            if (date.getTime() <= todayDate.getTime()){
                setError("Start date must be a future date. Please select a date after today.")
            }else{
                setStartDate(date)
            }
        }
        
    };

    const handleEndDate = (date) => { 
        setError(null)
        if(date){
            if (date.getTime() <= todayDate.getTime()){
                setError("End date must be a future date. Please select a date after today.")
            }else{
                setEndDate(date); 
            };
        }
    }
        
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
    
                    if (Math.abs(diffDays) <= 90) {
                        setScheduleVisible(true);
                    } else {
                        setScheduleVisible(false);
                    }
    
                    if (Math.abs(diffDays) > 90) {
                        setError("Invalid date range, must be between 3 months");
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
                    setShowCal(true)
                }else{
                    if (selectedSchedule.length >= 2){
                        setShowCalender(true)
                        setShowCal(true)
                    }else{
                        setShowCalender(false)
                        setShowCal(false)
                    }
                }
                setBulkSelect(true)
                setShowSlots({...showSlots, show:true, bulk:true, scheduleOption:selectedSchedule})
            }else{
                setBulkSelect(false)
                setShowSlots({...showSlots, show:false, bulk:false, scheduleOption:[]})
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
    
    
        const handleSelectSlot = ({ start }) => {
            setSuccess(null)
            setShowCal(!showCal)
            const slotDate = format(start,'MM-dd-yyyy')
            
            const selectedSlotData = createdSlotData.filter(slot => slot.date == slotDate);
            const slotIds = selectedSlotData.map(entry => entry.slot);
            const selectedSlotOptions = slotOptions.filter(option => slotIds.includes(option.value));
            selectedSlotOptions ? setSelectedSlots(selectedSlotOptions) : setSelectedSlots([])

            setShowSlots({...showSlots, show:true,bulk:false, date:start.toLocaleDateString()})
            setEventForm({...eventForm, date:start ? format(start,'yyyy-MM-dd'):"",professional:profData.data.id,user:profData.data.user})

            const hourData = createdHourData.find(hour => hour.date === format(start,'yyyy-MM-dd'))
            if (hourData){
                setHourForm({...hourForm,date:convertToUS(hourData.date,'Date'),professional:hourData.professional,user:hourData.user,status:hourData.status,hours:hourData.hours })
            }else{
                setHourForm({...hourForm,date:start ? convertToUS(start,'Date'):"",professional:profData.data.id,user:profData.data.user,status:"Available", hours:"" })
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
                    setEventDetails([])
                    setSuccess("Shifts Created Successfully")
                    setShowCal(false)
                    fetchProfSlotList()
                    setSelectedSlots([])
                    fetchSlots();
                    fetchProfSlots();
                    fetchHours();
                    fetchRequstedHours();
                    fetchContractHours();
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

        const handleEvents = async () => {
            setIsLoading(true)
            setError(null)
            setSuccess(null)

            let url = `${API_BASE_URL}/professional/events/`;
            let method = "POST";
            
            //for update
            if (eventUpdateID) {
                url = `${API_BASE_URL}/professional/events/${eventUpdateID}/`;
                method = "PATCH";
            }
            
            try {    
                const response = await axios({
                    method: method,
                    url: url,
                    data: eventForm,
                    headers: { 
                        "Content-Type": "application/json",
                        'Authorization': AUTH_TOKEN
                    }
                });
                if(response.data){
                    setError(null)
                    setSuccess( method === "POST" ? "Event Created Successfully" : "Event Updated Successfully")
                    setShowCal(false)
                    setShowEvent(false)
                    getEventList()
                    setView('month');
                    if(method === "POST"){
                        handleCancelEvent()
                    }
                }
            } catch (err) {
                console.error('Error:', err);
                setSuccess(null)
                setError('An error occurred while submitting the form.');
            } finally {
                setIsLoading(false);
            }
        }

        const deleteEvent = async() => {
            setError(null);
            setSuccess(null);
            setDeleteLoading(true)
            try {
                await axios.delete(`${API_BASE_URL}/professional/events/${eventUpdateID}/`,{
                    headers: { 
                        "Content-Type": "application/json",
                        'Authorization': AUTH_TOKEN
                    },
                });
                setEventData(eventData.filter((event) => event.id !== eventUpdateID));
                setSuccess("Event deleted successfully")
                handleEventClose()
                setView('month');
            } catch (err) {
                console.log("Event delete err", err)
                setError("Error deleting event......");
            }finally{
                setDeleteLoading(false)
            }
        }

        const handleHours = async () => {
            setIsLoading(true)
            setError(null)
            setSuccess(null)

            let data = hourForm
            if (bulkSelect){
                data = hourForms
            }

            try {    
                const response = await axios.post(`${API_BASE_URL}/professional/CreateProfSlot/`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': AUTH_TOKEN
                    }
                });
                if(response.data){
                    setError(null)
                    setSuccess("Hours Created Successfully")
                    setShowCal(false)
                    getHoursList()
                    fetchHours()
                    handleCancelHours()
                }
            } catch (err) {
                console.error('Error:', err);
                setSuccess(null)
                setError('An error occurred while submitting the form.');
            } finally {
                setIsLoading(false);
            }
        }
    
        useEffect(() => {
            if(addPopup){
                handleSubmit();
            }
        }, [addPopup]);
  
    // useEffect(() => {
    //   if (fetchSlot) {
    //     axios
    //       .post(`${API_BASE_URL}/GetSlot/`, slotID, {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'Authorization': AUTH_TOKEN
    //         }
    //       })
    //       .then((response) => {
    //         setSlotData(response.data.data);
    //       })
    //       .catch((err) => {
    //         console.error('Error fetching slot data:', err);
    //         setError(err.response.data.Result)
    //       });
    //   }
    // }, [fetchSlot]);


    useEffect(() => {
        const mergedCalendarEvents = [];
    
        const groupedEvents = facData.reduce((acc, slotInfo) => {
            const slotDetails = slotData.find(slot => slot.id === slotInfo.slot);
            if (!slotDetails) return acc;
    
            const dateKey = slotInfo.date;
            if (!acc[dateKey]) acc[dateKey] = [];
    
            acc[dateKey].push({
                ...slotInfo,
                startTime: convertTo12HourFormat(slotDetails.start_hr),
                endTime: convertTo12HourFormat(slotDetails.end_hr),
            });
    
            return acc;
        }, {});

        const requestEvents = requestedHours.reduce((acc, slotInfo) => {
            const slotDetails = slotData.find(slot => slot.id === slotInfo.slot);
            if (!slotDetails) return acc;
    
            const dateKey = slotInfo.date;
            if (!acc[dateKey]) acc[dateKey] = [];
    
            acc[dateKey].push({
                ...slotInfo,
                startTime: convertTo12HourFormat(slotDetails.start_hr),
                endTime: convertTo12HourFormat(slotDetails.end_hr),
            });
    
            return acc;
        }, {});

        console.log("requestEvents",requestEvents)

        const contractEvents = contractHours.reduce((acc, slotInfo) => {
            const slotDetails = slotData.find(slot => slot.id === slotInfo.slot);
            if (!slotDetails) return acc;
    
            const dateKey = slotInfo.date;
            if (!acc[dateKey]) acc[dateKey] = [];
    
            acc[dateKey].push({
                ...slotInfo,
                startTime: convertTo12HourFormat(slotDetails.start_hr),
                endTime: convertTo12HourFormat(slotDetails.end_hr),
            });
    
            return acc;
        }, {});

        console.log("contractEvents",contractEvents)
    
        Object.entries(groupedEvents).forEach(([date, slots]) => {
            slots.sort((a, b) => new Date(`${date} ${a.startTime}`) - new Date(`${date} ${b.startTime}`));
    
            let mergedSlots = [];
            let currentSlot = { ...slots[0], count: 1 };
    
            for (let i = 1; i < slots.length; i++) {
                if (currentSlot.endTime === slots[i].startTime) {
                    currentSlot.endTime = slots[i].endTime;
                    currentSlot.count += 1;
                } else {
                    mergedSlots.push({ ...currentSlot });
                    currentSlot = { ...slots[i], count: 1 };
                }
            }
            mergedSlots.push({ ...currentSlot });
    
            mergedSlots.forEach(slot => {
                let title = `${slot.facility ? slot.facility.fac_first_name : ""} ${slot.status} (${slot.count} ${slot.count <= 1 ? "Hr" : "Hrs"})`;
                mergedCalendarEvents.push({
                    title,
                    start: new Date(`${date} ${slot.startTime}`),
                    end: new Date(`${date} ${slot.endTime}`),
                    slot: `${slot.startTime} - ${slot.endTime}`,
                    allDay: false,
                    id: slot.slot,
                    type:"Available slot"
                });
            });
        });

        Object.entries(contractEvents).forEach(([date, slots]) => {
            slots.sort((a, b) => new Date(`${date} ${a.startTime}`) - new Date(`${date} ${b.startTime}`));
    
            let contractSlots = [];
            let currentSlot = { ...slots[0], count: 1 };
    
            for (let i = 1; i < slots.length; i++) {
                if (currentSlot.endTime === slots[i].startTime) {
                    currentSlot.endTime = slots[i].endTime;
                    currentSlot.count += 1;
                } else {
                    contractSlots.push({ ...currentSlot });
                    currentSlot = { ...slots[i], count: 1 };
                }
            }
            contractSlots.push({ ...currentSlot });

            console.log("contractSlots", contractSlots)
    
            contractSlots.forEach(slot => {
                let title = `Contract created with ${slot.facility_data ? slot.facility_data.fac_first_name : ""} for (${slot.count} ${slot.count <= 1 ? "Hr" : "Hrs"})`;
                mergedCalendarEvents.push({
                    title,
                    start: new Date(`${date} ${slot.startTime}`),
                    end: new Date(`${date} ${slot.endTime}`),
                    slot: `${slot.startTime} - ${slot.endTime}`,
                    allDay: false,
                    slot_id: slot.slot,
                    id:slot.id,
                    type:"Contract",
                    count:slot.count,
                    color:shiftColor.find(color => color.label === "Contract").value
                });
            });
        });


        Object.entries(requestEvents).forEach(([date, slots]) => {
            slots.sort((a, b) => new Date(`${date} ${a.startTime}`) - new Date(`${date} ${b.startTime}`));
    
            let requestSlots = [];
            let currentSlot = { ...slots[0], count: 1 };
    
            for (let i = 1; i < slots.length; i++) {
                if (currentSlot.endTime === slots[i].startTime) {
                    currentSlot.endTime = slots[i].endTime;
                    currentSlot.count += 1;
                } else {
                    requestSlots.push({ ...currentSlot });
                    currentSlot = { ...slots[i], count: 1 };
                }
            }
            requestSlots.push({ ...currentSlot });
            
            console.log("requestSlots", requestSlots)

            requestSlots.forEach(slot => {
                let title = `Request Pending from ${slot.facility_data ? slot.facility_data.fac_first_name : ""} (${slot.count} ${slot.count <= 1 ? "Hr" : "Hrs"})`;
                mergedCalendarEvents.push({
                    title,
                    start: new Date(`${date} ${slot.startTime}`),
                    end: new Date(`${date} ${slot.endTime}`),
                    slot: `${slot.startTime} - ${slot.endTime}`,
                    allDay: false,
                    slot_id: slot.slot,
                    id:slot.id,
                    type:"Job Request",
                    count:slot.count,
                    color:shiftColor.find(color => color.label === "Request").value
                });
            });
        });
    
        if (eventData) {
            eventData.forEach(event => {
                mergedCalendarEvents.push({
                    title: `${event.title} - ${event.description}`,
                    start: new Date(`${event.date}`),
                    end: new Date(`${event.date}`),
                    allDay: true,
                    type:"User Event",
                    data: event
                });
            });
        }
    
        if (hourData) {
            hourData.forEach(event => {
                mergedCalendarEvents.push({
                    title: `${event.status} for any of ${event.hours} ${event.hours === 1 ? "hour" : "hours"}`,
                    start: new Date(`${event.date}`),
                    end: new Date(`${event.date}`),
                    type: "Hour slots",
                    allDay: true,
                    data : event
                });
            });
        }
    
        setCalendarData(mergedCalendarEvents);
    }, [facData, slotData, eventData, hourData, contractHours, requestedHours]);
    


    const getEventList = async() => {
        await axios.get( `${API_BASE_URL}/professional/events/?ProfID=${currentUserID}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN,
        }
        })
        .then((response) => {
        setEventData(response.data);
        })
        .catch((err) => {
        console.error('Error fetching event data:', err)
        });
    }

    const getHoursList = async() => {
        await axios.get( `${API_BASE_URL}/professional/GetHourSlots/?ProfID=${ProfID}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN,
        }
        })
        .then((response) => {
            setHourData(response.data.data);
        })
        .catch((err) => {
        console.error('Error fetching hour data:', err)
        });
    }

    useEffect(() => {
        getEventList();
        getHoursList();
      }, []);


  const handleSelectEvent = (event) => {
    console.log("event",event)
    setDate(event.start); 
    setView('day');

    if (view === "day") {
        if (event.type === "Contract" || event.type === "Job Request"){
            setViewType(event.type)
            setViewCount(event.count)
            setViewPopupID(event.id)
            setShowViewPage(true)
        }else if(event.type === "User Event"){
            setShowEvent(true)
            setEventForm({...eventForm, user:event.data.user, professional:event.data.professional, title:event.data.title, date:event.data.date, description:event.data.description})
            setEventUpdateID(event.data.id)
        }
    }
  };

  const handlePropGetter = (event) => {
    const backgroundColor = event.color ? event.color : 'defaultColor';
    const border = event.color ? event.color : 'defaultColor';
    return { style: { backgroundColor, border } };
  }
    

console.log("profData",profData)
console.log("showSlots",showSlots)
console.log("eventForm",eventForm)
console.log("eventData",eventData)
console.log("hourForm",hourForm)
console.log("hourData",hourData)
console.log("calendarData",calendarData)
console.log("createdSlotData",createdSlotData)
console.log("formData",formData)
console.log("selectedSlots",selectedSlots)
console.log("hourForms",hourForms)
console.log("eventDetails",eventDetails)
console.log("selectedSchedule",selectedSchedule)
console.log("requestedHours",requestedHours)
console.log("contractHours",contractHours)
console.log("facData",facData)
console.log("createdHourData",createdHourData)
return (
    <div>
      <SiteHeader {...props} />
      <>
        {/* Breadcrumb */}
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
                    {/* <li className="breadcrumb-item active">
                        <Link to="/professional/myprofile">Profile</Link>
                    </li> */}
                  </ol>
                  <h2 className="breadcrumb-title">My Shifts</h2>
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

      {/* Page Content */}
      <div className="content pt-0">
        <div className="container-fluid">
         {/* <ProfessionalNav/> */}
          <div className="row">
            <div className="col-lg-12 col-xl-12">
            <div className="card border-0">
                <div className="card-body">
                    <div className="tab-content appointment-tab-content">
                        {error ? (
                            <div className="alert alert-danger alert-dismissible fade show mb-1" role="alert">
                                {error}
                            </div>
                        ) : ''}
                        {success ? (
                            <div className="alert alert-success alert-dismissible fade show mb-1" role="alert">
                                {success}
                            </div>
                        ) : ''}
                        {showWorkHours
                        ?
                        <WorkHours ID={ProfID} Role={'ProfessionalSlots'} View={'AdminStyle'}/>
                        :
                        <fieldset style={{display:'block'}} className="mt-4">
                            <div className="card booking-card mb-0">
                                <div className="card-body booking-body">
                                    <div className="row mb-2">
                                        <div className="col-3 mb-2" style={{ position: 'relative' }}>
                                            <label className="form-label">Start Date:</label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={handleStartDate}
                                                placeholderText="MM:DD:YYY"
                                                className="form-control datepicker"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                                }}
                                            />
                                        </div>
                                        <div className="col-3 mb-2" style={{ position: 'relative' }}>
                                            <label className="form-label">End Date:</label>
                                            <DatePicker
                                                selected={endDate}
                                                onChange={handleEndDate}
                                                placeholderText="MM:DD:YYY"
                                                className="form-control datepicker"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                                }}
                                            />
                                        </div>
                                        {scheduleVisible && (
                                        <div className="col-3 mb-2">
                                            <label className="form-label">Schedule:</label>
                                                <Select
                                                    className="select"
                                                    options={scheduleOptions}
                                                    value={schedule}
                                                    onChange={handleScheduleChange}
                                                    placeholder="Select"
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    menuPortalTarget={document.body}
                                                    styles={{
                                                      menuPortal: base => ({ ...base, zIndex: 9999 })
                                                    }}
                                                />
                                        </div>)}
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12 mb-2">
                                            <BigCalendar
                                                localizer={localizer}
                                                events={calendarData}
                                                startAccessor="start"
                                                endAccessor="end"
                                                style={{ height:600,border:"2px solid #e6e7e8", padding:"10px",borderRadius:"7px"}}
                                                views={['month','week','day']}
                                                selectable={true}
                                                date={date}
                                                view={view}           
                                                onView={setView}      
                                                onNavigate={setDate}  
                                                onSelectEvent={handleSelectEvent}
                                                onSelectSlot={handleSelectSlot}
                                                eventPropGetter={handlePropGetter}
                                            />
                                        </div>        
                                    </div>
                                </div>
                            </div>
                        </fieldset>}
                    </div>                
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <ShiftPopup title={"Shifts"} close={handleClose} show={showCal} yes={handleYes} no={handleNo} showSlots={showSlots} saveSelectedEvent={saveSelectedEvent} selectedSlots={selectedSlots} slotOptions={slotOptions}  handleSlotSelection={handleSlotSelection} eventDetails={eventDetails} handleDeleteSlot={handleDeleteSlot} isLoading={isLoading} eventForm={eventForm} setEventForm={setEventForm} handleEvents={handleEvents} hourForm={hourForm} setHourForm={setHourForm} handleHours={handleHours}/>
      <CalendarPopup title={"View page"} show={showViewPage} cancel={handleViewClose} close={handleViewClose} type={viewType} recordID={viewPopupID} contractHours={contractHours} requestedHours={requestedHours} viewCount={viewCount}/>
      <EventPopup title={"Update Event"} close={handleEventClose} show={showEvent} cancel={handleEventClose} eventDetails={eventDetails} isLoading={isLoading} eventForm={eventForm} setEventForm={setEventForm} handleEvents={handleEvents} deleteEvent={deleteEvent} deleteLoading={deleteLoading}/>
      {/* /Page Content */}
      <SiteFooter {...props} />
    </div>
  );
};

export default ProfCalendar;
