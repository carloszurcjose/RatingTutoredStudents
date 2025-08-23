using Microsoft.EntityFrameworkCore;
using RatingTutoredStudents.Server.Models;

namespace RatingTutoredStudents.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) 
            : base(options) { }

        public DbSet<Student> Students => Set<Student>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Map Student entity to "students" table
            modelBuilder.Entity<Student>().ToTable("students");
        }

    }
}
