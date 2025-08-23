import React from "react";
import "./styles/HomePage.css";

// Explicitly typed as a functional component
const HomePage: React.FC = () => {
    return (
        <div className="wrapper">
            <div className="title">
                <p>Welcome Tutors</p>
            </div>

            <div className="select-student">
                <p>Search for students</p>
            </div>
        </div>
    );
};

export default HomePage;
