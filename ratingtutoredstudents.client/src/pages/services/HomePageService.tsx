import Student from "../../types/Student"

async function getStudentsFromDb() {
    const response = await fetch("https://localhost:7137/Students/GetAllStudents");
    if (!response.ok) {
        throw new Error("Failed to fetch students");
    }
    return await response.json();
}

export async function getStudents(): Promise<Student[]> {
    const raw = await getStudentsFromDb()


}