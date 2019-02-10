namespace Doist.Estimate.Api.Hubs.Requests
{
    public class VoteRequest
    {
        public string GroupName { get; set; }

        public string UserId { get; set; }

        public string Value { get; set; }

        public string WorkItemId { get; set; }
    }
}
