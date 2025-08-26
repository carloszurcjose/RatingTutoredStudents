using RatingTutoredStudents.Server.Models;
using System.Text;

namespace RatingTutoredStudents.Server.DataBase
{
    public interface ISessionInfoRepository
    {
        Task<String> getStudentNameById(int id);
        Task<List<SessionInfo>> getStudentSessionInfo(int id);
    }
}
