import React from 'react';

type Props = {
    text: string;
    speed?: number;
};

export default function TypeWriterText({ text, speed = 50 }: Props) {
    const [displayed, setDisplayed] = React.useState('');
    const [fadeOut, setFadeOut] = React.useState(false);

    React.useEffect(() => {
        setDisplayed('');
        setFadeOut(false);

        let i = 0;
        const timer = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));

            if (i >= text.length) {
                clearInterval(timer);

                // 表示完了後 1.5秒でフェードアウト
                setTimeout(() => {
                    setFadeOut(true);
                }, 1500);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed]);

    return (
        <div className={`typewriter-container ${fadeOut ? 'fade-out' : ''}`}>
            {displayed}
            {!fadeOut && <span className="typewriter-cursor">|</span>}
        </div>
    );
}
