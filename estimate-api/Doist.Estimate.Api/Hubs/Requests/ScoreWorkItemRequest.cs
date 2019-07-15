namespace Doist.Estimate.Api.Hubs.Requests
{
    public class ScoreWorkItemRequest : RequestBase
    {
        public string Score { get; set; }

        public int WorkItemId { get; set; }
    }
}
