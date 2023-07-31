import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        // Check if the countdown has reached 0, if not, decrement it every second
        if (countdown > 0) {
            const interval = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);

            // Clear the interval when the component unmounts or countdown reaches 0
            return () => clearInterval(interval);
        }
    }, [countdown]);

    return (
        <>
            {countdown}
        </>
    );
};

export default CountdownTimer;