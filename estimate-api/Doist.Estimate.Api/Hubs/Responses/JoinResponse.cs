using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Doist.Estimate.Api.Hubs.Responses
{
    public class JoinResponse
    {
        [JsonProperty("group_name")]
        public string GroupName { get; set; }

        [JsonProperty("present_user_ids")]
        public IEnumerable<string> PresentUserIds { get; set; }
    }
}
