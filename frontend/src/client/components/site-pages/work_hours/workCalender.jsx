import React, { useState, useEffect } from "react";
import axios from "axios";
import {AUTH_TOKEN, API_BASE_URL, disciplineOptions, shiftColor} from '../config';
import {convertTo12HourFormat, convertToUS} from "../utils"
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const WorkHoursCalender = ({ID, Role}) => {
    
    const [hour, setHour] = useState(1)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [facData, setFacData] = useState([]);
    const [facHourData, setFacHourData] = useState([])
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

    var getUrl = ""
    
    if (Role === "Job"){
      getUrl = `${API_BASE_URL}/jobs/GetJobWorkHours/?JobID=${ID}&Type=All`
    }else if (Role === "ProfessionalSlots"){
      getUrl = `${API_BASE_URL}/professional/GetProfSlot/?ProfUserID=${ID}`
    }else{
      getUrl = `${API_BASE_URL}/contract/GetContractHours/?ConID=${ID}`
    }

    const fetch_data = () => {
      axios
        .get(getUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN,
          }
        })
        .then((response) => {
          console.log("Slot Response", response)
          setFacData(response.data.data);
          setFacHourData (response.data.data.filter(data => data.type === "Hour_slots"))
        })
        .catch((err) => {
          console.error('Error fetching facility data:', err);
          setError(err.response.data.Result)
        });
    }

    const fetch_slots = () => {
      axios
      .get(`${API_BASE_URL}/GetSlots/`, {
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

    useEffect(() => {
      fetch_data()
      fetch_slots()
    }, [ID, AUTH_TOKEN]);
  
    useEffect(() => {
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

    const mergedEvents = Object.entries(groupedEvents).flatMap(([date, slots]) => {
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
        let title;
        if (Role === "Facility") {
          let disp_value = slot.professional.Discipline.length > 0
          ? slot.professional.Discipline.map((disp, index) => {
              const option = disciplineOptions.find(option => option.value === disp);
              return option ? option.label : null;
            })
          : "N/A"
          title = `${slot.professional.prof_first_name} - ${disp_value} - ${slot.status} - (${slot.count} ${(slot.count <= 1)?"Hr":"Hrs"})`;
          
        } else if (Role === "ProfessionalSlots") {
          title = `${slot.facility ? slot.facility.fac_first_name : ""} ${slot.status} (${slot.count} ${(slot.count <= 1)?"Hr":"Hrs"})`;
        } else {
          title = `${slot.status} (${slot.count} ${(slot.count <= 1)?"Hr":"Hrs"})`;
        }

        return {
          title,
          start: new Date(`${date} ${slot.startTime}`),
          end: new Date(`${date} ${slot.endTime}`),
          slot: `${slot.startTime} - ${slot.endTime}`,
          allDay: false,
          id: slot.slot,
          color : Role === "Contract" ? shiftColor.find(color => color.label === "Contract").value : "defaultColor"
        };
      });
    });

    if(facHourData){
      facHourData.forEach(event => {
        mergedEvents.push({
            title: `${event.status} for any of ${event?.hours ? event.hours : "1 hour"} ${event?.hours ? event.hours === 1 ? "hour" : "hours" : null}`,
            start: new Date(`${event.date}`),
            end: new Date(`${event.date}`),
            type: "Hour slots",
            allDay: true,
            data : event
        });
    });
    }

      setCalendarData(mergedEvents);
    }, [facData, slotData]);



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
  };
  
    if (!facData || !slotData) {
      return <div>Loading...</div>;
    }

    console.log("facilityShift",facData)
    console.log("calendarData",calendarData)


  const handlePropGetter = (event) => {
    const backgroundColor = event.color ? event.color : 'defaultColor';
    const border = event.color ? event.color : 'defaultColor';
    return { style: { backgroundColor, border } };
  }
    return (
        <div className="row">
            <div className="tab-content appointment-tab-content">
                <div
                    className="tab-pane fade show active"
                    id="pills-upcoming"
                    role="tabpanel"
                    aria-labelledby="pills-upcoming-tab"
                >
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
        </div>
    );
  }
  
  export default WorkHoursCalender;
  