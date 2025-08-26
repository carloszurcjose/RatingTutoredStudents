using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RatingTutoredStudents.Server.Data;
using RatingTutoredStudents.Server.Services;
using System.Threading.Tasks;

namespace RatingTutoredStudents.Server.Controllers
{
    [ApiController]
    [Route("Students/")]
    public class StudentsController : ControllerBase
    {
        StudentService _service;
        public StudentsController(StudentService service)
        {
            _service = service;
        }

        [HttpGet("GetAllStudents")]
        public async Task<IActionResult> Get()
        {
            var students = await _service.GetAllStudents();

            return Ok(students);
        }

    }
}
