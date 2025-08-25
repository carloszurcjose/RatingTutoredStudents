
using Microsoft.EntityFrameworkCore;
using RatingTutoredStudents.Server.Data;
using System.Linq;

namespace RatingTutoredStudents.Server.DataBase
{
    public class SessionInfoRepository : ISessionInfoRepository
    {
        AppDbContext _context;
        public SessionInfoRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<string> getStudentNameById(int studentId)
        {
            var rawJoin = await _context.SessionInfos
                .Join(
                _context.Students,
                session => session.StudentId,
                student => student.id,
                (session, student) => new
                {
                    fullName = student.first_name + " " + student.last_name
                }
                ).FirstOrDefaultAsync();

            return rawJoin.fullName;
            
        }
    }
}