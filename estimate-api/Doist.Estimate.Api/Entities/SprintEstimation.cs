using Newtonsoft.Json;
using System.Collections.Generic;

namespace Doist.Estimate.Api.Entities
{
    public class SprintEstimation
    {
        [JsonProperty("sprintId")]
        public string SprintId { get; }

        [JsonProperty("userIds")]
        public IEnumerable<string> UserIds { get; }

        [JsonProperty("activeWorkItemId")]
        public int? ActiveWorkItemId { get; }

        [JsonProperty("isActiveWorkItemRevealed")]
        public bool IsActiveWorkItemRevealed { get; }

        [JsonProperty("activeWorkItemScores")]
        public IDictionary<string, string> ActiveWorkItemScores { get; }

        [JsonProperty("comittedNumericalScore")]
        public decimal? ComittedNumericalScore { get; set; }

        public SprintEstimation(
            string sprintId,
            IEnumerable<string> userIds,
            int? activeWorkItemId,
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
