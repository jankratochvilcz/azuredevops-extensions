﻿namespace Doist.Estimate.Api.Hubs.Requests
{
    public class VoteRequest : RequestBase
    {
        public string Value { get; set; }

        public int WorkItemId { get; set; }
    }
}
