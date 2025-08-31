using RatingTutoredStudents.Server.Models;

namespace RatingTutoredStudents.Server.Repositories
{
    public interface IStudentInfoRepository
    {
        Task<bool> addStudent(StudentInfo studentInfo, CancellationToken ct = default);
        Task<List<StudentInfo>> getAllStudents();
    }
}
