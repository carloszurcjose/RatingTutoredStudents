import type { StudentInformationType } from "../../types/StudentInformationType"
import StudentInformation from "../StudentInformation";

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

export async function getStudentsSessionInfo(student_id: number): Promise<StudentInformationType> {
    const raw = await getStudentsSessionInfoFromDb(student_id);
    const name = await getStudentName(student_id);

    //name: String;
    //student_id: number;
    //area: string;
    //effectiveness: number;
    //attitude: number;
    //focus: number;
    //strategies_used: String;
    //comments: string;
    //duration: number;

    var student: StudentInformationType = {
        name: name.name,
        student_id : student_id,
        area: raw.area,
        effectiveness: raw.effectiveness,
        attitude: raw.attitude,
        focus: raw.focus,
        strategies_used: raw.strategiesUsed,
        comments: raw.comments,
        duration: raw.duration
    }
    return student;
}
