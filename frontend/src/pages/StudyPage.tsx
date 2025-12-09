import React, { useRef, useState, useCallback } from 'react';
import Timer from '../components/Timer'
import Menu from '../components/Menu';
import ChatBox from '../components/ChatBox';
import { FullscreenButton } from '../components/FullScreenButton';
import { useCamera } from '../components/useCamera';
import useWebSocket from '../components/useWebSocket';
import './StudyPage.css';
import Exit from '../components/Exit';
import TeacherOverlay from '../components/Teacher';
import { useSearchParams } from 'react-router-dom';
import TypeWriter from '../components/TypeWriter.tsx';

export default function StudyPage() {
    const [searchParams] = useSearchParams();
    const subject = searchParams.get('subject');

    const teacherLine = React.useMemo(() => {
        switch (subject) {
            case 'kokugo':
                return '今日は文章読解を頑張ろうか。';
            case 'sugaku':
                return 'まずは基礎問題から解いてみよう。';
            case 'eigo':
                return '発音を意識して音読してみよう。';
            case 'rika':
                return '実験のイメージをしながら覚えよう。';
            case 'shakai':
                return '流れを理解すると覚えやすいぞ。';
            default:
                return 'さあ、集中して勉強を始めよう。';
        }
    }, [subject]);

    const [timerVisible, setTimerVisible] = React.useState(true);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const [showTeacher, setShowTeacher] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showExit, setShowExit] = useState(false);

    useWebSocket(wsRef, setShowTeacher);
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

            <div className="teacher-text-overlay">
                <TypeWriter text={teacherLine} />
            </div>


            {showTeacher && (
                <TeacherOverlay
                    show={showTeacher}
                    videoSrc="/oga.mp4"
                    audioSrc="/oga2.wav"
                />
            )}

            <div className="timer-overlay">
                <Timer visible={timerVisible} setVisible={setTimerVisible} />
                <Menu
                    onShowTimer={() => setTimerVisible(true)}
                    onShowChat={() => setShowChat(true)}
                    onShowExit={() => setShowExit(true)}
                />
            </div>

            <Exit open={showExit} onClose={() => setShowExit(false)} />
            <FullscreenButton isFullscreen={isFullscreen} onClick={toggleFullscreen} />

            {showChat && <ChatBox onClose={() => setShowChat(false)} />}
        </div>
    );
}
