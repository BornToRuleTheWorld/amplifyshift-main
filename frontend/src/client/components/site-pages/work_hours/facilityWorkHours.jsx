import React, { useState, useEffect } from "react";
import axios from "axios";
import {AUTH_TOKEN, API_BASE_URL, ColourOption, SingleValue, MultiValueLabel, shiftColor } from '../config';
import {convertTo12HourFormat, convertToUS} from "../utils"
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import Select from "react-select";
import CalendarPopup from "../calendarPopup";
import { FaTimesCircle, FaEye, FaSearch, FaHourglassHalf, FaPlusCircle, FaPen, FaPlus } from "react-icons/fa";
import { getCurrentUserDiscipline } from "../utils.js";
import { Link, useHistory } from "react-router-dom";

const FacilityHourCalender = ({ID, Role}) => {
    const history = useHistory();
    const disciplineOptions = getCurrentUserDiscipline();

    const [hour, setHour] = useState(1)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [facData, setFacData] = useState([]);
    const [jobWorkHours, setJobWorkHours] = useState([]);
    const [jobHours, setJobHours] = useState([])
    const [contractHours, setContractHours] = useState([]);
    const [slotData, setSlotData] = useState([]);
    const [fetchSlot, setFetchSlot] = useState(false);
    const [calendarData, setCalendarData] = useState([]);
    const [slotID, setSlotID] = useState({slot_ids: []});
    const [showSlots, setShowSlots] = useState({
      date:"",
      show:false,
      slots:[]
    });
    const localizer = momentLocalizer(moment);
    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());
    const [srchDiscipline, setSrchDiscipline] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const[viewPopupID, setViewPopupID] = useState(null)
    const[viewType, setViewType] = useState(null)
    const[viewCount, setViewCount] = useState(null)
    const [showViewPage, setShowViewPage] = useState(false);
    const [requestHours, setRequestHours] = useState([])
    
    const handleViewClose  = () => setShowViewPage(false);

    const FacilityHours = async() => {

        const data = {
            FacID : ID,
            Discipline : srchDiscipline
        }
        await axios.post(`${API_BASE_URL}/facility/FacilityHours/`,data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN,
          }
        })
        .then((response) => {
          console.log("response",response.data)
          setJobWorkHours(response.data.job_hours_data)
          setContractHours(response.data.contract_hours_data);
          setJobHours(response.data.job_hours)
          const jobSlotIds = response.data.job_hours_data ? response.data.job_hours_data.map(slot => slot.slot) : [];
          const contractSlotIds = response.data.contract_hours_data ? response.data.contract_hours_data.map(slot => slot.slot) : [];
          const combinedSlotIds = [...jobSlotIds, ...contractSlotIds];
          setSlotID({ slot_ids: combinedSlotIds });
          fetchRequestHours();
          setFetchSlot(true);
        })
        .catch((err) => {
          console.error('Error fetching facility data:', err);
          setError(err.response.data.Result)
        })
        .finally(() => {
            setIsLoading(false)
        });
    }

    const fetchRequestHours = async() => {
      const data = {
        FacID : ID,
        Discipline : srchDiscipline
      }
      try {
        const response = await axios.post(`${API_BASE_URL}/job_request/GetRequestHours/`,data,{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
          }
      });
      setRequestHours(response.data.data)
      const requestedSlotIds = response.data.data ? response.data.data.map(slot => slot.slot) : []
      setSlotID(prevState => {
        const mergedSlotIds = new Set([...prevState.slot_ids, ...requestedSlotIds]);
        return { slot_ids: Array.from(mergedSlotIds) };
      });
      } catch (err) {
        console.log("request error",err)
      }
    }
    
    const FetchSlots = async() => {
      await axios.get(`${API_BASE_URL}/GetSlots/`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN
      }
      })
      .then((response) => {
      setSlotData(response.data.data);
      })
      .catch((err) => {
      console.error('Error fetching slot data:', err);
      setError(err.response.data.Result)
      });
    }

    const handleSearchSubmit = async(e) => {
      e.preventDefault();
      setIsLoading(true)
      FacilityHours();
      fetchRequestHours();
    }

    useEffect(() => {
      FacilityHours();
      fetchRequestHours();
      FetchSlots();
    }, [ID, AUTH_TOKEN]);
  
    // useEffect(() => {
    //   if (fetchSlot) {
    //     FetchSlots();
    //   }
    // }, [fetchSlot]);


    useEffect(() => {

        const mergedCalendarEvents = []

        const jobWorkHoursEvents = jobWorkHours.reduce((acc, slotInfo) => {
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

        const contractHoursEvents = contractHours.reduce((acc, slotInfo) => {
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

        const requestedHoursEvents = requestHours.reduce((acc, slotInfo) => {
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

        console.log("requestedHoursEvents",requestedHoursEvents)

        Object.entries(jobWorkHoursEvents).flatMap(([date, slots]) => {
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

            return mergedSlots.map(slot => {

                let disp_value = slot?.job_data?.discipline ? disciplineOptions.find(option => option.value === slot.job_data.discipline)?.label || "" : "N/A"
                let title = `${slot.job_data.status} ${disp_value} (${slot.count} ${(slot.count <= 1)?"Hr":"Hrs"})`;
                mergedCalendarEvents.push({
                    title,
                    start: new Date(`${date} ${slot.startTime}`),
                    end: new Date(`${date} ${slot.endTime}`),
                    slot: `${slot.startTime} - ${slot.endTime}`,
                    allDay: false,
                    slot_id: slot.slot,
                    id:slot.id,
                    type:"Job Work Hours",
                    count:slot.count
                });
            });
        });

        console.log("jobWorkHoursEvents",jobWorkHoursEvents)

        Object.entries(contractHoursEvents).forEach(([date, slots]) => {
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
    
            contractSlots.forEach(slot => {
                let disp_value = slot.job_data.discipline ? disciplineOptions.find(option => option.value == slot.job_data.discipline)?.label : "N/A"
                let title = `Contract created with ${slot.professional ? slot.professional.prof_first_name : ""} for ${disp_value} (${slot.count} ${slot.count <= 1 ? "Hr" : "Hrs"})`;
                mergedCalendarEvents.push({
                    title,
                    start: new Date(`${date} ${slot.startTime}`),
                    end: new Date(`${date} ${slot.endTime}`),
                    slot: `${slot.startTime} - ${slot.endTime}`,
                    allDay: false,
                    slot_id: slot.slot,
                    id:slot.contract,
                    type:"Contract",
                    count:slot.count,
                    color : shiftColor.find(color => color.label === "Contract").value
                });
            });
        });

        Object.entries(requestedHoursEvents).forEach(([date, slots]) => {
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
    
            requestSlots.forEach(slot => {
              const disp_value = slot.job_data?.discipline
                  ? disciplineOptions.find(option => option.value === slot.job_data.discipline)?.label
                  : "N/A";

              if (slot.job_request_data && slot.job_request_data.length > 0) {
                  slot.job_request_data.forEach(request => {
                      const profName = `${request.professional_data?.prof_first_name} ${request.professional_data?.prof_first_name}`|| "Unknown";

                      const title = `Request sent with ${profName} for ${disp_value} (${slot.count} ${slot.count <= 1 ? "Hr" : "Hrs"})`;

                      mergedCalendarEvents.push({
                          title,
                          start: new Date(`${date} ${slot.startTime}`),
                          end: new Date(`${date} ${slot.endTime}`),
                          slot: `${slot.startTime} - ${slot.endTime}`,
                          allDay: false,
                          slot_id: slot.slot,
                          id: slot.id,
                          type: "Job Request",
                          count: slot.count,
                          color : shiftColor.find(color => color.label === "Request").value
                      });
                  });
              } else {
                  const title = `Request sent for ${disp_value} (${slot.count} ${slot.count <= 1 ? "Hr" : "Hrs"})`;
                  mergedCalendarEvents.push({
                      title,
                      start: new Date(`${date} ${slot.startTime}`),
                      end: new Date(`${date} ${slot.endTime}`),
                      slot: `${slot.startTime} - ${slot.endTime}`,
                      allDay: false,
                      slot_id: slot.slot,
                      id: slot.id,
                      type: "Job Request",
                      count: slot.count,
                      color : shiftColor.find(color => color.label === "Request").value
                  });
              }
          });

        });

        if (jobHours) {
          jobHours.forEach(event => {
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
    }, [facData, slotData, jobWorkHours, contractHours, jobHours]);



    const handleSelectSlot = ({ start }) => {
      const selectedDate = convertToUS(start,"Date");
    
      const matchingSlots = calendarData.filter(event => {
        const eventDate = convertToUS(event.start,"Date");
        return eventDate === selectedDate;
      });
    
      const slotsWithDetails = matchingSlots.map((event) => {
        const slotDetails = slotData.find(slot => slot.id === event.id);
        if (slotDetails) {
          const formattedSlot = {
            ...event,
            slot: `${convertTo12HourFormat(slotDetails.start_hr)} - ${convertTo12HourFormat(slotDetails.end_hr)}`
          };
          return formattedSlot;
        }
        return null;
      }).filter(event => event !== null);
    
      if (slotsWithDetails.length > 0) {
        setShowSlots({
          ...showSlots,
          show: true,
          date: selectedDate,
          slots: slotsWithDetails
        });
      } else {
        setShowSlots({
          ...showSlots,
          show: false,
          date: selectedDate,
          slots: []
        });
      }
    };


    const handleSelectEvent = (event) => {
        setDate(event.start); 
        setView('day');

        if (view === "day"){
            setViewType(event.type)
            setViewCount(event.count)
            setViewPopupID(event.id)
            setShowViewPage(true)
        }
    };
    
    const handleAdd = () => history.push('/facility/addjob')

    const handlePropGetter = (event) => {
      const backgroundColor = event.color ? event.color : 'defaultColor';
      const border = event.color ? event.color : 'defaultColor';
      return { style: { backgroundColor, border } };
    }

    if (!facData || !slotData) {
        return <div>Loading...</div>;
    }

    console.log("jobWorkHours",jobWorkHours)
    console.log("contractHours",contractHours)
    console.log("calendarData",calendarData)
    console.log("requestHours",requestHours)
    return (
        <div className="row">
            <div className="tab-content appointment-tab-content">
                <div
                    className="tab-pane fade show active"
                    id="pills-upcoming"
                    role="tabpanel"
                    aria-labelledby="pills-upcoming-tab"
                >
                <div className="row d-flex justify-content-between">
                  <div className="col-10">
                    <form onSubmit={handleSearchSubmit}>
                        <div className="row align-items-end my-2 px-2">
                            <div className="col-md-4 p-1">
                                <label className="form-label">Disciplines</label>
                                <Select
                                isMulti
                                name="srchDiscipline"
                                classNamePrefix="react-select"
                                placeholder="Select Disciplines"
                                value={disciplineOptions.filter(option => srchDiscipline.includes(option.value))}
                                options={disciplineOptions}
                                onChange={(selectedOptions) => {
                                    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                    setSrchDiscipline(values);
                                }}
                                isClearable={true}
                                components={{ Option: ColourOption, SingleValue, MultiValueLabel }}
                                styles={{
                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                    menu: base => ({ ...base, zIndex: 9999 })
                                }}
                                />
                            </div>

                            <div className="col-md-auto p-1 d-flex align-items-end">
                                <input
                                type="submit"
                                value= {isLoading ? "Submitting....." : "Submit"}
                                className="btn btn-primary text-white w-100"
                                />
                            </div>
                        </div>
                    </form>
                  </div>
                  <div className="col-auto">
                    <button className="btn btn-primary mt-5 mb-3" onClick={handleAdd}><FaPlus className="text-white bg-primary"/> Create Shifts </button>
                  </div>
                
                </div>

                <div className="row">
                  <div className="col">
                      <BigCalendar
                        localizer={localizer}
                        events={calendarData}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height:800,border:"1px solid grey", padding:"10px",borderRadius:"7px"}}
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
                {/* {showSlots.show ? (
                <div className="col-3">
                    <h4>Selected Shifts for {showSlots.date}</h4>
                    <div>
                        {showSlots.slots.length > 0 ? (
                        showSlots.slots.map((slot, index) => (
                            <ul key={index} className="p-2">
                                <li style={{fontSize:"17px"}}><i className="fa-solid fa-circle" />&nbsp;{slot.slot}</li>
                            </ul>
                        ))
                        ) : (
                        <div>No shifts available for this date</div>
                        )}
                    </div>
                </div>
                ) : null} */}
                </div>
              </div>
            </div>
            <CalendarPopup title={"View page"} show={showViewPage} cancel={handleViewClose} close={handleViewClose} type={viewType} recordID={viewPopupID} contractHours={contractHours} requestedHours={requestHours} jobHours={jobWorkHours} viewCount={viewCount} userType={"Facility"}/>
        </div>
    );
  }
  
  export default FacilityHourCalender;
  