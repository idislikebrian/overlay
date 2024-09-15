import React, { useState, useEffect } from 'react';

const Notification = ({ message, show }) => {
    return (
        <div className={`notification ${show ? 'show' : ''}`}>
            {message}
        </div>
    );
};

export default Notification;
