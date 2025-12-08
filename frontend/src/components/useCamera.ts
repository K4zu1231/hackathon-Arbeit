import { useEffect, RefObject, MutableRefObject } from "react";

export function useCamera(
    videoRef: RefObject<HTMLVideoElement>,
    wsRef?: MutableRefObject<WebSocket | null>
) {
    useEffect(() => {
        let intervalId: number | null = null;

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                // WebSocket が渡された時だけ画像送信
                if (wsRef) {
                    intervalId = window.setInterval(() => {
                        sendFrame();
                    }, 150); // 150msごとに送信
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        };

        const sendFrame = () => {
            if (!videoRef.current) return;
            if (!wsRef?.current) return;
            if (wsRef.current.readyState !== WebSocket.OPEN) return;

            const video = videoRef.current;

            // canvasに描画
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // base64へ変換して送信
            const base64 = canvas.toDataURL("image/jpeg", 0.5);
            wsRef.current.send(base64);
        };

        startCamera();

        return () => {
            // カメラ停止
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }

            // interval停止
            if (intervalId) clearInterval(intervalId);
        };
    }, [videoRef, wsRef]);
}
