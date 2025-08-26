using Microsoft.EntityFrameworkCore;
using RatingTutoredStudents.Server.Data;
using RatingTutoredStudents.Server.Models;

namespace RatingTutoredStudents.Server.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        AppDbContext _context;
        public StudentRepository (AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<Student>> GetAllStudents()
        {
            return await _context.Students.ToListAsync();
        }

    }
}
