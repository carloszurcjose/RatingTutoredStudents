using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RatingTutoredStudents.Server.Data;
using RatingTutoredStudents.Server.Services;
using System.Linq;

namespace RatingTutoredStudents.Server.Controllers
{
    [ApiController]
    [Route("sessioninfo/")]
    public class SessionInfoController: ControllerBase
    {
        SessionInfoService _service;
        public SessionInfoController(SessionInfoService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("student/")]
        public async Task<IActionResult> GetStudentInfo( int studentId)
        {
            var studentInfo = await _service.getStudentSessionInfo(studentId);

            return Ok(studentInfo);
        }

        [HttpGet]
        [Route("GetStudentName/")]
        public async Task<IActionResult> GetStudentName(int studentId)
        {
            var studentName = await _service.getNameByStudentId(studentId);
            return Ok(studentName);
        }
    }
}