import React, { useState } from "react";
import "./ChatBox.css";

type Props = {
    onClose: () => void;
};

const ChatBox: React.FC<Props> = ({ onClose }) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages((prev) => [...prev, `あなた: ${userMessage}`]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await res.json();
            const aiReply = data.reply ?? "（返答が取得できませんでした）";

            setMessages((prev) => [...prev, `先生: ${aiReply}`]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                "先生: （エラー：サーバーから返答がありません）",
            ]);
        }

        setLoading(false);
    };

    return (
        <div className="chatbox-overlay">
            <div className="chatbox">
                <div className="chatbox-header">
                    <span>太神先生チャット</span>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="chatbox-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className="chat-message">
                            {msg}
                        </div>
                    ))}

                    {loading && (
                        <div className="chat-message">
                            太神先生が入力中…
                        </div>
                    )}
                </div>

                <div className="chatbox-input">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="メッセージを入力…"
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button onClick={sendMessage} disabled={loading}>
                        {loading ? "送信中…" : "送信"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
