interface ProgressCircleProps {
    size: number;   // 円のサイズ（px）
    percent: number; // 0〜100 の進捗
}

export default function ProgressCircle({ size, percent }: ProgressCircleProps) {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percent / 100);

    return (
        <svg width={size} height={size}>
            <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3f51b5" />
                    <stop offset="100%" stopColor="#f50057" />
                </linearGradient>
            </defs>
            {/* 背景円 */}
            <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke="#eee"
                strokeWidth={strokeWidth}
            />
            {/* 進捗円 */}
            <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke="url(#progress-gradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${cx} ${cy})`}
            />
        </svg>
    );
}
