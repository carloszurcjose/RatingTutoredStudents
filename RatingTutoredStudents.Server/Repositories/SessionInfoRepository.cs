
using Microsoft.EntityFrameworkCore;
using RatingTutoredStudents.Server.Data;
using RatingTutoredStudents.Server.Models;
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

        public Task<bool> addReport(SessionInfo sessionInfo)
        {
            throw new NotImplementedException();
        }

        public async Task<String> getStudentNameById(int studentId)
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

        public async Task<List<SessionInfo>> getStudentSessionInfo(int id)
        {
            var studentInfo = await _context.SessionInfos
                .Where(c => c.StudentId == id)  // NOTE: == not =
                .ToListAsync();

            return studentInfo;
        }

        public async Task<bool> addReport(SessionInfo sessionInfo, CancellationToken ct = default)
        {

            await _context.SessionInfos.AddAsync(sessionInfo, ct);
            var rows = await _context.SaveChangesAsync(ct);
            return rows > 0;

        }
    }
}