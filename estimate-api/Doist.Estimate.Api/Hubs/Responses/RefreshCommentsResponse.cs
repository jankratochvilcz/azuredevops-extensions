using Newtonsoft.Json;

namespace Doist.Estimate.Api.Hubs.Responses
{
    public class RefreshCommentsResponse
    {
        [JsonProperty("groupName")]
        public string GroupName { get; set; }

        [JsonProperty("workItemId")]
        public int WorkItemId { get; set; }
    }
}
