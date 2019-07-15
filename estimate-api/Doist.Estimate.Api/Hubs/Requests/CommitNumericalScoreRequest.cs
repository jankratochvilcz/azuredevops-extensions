namespace Doist.Estimate.Api.Hubs.Requests
{
    public class CommitNumericalScoreRequest : RequestBase
    {
        public decimal? Score { get; set; }

        public int WorkItemId { get; set; }
    }
}
