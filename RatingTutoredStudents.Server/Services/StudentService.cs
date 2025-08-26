using RatingTutoredStudents.Server.Data;
using RatingTutoredStudents.Server.Models;
using RatingTutoredStudents.Server.Repositories;

namespace RatingTutoredStudents.Server.Services
{
    public class StudentService
    {
        IStudentRepository _repo;
        public StudentService(IStudentRepository repo)
        {  
            _repo = repo; 
        }
        
        public async Task<List<Student>> GetAllStudents()
        {
            return await _repo.GetAllStudents();
        }
    }
}
