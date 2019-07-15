using Newtonsoft.Json;

namespace Doist.Estimate.Api.Hubs.Responses
{
    public class RefreshCommentsResponse
    {
        [JsonProperty("workItemId")]
        public int WorkItemId { get; set; }
    }
}
