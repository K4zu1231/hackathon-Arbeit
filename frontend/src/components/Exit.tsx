import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function AlertDialog({ open, onClose }: Props) {
    const [step, setStep] = React.useState(1);
    const navigate = useNavigate(); // React Router の遷移関数

    const handleClose = () => {
        setStep(1);
        onClose();
    };

    const handleConfirm = () => {
        if (step === 1) {
            setStep(2); // 2段階目に進む
        } else {
            // 最終確認OK → ページ遷移
            handleClose();
            navigate("/"); // 2回目で遷移
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {step === 1
                    ? "本当に勉強をやめますか？？？"
                    : "本当に本当にやめていいですか？？？"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {step === 1
                        ? "勉強をやめると進捗が止まります。"
                        : "この操作は取り消せません。本当にやめますか？"}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>やめない</Button>
                <Button onClick={handleConfirm} autoFocus color="error">
                    やめる
                </Button>
            </DialogActions>
        </Dialog>
    );
}
