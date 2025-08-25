import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { StudentInformationType } from "../types/StudentInformationType";
import { getStudentsSessionInfo } from "./services/StudentInformationService";

const StudentInformation: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const idNum = Number(id);

    const [studentSessionInfo, setStudentSessionInfo] = useState<StudentInformationType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let alive = true;

        // guard: if the param isn't present or not a number
        if (!id || Number.isNaN(idNum)) {
            setError("Invalid or missing student id in URL.");
            setLoading(false);
            return;
        }

        (async () => {
            try {
                const data = await getStudentsSessionInfo(idNum);
                if (alive) setStudentSessionInfo(data);
            } catch (e) {
                if (alive) setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => { alive = false; };
    }, [id, idNum]); // refetch if route param changes

    if (loading) return <p>Loading…</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div className="wrapper">
            <div className="title">
                <p>Student Name: {studentSessionInfo[0].student_id}</p>
            </div>
        </div>
    );
};

export default StudentInformation;
