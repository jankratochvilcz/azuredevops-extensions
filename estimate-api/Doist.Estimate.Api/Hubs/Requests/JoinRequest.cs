using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Doist.Estimate.Api.Hubs.Requests
{
    public class JoinRequest
    {
        public string GroupName { get; set; }

        public string UserId { get; set; }
    }
}
