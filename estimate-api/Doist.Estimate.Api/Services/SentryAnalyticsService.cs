using Sentry;
using System;

namespace Doist.Estimate.Api.Services
{
    public class SentryAnalyticsService : IAnalyticsService
    {
        public void LogException(Exception ex)
            => SentrySdk.CaptureException(ex);
    }
}
