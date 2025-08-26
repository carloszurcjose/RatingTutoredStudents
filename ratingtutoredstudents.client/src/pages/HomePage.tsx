import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ added
import type { Student } from "../types/Student";
import { getStudents } from "./services/HomePageService";
import "./styles/HomePage.css";

const HomePage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState<keyof Student>("last_name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const navigate = useNavigate(); // ⬅️ added

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
        return () => { alive = false; };
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = q
            ? students.filter(s =>
                `${s.first_name} ${s.last_name}`.toLowerCase().includes(q)
            )
            : students;

        const dir = sortDir === "asc" ? 1 : -1;
        return [...base].sort((a, b) => {
            const av = a[sortBy] as unknown;
            const bv = b[sortBy] as unknown;

            if (typeof av === "number" && typeof bv === "number") {
                return (av - bv) * dir;
            }
            const va = String(av ?? "");
            const vb = String(bv ?? "");
            return va.localeCompare(vb, undefined, { numeric: true, sensitivity: "base" }) * dir;
        });
    }, [students, query, sortBy, sortDir]);

    const toggleSort = (key: keyof Student) => {
        if (key === sortBy) setSortDir(d => (d === "asc" ? "desc" : "asc"));
        else {
            setSortBy(key);
            setSortDir("asc");
        }
    };

    if (loading) return <p>Loading students…</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div className="wrapper">
            <div className="title"><p>Welcome Tutors</p></div>

            <div className="select-student">
                <label htmlFor="student-search" className="label">
                    Search for students
                </label>
                <input
                    id="student-search"
                    className="search-input"
                    placeholder="Type a name…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                <button className="th-btn" onClick={() => toggleSort("id")}>
                                    ID {sortBy === "id" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                                </button>
                            </th>
                            <th>
                                <button className="th-btn" onClick={() => toggleSort("first_name")}>
                                    First Name {sortBy === "first_name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                                </button>
                            </th>
                            <th>
                                <button className="th-btn" onClick={() => toggleSort("last_name")}>
                                    Last Name {sortBy === "last_name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                                </button>
                            </th>
                            <th>Actions</th> {/* ⬅️ added */}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="empty">No students found.</td> {/* ⬅️ 4 cols now */}
                            </tr>
                        ) : (
                            filtered.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.id}</td>
                                    <td>{s.first_name}</td>
                                    <td>{s.last_name}</td>
                                    <td>
                                        <button
                                            className="view-btn"
                                            onClick={() => navigate(`/student/report/${s.id}`)} // ⬅️ navigate with id
                                            aria-label={`View student ${s.first_name} ${s.last_name}`}
                                        >
                                            View
                                        </button>

                                        <button
                                            className="add-btn"
                                            onClick={() => navigate(`/student/addReport/${s.id}`)}
                                            aria-label={`Add report for ${s.first_name} ${s.last_name}`}
                                            style={{ marginLeft: "0.5rem" }} // space between buttons
                                        >
                                            Add Report
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HomePage;
