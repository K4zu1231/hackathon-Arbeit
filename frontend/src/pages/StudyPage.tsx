import React, { useRef, useState, useCallback, useEffect } from 'react';
import Timer from '../components/Timer';
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
                return '今日は文章読解を頑張りましょうか。';
            case 'sugaku':
                return 'まずは基礎問題から解いてみましょう。';
            case 'eigo':
                return '発音を意識して音読してみましょう。';
            case 'rika':
                return '実験のイメージをしながら覚えましょう。';
            case 'shakai':
                return '時代の流れを理解すると覚えやすいですよ。';
            case 'program':
                return 'AIはアーティフィシャルインテリジェンスの略ですよ。';
            default:
                return 'さあ、集中して勉強を始めてください。';
        }
    }, [subject]);

    // 音声再生用
    useEffect(() => {
        let audioFile = '';
        switch (subject) {
            case 'kokugo':
                audioFile = '/audio/kokugo.wav';
                break;
            case 'sugaku':
                audioFile = '/audio/sugaku.wav';
                break;
            case 'eigo':
                audioFile = '/audio/eigo.wav';
                break;
            case 'rika':
                audioFile = '/audio/rika.wav';
                break;
            case 'shakai':
                audioFile = '/audio/shakai.wav';
                break;
            case 'program':
                audioFile = '/audio/program.wav';
                break;
            default:
                audioFile = '/audio/default.wav';
        }

        if (audioFile) {
            const audio = new Audio(audioFile);
            audio.play().catch((err) => console.warn('自動再生できません:', err));
        }
    }, [subject]);
    const [timerVisible, setTimerVisible] = useState(true);
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
