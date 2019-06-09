namespace Doist.Estimate.Api.Hubs.Requests
{
    public class ScoreRequest : RequestBase
    {
        public string Value { get; set; }

        public int WorkItemId { get; set; }
    }
}
