import React from 'react';
import { Box, IconButton, Button, Stack, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SettingsIcon from '@mui/icons-material/Settings';
import ProgressCircle from './ProgressCircle';
import SettingsDialog from './SettingsDialog';
import './Timer.css';

type Mode = 'work' | 'shortBreak' | 'longBreak';

export default function PomodoroTimer() {
    const [workMin, setWorkMin] = React.useState(25);
    const [shortMin, setShortMin] = React.useState(5);
    const [longMin, setLongMin] = React.useState(15);
    const [cyclesBeforeLong, setCyclesBeforeLong] = React.useState(4);

    const [mode, setMode] = React.useState<Mode>('work');
    const [secondsLeft, setSecondsLeft] = React.useState(() => workMin * 60);
    const [running, setRunning] = React.useState(false);
    const [completedCycles, setCompletedCycles] = React.useState(0);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [minimized, setMinimized] = React.useState(false);

    const alarmRef = React.useRef<HTMLAudioElement | null>(null);

    // タイマー
    React.useEffect(() => {
        if (!running) return;
        const tick = () => setSecondsLeft(s => s - 1);
        const id = window.setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [running]);

    // モード切替
    React.useEffect(() => {
        if (secondsLeft > 0) return;

        if (alarmRef.current) {
            try { alarmRef.current.currentTime = 0; } catch {}
            alarmRef.current.play().catch(() => {});
        }

        if (mode === 'work') {
            const nextCompleted = completedCycles + 1;
            setCompletedCycles(nextCompleted);
            if (nextCompleted % cyclesBeforeLong === 0) {
                setMode('longBreak');
                setSecondsLeft(longMin * 60);
            } else {
                setMode('shortBreak');
                setSecondsLeft(shortMin * 60);
            }
        } else {
            setMode('work');
            setSecondsLeft(workMin * 60);
        }
    }, [secondsLeft, mode, completedCycles, cyclesBeforeLong, longMin, shortMin, workMin]);

    // Notification
    React.useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().catch(() => {});
        }
    }, []);

    const toggleStart = () => setRunning(r => !r);
    const reset = () => {
        setRunning(false);
        setMode('work');
        setSecondsLeft(workMin * 60);
        setCompletedCycles(0);
    };
    const toggleMinimize = () => setMinimized(m => !m);

    const formatTime = (sec: number) => `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;
    const totalForMode = mode === 'work' ? workMin*60 : mode==='shortBreak' ? shortMin*60 : longMin*60;
    const percent = Math.max(0, Math.min(100, Math.round((secondsLeft/totalForMode)*100)));

    return (
        <div className={`draggable-timer ${minimized ? 'minimized' : ''}`} >
            <div className="drag-handle">
                <Typography variant="subtitle2">{mode==='work'?'作業':'休憩'}</Typography>
                <Button onClick={toggleMinimize} size="small">-</Button>
            </div>
            {!minimized && (
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Box position="relative" width={150} height={150} display="flex" alignItems="center" justifyContent="center">
                        <ProgressCircle size={150} percent={percent} />
                        <Box position="absolute" textAlign="center">
                            <Typography variant="h6">{formatTime(secondsLeft)}</Typography>
                        </Box>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <IconButton onClick={toggleStart}>{running ? <PauseIcon /> : <PlayArrowIcon />}</IconButton>
                        <Button variant="outlined" onClick={reset}>リセット</Button>
                        <IconButton onClick={()=>setSettingsOpen(true)}><SettingsIcon /></IconButton>
                    </Stack>
                    <Typography variant="caption">完了サイクル: {completedCycles}</Typography>
                    <SettingsDialog
                        open={settingsOpen}
                        onClose={()=>setSettingsOpen(false)}
                        workMin={workMin}
                        shortMin={shortMin}
                        longMin={longMin}
                        cyclesBeforeLong={cyclesBeforeLong}
                        setWorkMin={setWorkMin}
                        setShortMin={setShortMin}
                        setLongMin={setLongMin}
                        setCyclesBeforeLong={setCyclesBeforeLong}
                        setSecondsLeft={setSecondsLeft} // 設定即時反映
                        mode={mode}
                    />
                    <audio ref={alarmRef} src={beepDataUrl} />
                </Box>
            )}
        </div>
    );
}

const beepDataUrl = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";
