using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RatingTutoredStudents.Server.Models
{
    [Table("session_info")]
    public class SessionInfo
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("student_id")]
        public int StudentId { get; set; }

        [Column("area")]
        public string? Area { get; set; }

        [Column("effectiveness")]
        public int Effectiveness { get; set; }

        [Column("attitude")]
        public int Attitude { get; set; }

        [Column("focus")]
        public int Focus { get; set; }

        [Column("strategies_used")]
        public string? StrategiesUsed { get; set; }

        [Column("comments")]
        public string? Comments { get; set; }


        // Make nullable if the DB allows NULLs: int?
        [Column("duration")]
        public int Duration { get; set; }
    }
}
