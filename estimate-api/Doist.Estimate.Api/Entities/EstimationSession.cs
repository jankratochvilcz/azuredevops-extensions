using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Doist.Estimate.Api.Entities
{
    public class EstimationSession
    {
        public IEnumerable<EstimationUser> Users { get; set; } = Enumerable.Empty<EstimationUser>();

        public int? ActiveWorkItemId { get; set; }
    }
}
