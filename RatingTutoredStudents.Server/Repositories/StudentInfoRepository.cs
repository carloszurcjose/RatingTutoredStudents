using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using RatingTutoredStudents.Server.Data;
using RatingTutoredStudents.Server.Models;

namespace RatingTutoredStudents.Server.Repositories
{
    public class StudentInfoRepository : IStudentInfoRepository
    {
        AppDbContext _context;
        public StudentInfoRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<bool> addStudent(StudentInfo studentInfo, CancellationToken ct = default)
        {
            await _context.StudentInfos.AddAsync(studentInfo, ct);
            var rows = await _context.SaveChangesAsync(ct);
            return rows > 0;
        }

        public async Task<List<StudentInfo>> getAllStudents()
        {
            var Students = await _context.StudentInfos.ToListAsync();
            return Students;
        }
    }
}