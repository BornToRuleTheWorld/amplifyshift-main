import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {FaTimesCircle} from 'react-icons/fa';
import { Tabs, Tab } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";

function EventPopup({title, deleteLoading, handleEvents, eventForm, setEventForm, isLoading, close, show, deleteEvent}) {
    const [activeTab, setActiveTab] = useState('event');
 
    return (
    <>
      <Modal show={show} onHide={close} dialogClassName="w-auto" centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
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
                <Button type="submit" variant="success" disabled={isLoading || deleteLoading}>
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
          <Button variant="primary" onClick={deleteEvent} disabled={deleteLoading || isLoading}> 
            {deleteLoading ?
            <> 
                <div class="spinner-border spinner-border-sm text-light col-1 mt-1" role="status">
                    <span class="sr-only">Deleting.....</span>
                </div>
                <span className="col text-light text-start p-1">Deleting.....</span>
            </>
                    
            : "Delete"}
          </Button>
        
          <Button variant="danger" onClick={close} disabled={deleteLoading || isLoading}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EventPopup;