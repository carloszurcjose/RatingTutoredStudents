import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentsSessionInfo } from "./services/StudentSessionReportService";

const StudentSessionReport: React.FC = () => {
    const [studentName, setStudentName] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [effectiveness, setEffectiveness] = useState<number>(0);
    const [attitude, setAttitude] = useState<string>("");
    const [focus, setFocus] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [strategies, setStrategies] = useState<string>("");
    const [comments, setComments] = useState<string>("");


    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const idNum = Number(id);

    useEffect(() => {
        if (!id || Number.isNaN(idNum)) {
            setError("Invalid or missing student id.");
            return;
        }

        let alive = true;
        (async () => {
            try {
                const name = await getStudentsSessionInfo(idNum); // pass the id
                if (!alive) return;
                setStudentName(name);
            } catch (e) {
                if (!alive) return;
                setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [id, idNum]);

    if (loading) return <p>Loading…</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div className="wrapper">
            <div className="title">
                <p>Student Name: {studentName}</p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    // handle saving the form here
                    console.log({
                        effectiveness,
                        attitude,
                        focus,
                        duration,
                        strategies,
                        comments,
                    });
                }}
            >
                <label>
                    How effective was the session:
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={effectiveness}
                        onChange={(e) => setEffectiveness(Number(e.target.value))}
                    />
                </label>

                <label>
                    How was the student’s attitude:
                    <input
                        type="text"
                        value={attitude}
                        onChange={(e) => setAttitude(e.target.value)}
                    />
                </label>

                <label>
                    How focused was the student:
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={focus}
                        onChange={(e) => setFocus(Number(e.target.value))}
                    />
                </label>

                <label>
                    How long was the session (minutes):
                    <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                    />
                </label>

                <label>
                    What strategies did you use when teaching this student:
                    <textarea
                        value={strategies}
                        onChange={(e) => setStrategies(e.target.value)}
                    />
                </label>

                <label>
                    Extra comments:
                    <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                </label>

                <button type="submit">Submit</button>
            </form>
        </div>
    );

};

export default StudentSessionReport;
