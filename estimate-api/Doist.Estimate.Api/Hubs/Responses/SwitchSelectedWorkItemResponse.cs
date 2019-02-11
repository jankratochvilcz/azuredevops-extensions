using Newtonsoft.Json;

namespace Doist.Estimate.Api.Hubs.Responses
{
    public class SwitchSelectedWorkItemResponse
    {
        [JsonProperty("groupName")]
        public string GroupName { get; set; }

        [JsonProperty("userId")]
        public string UserId { get; set; }

        [JsonProperty("workItemId")]
        public int WorkItemId { get; set; }
    }
}
