import { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;

const AudioPlayer = ({ audioUrlQueue, setAudioQueue }) => {
    const [currentAudio, setCurrentAudio] = useState(null);

    useEffect(() => {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

        socket.on('play-audio', (data) => {
            setAudioQueue((prevQueue) => [...prevQueue, data.audio]);
        });
    }, [setAudioQueue]);

    useEffect(() => {
        if (!currentAudio && audioUrlQueue.length > 0) {
            const [nextAudio, ...remainingQueue] = audioUrlQueue;
            setCurrentAudio(nextAudio); 
            setAudioQueue(remainingQueue);
        }
    }, [audioUrlQueue, currentAudio, setAudioQueue]);

    const handleAudioEnd = () => {
        setCurrentAudio(null); 
    };

    return (
        currentAudio ? (
            <audio autoPlay onEnded={handleAudioEnd} style={{ display: 'none' }}>
                <source src={`data:audio/mp3;base64,${currentAudio}`} type="audio/mp3" />
            </audio>
        ) : null
    );
};

export default AudioPlayer;