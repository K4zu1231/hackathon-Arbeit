import { useEffect, MutableRefObject, Dispatch, SetStateAction } from 'react';

export default function useWebSocket(
    wsRef: MutableRefObject<WebSocket | null>, // RefObject から MutableRefObject に変更
    setShowTeacher: Dispatch<SetStateAction<boolean>>
) {
    // wsRef を依存配列から除外。wsRef.current の変更は依存性のトリガーではないため。
    useEffect(() => {
        // 新しい WebSocket インスタンスを作成
        const ws = new WebSocket("ws://localhost:8000/ws");

        // 接続が確立したら Ref にインスタンスを格納
        ws.onopen = () => {
            console.log("WebSocket connected.");
            wsRef.current = ws; // TypeScriptエラーを修正
        };

        // メッセージ受信時の処理
        ws.onmessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);

                // データに 'show_teacher' プロパティがあれば状態を更新
                if (typeof data.show_teacher === 'boolean') {
                    setShowTeacher(data.show_teacher);
                }
            } catch (e) {
                console.error("Failed to parse websocket message:", e);
            }
        };

        // エラー発生時の処理
        ws.onerror = (error: Event) => {
            console.error("WebSocket error:", error);
        };

        // クリーンアップ関数: コンポーネントアンマウント時、または依存が変化する前に実行
        return () => {
            // 接続がまだ開いているか確認してから閉じる
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.close(1000, "Component unmounted or effect re-ran");
                wsRef.current = null; // Ref をクリア
                console.log("WebSocket closed.");
            }
        };
    }, [setShowTeacher]); // setShowTeacher のみ依存
}