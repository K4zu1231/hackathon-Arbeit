

import './App.css'

import {Box, Button, Container,} from "@mui/material";

function App() {
    return (
        <Box >
            {/* 背景オーバーレイ */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "url(../public/images/ooga1.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity:0.2,   // ← イマジナリー効果
                    zIndex: -1,
                }}
            />

            {/* 通常コンテンツ */}
            <Box sx={{ position: "relative", zIndex: 1 }}>
                <h1 >太神先生と一緒にお勉強しよう</h1>
                <Button　variant="contained">勉強する</Button>
                <br/>
                <br/>
                <Button　variant="text">勉強しない</Button>
            </Box>
        </Box>
    )
}
export default App