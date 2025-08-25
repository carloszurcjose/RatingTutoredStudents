import { useEffect, useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage'
import { Route, Routes } from 'react-router-dom';
import StudentInformation from './pages/StudentInformation';
function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/student/:id" element={<StudentInformation />} />
        </Routes>
            
    )
}

export default App;