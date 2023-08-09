import React, { useState, useEffect } from 'react';

/**
 * A countdown timer component that displays and decrements the countdown value from 3 to 0.
 * @component
 * @return {JSX.Element} CountdownTimer component
 */

const CountdownTimer = () => {
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {

        if (countdown > 0) {
            const interval = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);


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