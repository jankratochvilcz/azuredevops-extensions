using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Doist.Estimate.Api.Entities
{
    public class Estimate
    {
        public int WorkItemId { get; set; }

        public Guid SessionId { get; set; }

        public decimal EstimatedEffort { get; set; }

        public bool BlockingReason { get; set; }
    }
}
