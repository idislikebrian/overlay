import React, { useState, useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import Notification from './Notification';

const ControlPad = () => {
  const [audioQueue, setAudioQueue] = useState([]); 
  const [showNotification, setShowNotification] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleFakePayment = async () => {
    const response = await fetch("/api/payment-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentId: "test123",
        userId: "userTest",
        textToSpeak: "5, 4, 3, 2, 1, 0",
      }),
    });

    const data = await response.json();

    if (data.success) {
      const base64Audio = `data:audio/mp3;base64,${data.audio}`;
      setAudioQueue((prevQueue) => [...prevQueue, base64Audio]);
    }
  };

  const handleShowNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000); // Hide after 3 seconds
  };

  const handleHideControlPad = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'z' || event.key === 'Z') {
        setIsVisible(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="control-pad">
      <button onClick={handleFakePayment}>Play TTS</button>
      <button onClick={handleShowNotification}>Show Notification</button>
      <button className="close-button" onClick={handleHideControlPad}></button>
      <AudioPlayer audioUrlQueue={audioQueue} setAudioQueue={setAudioQueue} />
      <Notification message="This is a test notification!" show={showNotification} />
    </div>
  );
};

export default ControlPad;
