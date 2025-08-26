import type { StudentInformationType } from "../../types/StudentInformationType"

async function getStudentsSessionInfoFromDb(student_id: number) {
    console.log("Hereee");
    const response = await fetch(`https://localhost:7137/sessioninfo/student?studentId=${student_id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch students");
    }
    return await response.json();
}

async function getStudentName(student_id: number) {
    const response = await fetch(`https://localhost:7137/sessioninfo/GetStudentName?studentId=${student_id}`);
    if (!response.ok) {
        throw new Error("Failed to get students name");
    }
    return response.json();
}

export async function getStudentsSessionInfo(student_id: number): Promise<StudentInformationType[]> {
    const raw = await getStudentsSessionInfoFromDb(student_id);
    const name = await getStudentName(student_id);
    console.log(name)
    console.log(raw);
    return raw.map((r: any) => ({
        id: Number(r.id),
        name: name.name,
        student_id: Number(r.studentId),
        area: r.area,
        effectiveness: Number(r.effectiveness),
        attitude: Number(r.attitude),
        focus: Number(r.focus),
        strategies_used: r.strategies_used,
        comments: r.comments,
        duration: Number(r.duration)
    }));
}
