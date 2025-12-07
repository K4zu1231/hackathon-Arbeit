import React from 'react';

interface Props {
    showTeacher: boolean;
}

export const TeacherOverlay: React.FC<Props> = ({ showTeacher }) => {
    if (!showTeacher) return null;
    return (
        <img
            src="teacher.png"
            alt="Teacher"
            style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: '200px',
                zIndex: 10
            }}
        />
    );
};
