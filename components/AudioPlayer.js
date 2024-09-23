import { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;

const AudioPlayer = ({ audioUrlQueue, setAudioQueue }) => {
    const [currentAudio, setCurrentAudio] = useState(null);

    useEffect(() => {
        socket = io('process.env.NEXT_PUBLIC_SOCKET_URL');

        // Listen for play-audio events from the server
        socket.on('play-audio', (data) => {
            setAudioQueue((prevQueue) => [...prevQueue, data.audio]);  // Add the audio to the queue
        });
    }, [setAudioQueue]);

    useEffect(() => {
        if (!currentAudio && audioUrlQueue.length > 0) {
            const [nextAudio, ...remainingQueue] = audioUrlQueue;
            setCurrentAudio(nextAudio);  // Set the next audio
            setAudioQueue(remainingQueue);  // Remove the played audio from the queue
        }
    }, [audioUrlQueue, currentAudio, setAudioQueue]);

    const handleAudioEnd = () => {
        setCurrentAudio(null);  // Reset the audio after it finishes
    };

    return (
        currentAudio ? (
            <audio autoPlay onEnded={handleAudioEnd} style={{ display: 'none' }}>
                <source src={currentAudio} type="audio/mp3" />
            </audio>
        ) : null
    );
};

export default AudioPlayer;
