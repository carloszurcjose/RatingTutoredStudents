using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RatingTutoredStudents.Server.Data;
using System.Threading.Tasks;

namespace RatingTutoredStudents.Server.Controllers
{
    [ApiController]
    [Route("Students/")]
    public class GetAllStudents : ControllerBase
    {
        AppDbContext _context;
        public GetAllStudents(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllStudents")]
        public async Task<IActionResult> Get()
        {
            var students = await _context.Students.ToListAsync();

            return Ok(students);
        }

    }
}
