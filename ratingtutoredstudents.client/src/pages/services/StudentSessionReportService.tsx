import { SessionInfoType } from "../../types/SessionInfoType";
import { StudentInformationType } from "../../types/StudentInformationType";

async function getStudentName(student_id: number) {
    const response = await fetch(`https://localhost:7137/sessioninfo/GetStudentName?studentId=${student_id}`);
    if (!response.ok) {
        throw new Error("Failed to get students name");
    }
    return response.json();
}

export async function getStudentsSessionInfo(student_id: number): Promise<String> {
    const name = await getStudentName(student_id);
    return name.name;
}

export async function addReportToDB(student_id: number, area: string, effectiveness: number, attitude: number,
    focus: number, duration: number, strategies: string, comments: string) {
    const payload: SessionInfoType = {
        studentId: student_id,
        area: area,
        effectiveness: effectiveness,
        attitude: attitude,
        focus: focus,
        duration: duration,
        strategiesUsed: strategies,
        comments: comments
    }

    const res = await fetch("https://localhost:7137/sessioninfo/StudentSessionReport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    console.log(res);

    if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg ||`Request failed (${res.status})`)
    }

}