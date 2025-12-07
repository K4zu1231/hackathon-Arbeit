import {Route, Routes} from "react-router-dom"


import TopPage from "./pages/TopPage.tsx";
import StudyPage from "./pages/StudyPage.tsx";


const App = () => {
    return (
        <Routes>
            <Route path="/" element={<TopPage />} />
            <Route path="/study" element={<StudyPage />} />
        </Routes>
    )
}

export default App;