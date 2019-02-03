using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Doist.Estimate.Api.Hubs.Responses
{
    public class JoinResponse
    {
        [JsonProperty("groupName")]
        public string GroupName { get; set; }

        [JsonProperty("presentUserIds")]
        public IEnumerable<string> PresentUserIds { get; set; }
    }
}
