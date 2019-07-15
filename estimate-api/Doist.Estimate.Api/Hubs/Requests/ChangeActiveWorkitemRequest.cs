namespace Doist.Estimate.Api.Hubs.Requests
{
    public class ChangeActiveWorkItemRequest : RequestBase
    {
        public int? WorkItemId { get; set; }
    }
}
