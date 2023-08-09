import React, { useState, useContext, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../common/LoadingSpinner";

import video1 from '../backgrounds/Video1.mp4'
import video2 from '../backgrounds/Video2.mp4'
import video3 from '../backgrounds/Video3.mp4'
import video4 from '../backgrounds/Video4.mp4'
import video5 from '../backgrounds/Video5.mp4'

import GameContext from "../GameContext";

/**
 * @component
 * Component responsible for rendering the background video.
 * 
 * This component displays a looping video as the background of the game page. The video
 * source is selected based on certain conditions, and its height is adjusted to fit the
 * viewport. Event listeners for window resize are added to ensure the video's height
 * remains responsive.
 * 
 * @returns {JSX.Element} The BackgroundVideo component.
 */

const BackgroundVideo = () => {

    const { setViewHeight } = useContext(GameContext);


    const [video, setVideo] = useState(null)
    const [videoHeight, setVideoHeight] = useState(null)
    const isMountedRef = useRef(false);


    const { mp3Id } = useParams()

    // Set the appropriate video based on conditions
    useEffect(() => {
        if (!isMountedRef.current) {
            if (Number(mp3Id) === 1564) {
                setVideo(5)
            } else {
                const videoNumbers = [1, 2, 3, 4]
                const randomIndex = Math.floor(Math.random() * videoNumbers.length);

                if (videoNumbers[randomIndex] === 1) { setVideo(1) }
                else if (videoNumbers[randomIndex] === 2) { setVideo(2) }
                else if (videoNumbers[randomIndex] === 3) { setVideo(3) }
                else if (videoNumbers[randomIndex] === 4) { setVideo(4) }
            }
            isMountedRef.current = true;
        }
    }, [mp3Id])


    // Update view height and video height on window resize
    useEffect(() => {
        const updateViewHeight = () => {
            setViewHeight(window.innerHeight);
        };
        const updateVideoHeight = () => {
            setVideoHeight(window.innerHeight - 220);
        };
        updateViewHeight();
        updateVideoHeight();

        window.addEventListener('resize', updateViewHeight);

        return () => {
            window.removeEventListener('resize', updateViewHeight);
        };
    }, []);


    // Get the video source based on the selected video
    const getVideo = () => {
        if (video === 1) { return (<source src={video1} type="video/mp4" />) }
        else if (video === 2) { return (<source src={video2} type="video/mp4" />) }
        else if (video === 3) { return (<source src={video3} type="video/mp4" />) }
        else if (video === 4) { return (<source src={video4} type="video/mp4" />) }
        else if (video === 5) { return (<source src={video5} type="video/mp4" />) }

    }

    if (video === null) return <LoadingSpinner />;

    return (

        <video autoPlay loop id="bgvid" style={{ height: videoHeight }}>
            {getVideo()}
        </video>

    );
};

export default BackgroundVideo;