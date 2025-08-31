using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RatingTutoredStudents.Server.Data;
using RatingTutoredStudents.Server.Models;
using RatingTutoredStudents.Server.Services;
using System.Linq;

namespace RatingTutoredStudents.Server.Controllers
{
    [ApiController]
    [Route("sessioninfo/")]
    public class SessionController: ControllerBase
    {
        SessionInfoService _service;
        public SessionController(SessionInfoService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("student/")]
        public async Task<IActionResult> GetStudentInfo( int studentId)
        {
            var studentInfo = await _service.getStudentSessionsInfo(studentId);

            return Ok(studentInfo);
        }

        [HttpGet]
        [Route("GetStudentName/")]
        public async Task<IActionResult> GetStudentName(int studentId)
        {
            var studentName = await _service.getNameByStudentId(studentId);
            return Ok(new { name = studentName });
        }

        [HttpPost]
        [Route("StudentSessionReport/")]
        public async Task<bool> GetStudentReport([FromBody] SessionInfo sessionInfo)
        {
            Console.WriteLine(sessionInfo.ToString());
            return await _service.addReport(sessionInfo);
        }
    }
}