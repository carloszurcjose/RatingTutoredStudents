using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RatingTutoredStudents.Server.Data;
using System.Linq;

namespace RatingTutoredStudents.Server.Controllers
{
    [ApiController]
    [Route("sessioninfo/")]
    public class SessionInfoController: ControllerBase
    {
        AppDbContext _context;
        public SessionInfoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("student/")]
        public async Task<IActionResult> GetStudentInfo( int studentId)
        {
            var studentInfo = await _context.SessionInfos
                .Where(c => c.StudentId == studentId)  // NOTE: == not =
                .ToListAsync();

            return Ok(studentInfo);
        }
    }
}