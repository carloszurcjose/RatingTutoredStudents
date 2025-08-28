using RatingTutoredStudents.Server.DataBase;
using RatingTutoredStudents.Server.Models;
using RatingTutoredStudents.Server.Repositories;

namespace RatingTutoredStudents.Server.Services
{
    public class StudentInfoService
    {
        IStudentInfoRepository _repository;
        public StudentInfoService(IStudentInfoRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> addStudent(StudentInfo studentInfo)
        {
            return await _repository.addStudent(studentInfo);
        }
    }
}
