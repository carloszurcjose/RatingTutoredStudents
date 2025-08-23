async functions getStudentsFromDb() {
    const response = await ("https://localhost:7137/Students/GetAllStudents");
    if (!response.ok) {
        throw new Error("Failed to fetch students");
    }
    return await response.json();
}

export async function getStudents() {
    const raw = await getStudentsFromDb()

}