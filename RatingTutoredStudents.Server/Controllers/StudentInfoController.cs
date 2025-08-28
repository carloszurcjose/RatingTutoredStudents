using Microsoft.AspNetCore.Mvc;
using RatingTutoredStudents.Server.Data;
using RatingTutoredStudents.Server.Models;
using RatingTutoredStudents.Server.Services;

namespace RatingTutoredStudents.Server.Controllers
{
    [ApiController]
    [Route("addstudent/")]
    public class StudentInfoController : ControllerBase
    {
        StudentInfoService _service;
        public StudentInfoController(StudentInfoService service)
        {
            _service = service;
        }

        [HttpPost]
        [Route("newstudent")]
        public async Task<IActionResult> AddNewStudent([FromBody] StudentInfo studentInfo)
        {
            var addStudent = await _service.addStudent(studentInfo);
            return Ok(addStudent);
        }
    }
}
