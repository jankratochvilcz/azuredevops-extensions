namespace Doist.Estimate.Api.Hubs.Requests
{
    public class CommitNumericalScoreRequest : RequestBase
    {
        public decimal? Score { get; set; }

        public string WorkItemId { get; set; }
    }
}
