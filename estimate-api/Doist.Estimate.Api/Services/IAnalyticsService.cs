using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Doist.Estimate.Api.Services
{
    public interface IAnalyticsService
    {
        void LogException(Exception ex);
    }
}
