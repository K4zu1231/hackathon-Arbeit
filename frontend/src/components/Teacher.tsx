import React, { useEffect, useRef } from "react";
import './Teacher.css';

interface Props {
    show: boolean;
    videoSrc: string;
    audioSrc: string;
}

const TeacherOverlay: React.FC<Props> = ({ show, videoSrc, audioSrc }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 初回レンダリングで Audio を作る
    useEffect(() => {
        audioRef.current = new Audio(audioSrc);
        audioRef.current.loop = true;

        return () => {
            // コンポーネントアンマウント時に音停止
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, [audioSrc]);

    // show に応じて再生／停止
    useEffect(() => {
        if (!audioRef.current) return;

        if (show) {
            audioRef.current.play().catch(err => {
                console.warn("自動再生がブロックされました:", err);
            });
        } else {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [show]);

    if (!show) return null;

    return (
        <video
            src={videoSrc}
            autoPlay
            loop
            muted
            className="teacher-overlay"
        />
    );
};

export default TeacherOverlay;
