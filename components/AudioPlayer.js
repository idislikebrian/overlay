import { useState, useEffect } from 'react';

const AudioPlayer = ({ audioUrlQueue, setAudioQueue }) => {
    const [currentAudio, setCurrentAudio] = useState(null);

    // Play the next audio when the current one finishes
    useEffect(() => {
        if (!currentAudio && audioUrlQueue.length > 0) {
            const [nextAudio, ...remainingQueue] = audioUrlQueue;
            setCurrentAudio(nextAudio); // Set next audio to be played
            setAudioQueue(remainingQueue); // Update the queue, removing the played one
        }
    }, [audioUrlQueue, currentAudio, setAudioQueue]);

    const handleAudioEnd = () => {
        setCurrentAudio(null);
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
