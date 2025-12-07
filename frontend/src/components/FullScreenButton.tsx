import React from 'react';
import { IconButton } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

interface Props {
    isFullscreen: boolean;
    onClick: () => void;
}

export const FullscreenButton: React.FC<Props> = ({ isFullscreen, onClick }) => (
    <IconButton
        onClick={onClick}
        style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            zIndex: 20,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.4)',
            padding: '10px',
            borderRadius: '50%'
        }}
    >
        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </IconButton>
);
