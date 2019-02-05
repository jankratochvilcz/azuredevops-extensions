using Newtonsoft.Json;

namespace Doist.Estimate.Api.Hubs.Responses
{
    public class VoteResponse
    {
        [JsonProperty("groupName")]
        public string GroupName { get; set; }

        [JsonProperty("userId")]
        public string UserId { get; set; }

        [JsonProperty("value")]
        public string Value { get; set; }
    }
}
