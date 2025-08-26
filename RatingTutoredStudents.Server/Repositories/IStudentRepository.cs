using RatingTutoredStudents.Server.Models;

namespace RatingTutoredStudents.Server.Repositories
{
    public interface IStudentRepository
    {
        Task<List<Student>> GetAllStudents();
    }
}
