using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace RatingTutoredStudents.Server.Models
{
    [Table("student_info")]
    public class StudentInfo
    {
        [Key]
        public int id { get; set; }
        [JsonPropertyName("first_name")]
        [Column("first_name")]
        public string? firstName { get; set; }
        [JsonPropertyName("last_name")]
        [Column("last_name")]
        public string? lastName { get; set; }
        public int age { get; set; }
        public string? classification { get; set; }
        public string? major { get; set; }
        public float GPA { get; set; }
        public int motivation { get; set; }
        [JsonPropertyName("preferred_learning_style")]
        [Column("preferred_learning_style")]
        public string? perferedLearningStyle { get; set; }
        [JsonPropertyName("past_strategy_effectiveness")]
        [Column("past_strategy_effectiveness")]
        public string? pastStrategyEffectiveness { get; set; }
    }
}
