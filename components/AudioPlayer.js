import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const AudioPlayer = () => {
    const [audioUrlQueue, setAudioQueue] = useState([]);
    const [currentAudio, setCurrentAudio] = useState(null);

    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL);

        socket.on('play-audio', (data) => {
            setAudioQueue((prevQueue) => [...prevQueue, data.audio]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!currentAudio && audioUrlQueue.length > 0) {
            const [nextAudio, ...remainingQueue] = audioUrlQueue;
            setCurrentAudio(nextAudio);
            setAudioQueue(remainingQueue);
        }
    }, [audioUrlQueue, currentAudio]);

    const handleAudioEnd = () => {
        setCurrentAudio(null);
    };

    return (
        currentAudio ? (
            <audio autoPlay onEnded={handleAudioEnd} style={{ display: 'none' }}>
                <source src={`data:audio/mpeg;base64,${currentAudio}`} type="audio/mpeg" />
            </audio>
        ) : null
    );
};

export default AudioPlayer;