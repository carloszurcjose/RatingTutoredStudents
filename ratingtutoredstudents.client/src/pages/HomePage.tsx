import { useEffect, useState } from "react";
import type { Student } from "../types/Student";
import { getStudents } from "./services/HomePageService";
import "./styles/HomePage.css";

const HomePage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const data = await getStudents();
                if (alive) setStudents(data);
            } catch (e) {
                if (alive) setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    if (loading) return <p>Loading students…</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div className="wrapper">
            <div className="title">
                <p>Welcome Tutors</p>
            </div>

            <div className="select-student">
                <p>Search for students</p>
            </div>

            <ul>
                {students.map((s) => (
                    <li key={s.id}>
                        {s.first_name} {s.last_name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
