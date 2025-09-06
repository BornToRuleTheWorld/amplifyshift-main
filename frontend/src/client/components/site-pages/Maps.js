import React from 'react';

const MapEmbed = ({ embedUrl }) => {
  return (
    <div className="col-12">
      <div className="contact-map d-flex">
        <iframe
          src={embedUrl}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-50"
          style={{ border: 0, width: '100%' }}
        ></iframe>
      </div>
    </div>
  );
};

export default MapEmbed;
