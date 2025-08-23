import type { Student } from "../../types/Student"

async function getStudentsFromDb() {
    const response = await fetch("https://localhost:7137/Students/GetAllStudents");
    if (!response.ok) {
        throw new Error("Failed to fetch students");
    }
    return await response.json();
}

export async function getStudents(): Promise<Student[]> {
    const raw = await getStudentsFromDb();

    return raw.map((r: any) => ({
        id: r.id,
        first_name: r.first_name,
        last_name: r.last_name,
    }));
}
