import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from '@mui/material';

type Mode = 'work' | 'shortBreak' | 'longBreak';

interface SettingsDialogProps {
    open: boolean;
    onClose: () => void;
    workMin: number;
    shortMin: number;
    longMin: number;
    cyclesBeforeLong: number;
    mode: Mode;
    setWorkMin: (n: number) => void;
    setShortMin: (n: number) => void;
    setLongMin: (n: number) => void;
    setCyclesBeforeLong: (n: number) => void;
    setSecondsLeft: (n: number) => void; // 即時反映用
}

export default function SettingsDialog(props: SettingsDialogProps) {
    const {
        open, onClose,
        workMin, shortMin, longMin, cyclesBeforeLong, mode,
        setWorkMin, setShortMin, setLongMin, setCyclesBeforeLong, setSecondsLeft
    } = props;

    const [tmpWork, setTmpWork] = React.useState(workMin);
    const [tmpShort, setTmpShort] = React.useState(shortMin);
    const [tmpLong, setTmpLong] = React.useState(longMin);
    const [tmpCycles, setTmpCycles] = React.useState(cyclesBeforeLong);

    React.useEffect(() => {
        if (open) {
            setTmpWork(workMin);
            setTmpShort(shortMin);
            setTmpLong(longMin);
            setTmpCycles(cyclesBeforeLong);
        }
    }, [open, workMin, shortMin, longMin, cyclesBeforeLong]);

    const applySettings = () => {
        setWorkMin(tmpWork);
        setShortMin(tmpShort);
        setLongMin(tmpLong);
        setCyclesBeforeLong(tmpCycles);

        // モードに応じて残り時間も即時更新
        switch (mode) {
            case 'work': setSecondsLeft(tmpWork * 60); break;
            case 'shortBreak': setSecondsLeft(tmpShort * 60); break;
            case 'longBreak': setSecondsLeft(tmpLong * 60); break;
        }

        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>設定</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
                    <TextField
                        label="作業時間（分）"
                        type="number"
                        value={tmpWork}
                        onChange={(e) => setTmpWork(Number(e.target.value))}
                    />
                    <TextField
                        label="短い休憩（分）"
                        type="number"
                        value={tmpShort}
                        onChange={(e) => setTmpShort(Number(e.target.value))}
                    />
                    <TextField
                        label="長い休憩（分）"
                        type="number"
                        value={tmpLong}
                        onChange={(e) => setTmpLong(Number(e.target.value))}
                    />
                    <TextField
                        label="長い休憩になるまでのサイクル数"
                        type="number"
                        value={tmpCycles}
                        onChange={(e) => setTmpCycles(Number(e.target.value))}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>キャンセル</Button>
                <Button variant="contained" onClick={applySettings}>保存</Button>
            </DialogActions>
        </Dialog>
    );
}
