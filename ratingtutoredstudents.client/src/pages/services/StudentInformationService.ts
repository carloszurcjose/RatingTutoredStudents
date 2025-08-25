import type { StudentInformationType } from "../../types/StudentInformationType"

async function getStudentsSessionInfoFromDb(student_id: number) {
    console.log("Hereee");
    const response = await fetch(`https://localhost:7137/sessioninfo/student?studentId=${student_id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch students");
    }
    return await response.json();
}

export async function getStudentsSessionInfo(student_id: number): Promise<StudentInformationType[]> {
    const raw = await getStudentsSessionInfoFromDb(student_id);
    console.log(raw);
    return raw.map((r: any) => ({
        id: Number(r.id),
        student_id: Number(r.studentId),
        area: r.area,
        effectiveness: Number(r.effectiveness),
        attitude: Number(r.attitude),
        focus: Number(r.focus),
        comments: r.comments,
        duration: Number(r.duration)
    }));
}
