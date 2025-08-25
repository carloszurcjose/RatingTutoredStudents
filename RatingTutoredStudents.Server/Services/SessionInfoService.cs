using RatingTutoredStudents.Server.DataBase;

namespace RatingTutoredStudents.Server.Services
{
    public class SessionInfoService
    {
        ISessionInfoRepository _repo;
        public SessionInfoService(ISessionInfoRepository iSessionInfoDB)
        { 
            _repo = iSessionInfoDB;
        }

        public async Task<string> getNameByStudentId(int student_id)
        {
            return await _repo.getStudentNameById(student_id);
        }
    }
}
