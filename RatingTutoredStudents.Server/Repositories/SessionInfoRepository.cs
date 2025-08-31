using Microsoft.EntityFrameworkCore;
using RatingTutoredStudents.Server.Data;
using RatingTutoredStudents.Server.Models;
using System.Collections.Immutable;
using System.Linq;

namespace RatingTutoredStudents.Server.DataBase
{
    public class SessionInfoRepository : ISessionInfoRepository
    {
        AppDbContext _context;
        public SessionInfoRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task<bool> addReport(SessionInfo sessionInfo)
        {
            throw new NotImplementedException();
        }

        public async Task<String> getStudentNameById(int studentId)
        {
            var name = await _context.StudentInfos
                .AsNoTracking()
                .Where(c => c.id == studentId)
                .Select(c => new { FullName = ((c.firstName ?? "") + " " + (c.lastName ?? "")).Trim() })
                .FirstOrDefaultAsync();

            return name.FullName;

        }

        public async Task<SessionInfo> getStudentSessionsInfo(int id)
        {
            var studentInfos = await _context.SessionInfos
                .Where(c => c.StudentId == id)
                .ToListAsync();

            // Handle "no sessions" gracefully
            if (studentInfos.Count == 0)
            {
                return new SessionInfo
                {
                    StudentId = id,
                    StrategiesUsed = "",
                    Area = "",
                    Effectiveness = 0,
                    Attitude = 0,
                    Focus = 0,
                    Duration = 0
                };
            }

            // Helper to normalize strings and avoid null keys
            static string Norm(string? s) => string.IsNullOrWhiteSpace(s) ? "Unknown" : s.Trim();

            var bestStrategy = new SessionInfo
            {
                Id = studentInfos[0].Id,
                StudentId = studentInfos[0].StudentId
            };

            var learningStyles = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
            {
                ["Scaffolding"] = 0,
                ["SocraticQuestioning"] = 0,
                ["ActiveRecall"] = 0,
                ["SpacedRepetition"] = 0,
                ["Visualization"] = 0,
                ["WorkedExamples"] = 0,
                ["PeerTeaching"] = 0,
                ["ErrorAnalysis"] = 0,
                ["Gamification"] = 0,
                ["RealWorldExamples"] = 0,
                ["Mixed"] = 0,
                ["Other"] = 0 // catch-all for unexpected values
            };

            var areas = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

            long totalEffectiveness = 0;
            long totalAttitude = 0;
            long totalFocus = 0;
            long totalDuration = 0;
            int numEntries = 0;

            foreach (var s in studentInfos)
            {
                // --- strategies ---
                var strat = Norm(s.StrategiesUsed);
                if (learningStyles.ContainsKey(strat))
                    learningStyles[strat]++;
                else
                    learningStyles["Other"]++;

                // --- areas ---
                var area = Norm(s.Area);
                areas[area] = areas.TryGetValue(area, out var count) ? count + 1 : 1;

                // --- integer fields (averages) ---
                totalEffectiveness += s.Effectiveness;
                totalAttitude += s.Attitude;
                totalFocus += s.Focus;
                totalDuration += s.Duration;

                numEntries++;
            }

            // --- pick most-used strategies (ties allowed), ignore zero-only case ---
            int maxStrat = learningStyles.Values.DefaultIfEmpty(0).Max();
            var topStrats = learningStyles
                .Where(kv => kv.Value == maxStrat && kv.Value > 0)
                .Select(kv => kv.Key);

            // --- pick most-used areas (ties allowed), ignore zero-only case ---
            int maxArea = areas.Values.DefaultIfEmpty(0).Max();
            var topAreas = areas
                .Where(kv => kv.Value == maxArea && kv.Value > 0)
                .Select(kv => kv.Key);

            bestStrategy.StrategiesUsed = string.Join(", ", topStrats);
            bestStrategy.Area = string.Join(", ", topAreas);

            // --- averages (integer) ---
            if (numEntries > 0)
            {
                bestStrategy.Effectiveness = (int)(totalEffectiveness / numEntries);
                bestStrategy.Attitude = (int)(totalAttitude / numEntries);
                bestStrategy.Focus = (int)(totalFocus / numEntries);
                bestStrategy.Duration = (int)(totalDuration / numEntries);
            }
            // put this after the foreach and before 'return bestStrategy;'
            var latestComment = studentInfos
                .OrderByDescending(s => s.Id) // or a Date field if you have it
                .Select(s => s.Comments)
                .FirstOrDefault(c => !string.IsNullOrWhiteSpace(c));

            bestStrategy.Comments = latestComment ?? "";
            var topComments = studentInfos
                .Select(s => s.Comments)
                .Where(c => !string.IsNullOrWhiteSpace(c))
                .Select(c => c!.Trim())
                .GroupBy(c => c, StringComparer.OrdinalIgnoreCase)
                .OrderByDescending(g => g.Count())
                .ThenBy(g => g.Key) // stable order for ties
                .Take(3)
                .Select(g => $"{g.Key} (x{g.Count()})");

            bestStrategy.Comments = string.Join(" | ", topComments);


            var uniqueComments = studentInfos
                .Select(s => s.Comments)
                .Where(c => !string.IsNullOrWhiteSpace(c))
                .Select(c => c!.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            var joined = string.Join(" | ", uniqueComments);
            bestStrategy.Comments = joined.Length > 800 ? joined[..800] + "…" : joined;

            // Optional: cap to prevent huge strings written to DB/JSON
            // e.g., after computing averages and top areas/strategies
            bestStrategy.Comments = latestComment ?? ""; // or whichever approach you pick
            return bestStrategy;

        }


        public async Task<bool> addReport(SessionInfo sessionInfo, CancellationToken ct = default)
        {

            await _context.SessionInfos.AddAsync(sessionInfo, ct);
            var rows = await _context.SaveChangesAsync(ct);
            return rows > 0;

        }
    }
}