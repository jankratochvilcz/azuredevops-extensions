using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Doist.Estimate.Api.Hubs.Responses
{
    public class RevealResponse
    {
        [JsonProperty("groupName")]
        public string GroupName { get; set; }

        [JsonProperty("userId")]
        public string UserId { get; set; }

        [JsonProperty("workItemId")]
        public int WorkItemId { get; set; }
    }
}
