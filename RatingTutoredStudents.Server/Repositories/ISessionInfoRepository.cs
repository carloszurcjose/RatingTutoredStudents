using RatingTutoredStudents.Server.Models;
using System.Text;

namespace RatingTutoredStudents.Server.DataBase
{
    public interface ISessionInfoRepository
    {
        Task<String> getStudentNameById(int id);
        Task<SessionInfo> getStudentSessionsInfo(int id);
        Task<bool> addReport(SessionInfo sessionInfo, CancellationToken ct = default);
    }
}
