using System.Collections.Generic;

namespace Doist.Estimate.Api.Entities
{
    public class SprintEstimation
    {
        public string SprintId { get; }

        public IEnumerable<string> UserIds { get; }

        public string ActiveWorkItemId { get; }

        public bool IsActiveWorkItemRevealed { get; }

        public IDictionary<string, string> ActiveWorkItemScores { get; }

        public decimal? ComittedNumericalScore { get; set; }

        public SprintEstimation(
            string sprintId,
            IEnumerable<string> userIds,
            string activeWorkItemId,
            bool isActiveWorkItemRevealed,
            IDictionary<string, string> activeWorkItemScores,
            decimal? comittedScore)
        {
            SprintId = sprintId;
            UserIds = userIds;
            ActiveWorkItemId = activeWorkItemId;
            IsActiveWorkItemRevealed = isActiveWorkItemRevealed;
            ActiveWorkItemScores = activeWorkItemScores;
            ComittedNumericalScore = comittedScore;
        }
    }
}
