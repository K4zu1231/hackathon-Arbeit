import React, { useRef, useState, useCallback } from 'react';
import Timer from '../components/Timer';
import { FullscreenButton } from '../components/FullScreenButton';
import { useCamera } from '../components/useCamera';
import useWebSocket from '../components/useWebSocket';
import './StudyPage.css';

const StudyPage: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const [showTeacher, setShowTeacher] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // WebSocket → WS接続して、showTeacher更新
    useWebSocket(wsRef, setShowTeacher);

    // Camera → カメラ起動 + WSにフレーム送信
    useCamera(videoRef, wsRef);

    const toggleFullscreen = useCallback(() => {
        const element = containerRef.current;
        if (!document.fullscreenElement) {
            element?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }, []);

    return (
        <div ref={containerRef} className="video-container">
            <video ref={videoRef} autoPlay playsInline muted />

            {/* 先生のオーバーレイ */}
            {showTeacher && (
                <img
                    src="../public/teacher.png"
                    alt="Teacher"
                    className="teacher-overlay"
                />
            )}

            <div className="timer-overlay">
                <Timer />
            </div>

            <FullscreenButton isFullscreen={isFullscreen} onClick={toggleFullscreen} />
        </div>
    );
};

export default StudyPage;
