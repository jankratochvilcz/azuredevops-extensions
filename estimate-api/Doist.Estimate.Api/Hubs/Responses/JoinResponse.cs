using Newtonsoft.Json;
using System.Collections.Generic;

namespace Doist.Estimate.Api.Hubs.Responses
{
    public class JoinResponse
    {
        [JsonProperty("groupName")]
        public string GroupName { get; set; }

        [JsonProperty("presentUserIds")]
        public IEnumerable<string> PresentUserIds { get; set; }

        [JsonProperty("activeWorkItemId")]
        public int? ActiveWorkItemId { get; set; }
    }
}
