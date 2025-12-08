import React from 'react';
import './Menu.css';
import {Button} from "@mui/material";

type Props = {
    onShowTimer: () => void;
};

export default function MouseRevealMenu({ onShowTimer }: Props) {
    const [visible, setVisible] = React.useState(false);
    const hideTimer = React.useRef<number | null>(null);

    const showMenu = () => {
        setVisible(true);

        if (hideTimer.current) {
            window.clearTimeout(hideTimer.current);
        }

        hideTimer.current = window.setTimeout(() => {
            setVisible(false);
        }, 2000); // 2秒後に消える
    };

    React.useEffect(() => {
        window.addEventListener('mousemove', showMenu);
        return () => window.removeEventListener('mousemove', showMenu);
    }, []);

    return (
        <div className={`mouse-menu ${visible ? 'show' : ''}`}>
            <Button></Button>
            <Button onClick={onShowTimer} color="primary">
                タイマー
            </Button>
            <Button variant="contained" color="error" >勉強をやめる</Button>
        </div>
    );
}
