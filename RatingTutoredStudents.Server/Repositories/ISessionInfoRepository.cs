using System.Text;

namespace RatingTutoredStudents.Server.DataBase
{
    public interface ISessionInfoRepository
    {
        Task<String> getStudentNameById(int id);
    }
}
