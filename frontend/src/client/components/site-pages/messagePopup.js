import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function MessagePopup({title, message, close, show, yes, no}) {

  return (
    <>
      <Modal show={show} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={yes}>
            Yes
          </Button>
          <Button variant="danger" onClick={no}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MessagePopup;