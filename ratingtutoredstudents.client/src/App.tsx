import { useEffect, useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage'
import { Route, Routes } from 'react-router-dom';
import StudentInformation from './pages/StudentInformation';
import StudentSessionReport from './pages/StudentSessionReport';
import AddStudent from './pages/AddStudent';
function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/student/report/:id" element={<StudentInformation />} />
            <Route path="/student/addReport/:id" element={<StudentSessionReport />} />
            <Route path="/student/addStudent" element={<AddStudent /> } />
        </Routes>       
    )
}

export default App;