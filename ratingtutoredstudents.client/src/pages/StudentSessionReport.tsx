import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addReportToDB, getStudentsSessionInfo } from "./services/StudentSessionReportService";
import StarRadio from "../components/StarRadio";

const StudentSessionReport: React.FC = () => {
    const [studentName, setStudentName] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [area, setArea] = useState<string>("");
    const [effectiveness, setEffectiveness] = useState<number>(0);
    const [attitude, setAttitude] = useState<number>(0);
    const [focus, setFocus] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [strategies, setStrategies] = useState<string>("");
    const [comments, setComments] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // add near other useState lines
    type LearningStyle =
        | "Scaffolding"
        | "SocraticQuestioning"
        | "ActiveRecall"
        | "SpacedRepetition"
        | "Visualization"
        | "WorkedExamples"
        | "PeerTeaching"
        | "ErrorAnalysis"
        | "Gamification"
        | "RealWorldExamples"
        | "Mixed";

    const [preferredLearningStyle, setPreferredLearningStyle] = useState<LearningStyle | "">("");



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

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        //e.preventDefault();         // stop page refresh
        //console.log(effectiveness);
        //console.log(attitude);
        //console.log(focus);
        //console.log(duration);
        //console.log(strategies);
        //console.log(comments);
        addReportToDB(idNum, area, effectiveness, attitude, focus, duration, preferredLearningStyle, comments);
        navigate("/");
        
        // prints to console
        // alert("Hello");          // uncomment if you want a popup instead
    };


    return (
        <div className="wrapper">
            <div className="title">
                <p>Student Name: {studentName}</p>
            </div>

            <form
                className="form"
                onSubmit={handleSubmit}
                    // TODO: POST to your API here
               
            >
                <div className="area">
                    <label className="question" htmlFor="duration">
                        What was the area studied:
                    </label>
                    <input
                        id="duration"
                        className="input"
                        min={0}
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="For Loops ?"
                    />
                </div>
                <StarRadio
                    name="effectiveness"
                    label="How effective was the session:"
                    value={effectiveness}
                    onChange={setEffectiveness}
                />

                <StarRadio
                    name="attitude"
                    label="How was the student’s attitude:"
                    value={attitude}
                    onChange={setAttitude}
                />

                <StarRadio
                    name="focus"
                    label="How focused was the student:"
                    value={focus}
                    onChange={setFocus}
                />

                <div className="field">
                    <label className="question" htmlFor="duration">
                        How long was the session (minutes):
                    </label>
                    <input
                        id="duration"
                        className="input"
                        type="number"
                        min={0}
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        placeholder="e.g., 45"
                    />
                </div>

                <div className="field">
                    <label className="question" htmlFor="preferred_learning_style">
                        Strategy used when teaching this student:
                    </label>
                    <select
                        id="preferred_learning_style"
                        className="input"
                        value={preferredLearningStyle}
                        onChange={(e) => setPreferredLearningStyle(e.target.value as LearningStyle | "")}
                    >
                        <option value="">Select…</option>
                        <option value="Scaffolding">Scaffolding</option>
                        <option value="SocraticQuestioning">Socratic Questioning</option>
                        <option value="ActiveRecall">Active Recall</option>
                        <option value="SpacedRepetition">Spaced Repetition</option>
                        <option value="Visualization">Visualization</option>
                        <option value="WorkedExamples">Worked Examples</option>
                        <option value="PeerTeaching">Peer Teaching</option>
                        <option value="ErrorAnalysis">Error Analysis</option>
                        <option value="Gamification">Gamification</option>
                        <option value="RealWorldExamples">Real World Examples</option>
                        <option value="Mixed">Mixed</option>
                    </select>
                </div>


                <div className="field">
                    <label className="question" htmlFor="comments">
                        Extra comments:
                    </label>
                    <textarea
                        id="comments"
                        className="textarea"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Anything else worth noting…"
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
}

export default StudentSessionReport;
