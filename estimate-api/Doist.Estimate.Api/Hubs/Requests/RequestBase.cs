namespace Doist.Estimate.Api.Hubs.Requests
{
    public abstract class RequestBase
    {
        public string SprintId { get; set; }

        public string UserId { get; set; }
    }
}
