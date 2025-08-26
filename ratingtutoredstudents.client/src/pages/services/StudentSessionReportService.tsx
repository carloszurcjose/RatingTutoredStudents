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