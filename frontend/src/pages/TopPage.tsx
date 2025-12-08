// import {Link} from "react-router-dom";
import {Box, Button} from "@mui/material";

import Dialog from "../components/Dialog.tsx";



import '../App.css'
const App = () => {
    return (
        <Box >

            <Box
                sx={{
                    margin: 'auto',
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "url(../public/images/oga.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "fixed",
                    opacity:0.1,
                    zIndex: -0,
                }}
            />


            <Box sx={{ position: "relative", zIndex: 1 }}>
                <h1 >私と一緒に勉強しませんか？</h1>
                <Dialog />
                <Button　variant="text">勉強しない</Button>
            </Box>
        </Box>
    )
}
export default App