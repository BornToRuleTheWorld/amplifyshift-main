import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {FaTimesCircle} from 'react-icons/fa';
import { Tabs, Tab } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { ShiftHoursOptions } from './config';

function ShiftPopup({title, showSlots, selectedSlots, saveSelectedEvent, slotOptions, handleSlotSelection, eventDetails, handleDeleteSlot, handleEvents, eventForm, setEventForm, hourForm, setHourForm, handleHours, isLoading, close, show, yes, no}) {
    const [activeTab, setActiveTab] = useState('shift');
 
  console.log("hourForm", hourForm)
  return (
    <>
      <Modal show={show} onHide={close} dialogClassName="w-auto" centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Tab eventKey="shifthours" title="Shift Hours">
                    {/* SHIFT HOURS FORM */}
                    <form onSubmit={(e) => { e.preventDefault(); handleHours(); }}>
                        <div className="row">
                            <div className='col-auto px-3'>
                                <div className="card booking-wizard-slots">
                                    <div className="card-body">
                                        <div className="book-title">
                                            <h6 className="fs-14 mb-4">Select Shift Hours for {showSlots?.date}</h6>
                                        </div>
                                        <div className="token-slot mt-2 mb-2">
                                            {ShiftHoursOptions.map((option, index) => (
                                                <div key={index} className="form-check-inline visits me-1">
                                                    <label className="visit-btns">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={hourForm ? hourForm.hours === option.value : null}
                                                            onChange={() => {
                                                                setHourForm(prev => ({
                                                                    ...prev,
                                                                    hours: prev?.hours === option.value ? null : option.value
                                                                }));
                                                            }}
                                                            disabled={selectedSlots.length === 0 ? false :true}
                                                        />
                                                        <span className="visit-rsn" style={{ minWidth: "130px" }}>{option.label}</span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {hourForm?.hours &&
                        <Button type="submit" variant="success" disabled={isLoading || selectedSlots.length > 0 ? true : false}>
                            {isLoading ?
                            <> 
                                <div class="spinner-border spinner-border-sm text-light col-1 mt-1" role="status">
                                    <span class="sr-only">Submitting.....</span>
                                </div>
                                <span className="col text-light text-start p-1">Submitting.....</span>
                            </>
                                
                        : "Submit Hours"}
                    </Button>
                    }
                    </form>
                </Tab>

            
                <Tab eventKey="shift" title="Shift Time">
                {/* SHIFT TIME FORM */}
                <div className="row mb-2">
                        <div className='col-auto px-3'>
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
                                            disabled = {hourForm?.hours ? true : false}
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
                        {eventDetails.length > 0 && (
                            <div className='col-auto px-3'>
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
                                            </div>
                                            ))}
                                        </div>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </div>    
                        )}
                    </div> 
                </Tab>

            <Tab eventKey="event" title="Event">
            {/* EVENT FORM */}
            <form onSubmit={(e) => { e.preventDefault(); handleEvents(); }}>
                <div className="mb-3">
                <label className="form-label">Event Title</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter event title"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    required
                />
                </div>
                {/* <div className="mb-3">
                <label className="form-label">Date</label>
                <DatePicker
                    selected={eventForm.date ? new Date(eventForm.date) : null}
                    onChange={(date) => {
                        const formattedDate = format(date, 'yyyy-MM-dd');
                        setEventForm({ ...eventForm, date: formattedDate });
                    }}
                    placeholderText="MM-DD-YYYY"
                    dateFormat="MM-dd-yyyy"
                    className="form-control"
                    />
                </div> */}
                <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                    className="form-control"
                    placeholder="Event description"
                    rows={3}
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    required
                ></textarea>
                </div>
                <Button type="submit" variant="success" disabled={isLoading}>
                {isLoading ?
                <> 
                    <div class="spinner-border spinner-border-sm text-light col-1 mt-1" role="status">
                        <span class="sr-only">Submitting.....</span>
                    </div>
                    <span className="col text-light text-start p-1">Submitting.....</span>
                </>
                    
            : "Submit Event"}
                </Button>
            </form>
            </Tab>
        </Tabs>

        </Modal.Body>
        <Modal.Footer>
        {eventDetails.length === 0 ? null :    
          <Button variant="primary" onClick={yes} disabled={isLoading}> 
            {isLoading ?
            <> 
                <div class="spinner-border spinner-border-sm text-light col-1 mt-1" role="status">
                    <span class="sr-only">Submitting.....</span>
                </div>
                <span className="col text-light text-start p-1">Submitting.....</span>
            </>
                    
            : "Submit"}
        </Button>
        }
          <Button variant="danger" onClick={no}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ShiftPopup;