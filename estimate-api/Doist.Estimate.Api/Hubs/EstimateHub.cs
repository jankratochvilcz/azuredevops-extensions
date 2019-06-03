using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Doist.Estimate.Api.Entities;
using Doist.Estimate.Api.Hubs.Responses;
using Doist.Estimate.Api.Hubs.Requests;

namespace Doist.Estimate.Api.Hubs
{
    public class EstimateHub : Hub
    {
        private const string GroupUpdatedMessageName = "groupUpdated";
        private const string VotedMessageName = "voted";
        private const string RevealedMessageName = "revealed";
        private const string SwitchToWorkItemMessageName = "switched";
        private const string ScoreDataMessageName = "scored";
        private const string RefreshCommentsMessageName = "refreshComments";

        private static Dictionary<string, EstimationSession> groups = new Dictionary<string, EstimationSession>();

        public async Task Join(JoinRequest request)
        {
            if (!groups.ContainsKey(request.GroupName))
                groups.Add(request.GroupName, new EstimationSession());

            groups[request.GroupName].Users = groups[request.GroupName].Users.Where(x => x.UserId != request.UserId);

            await this.Groups.AddToGroupAsync(this.Context.ConnectionId, request.GroupName);

            groups[request.GroupName].Users = groups[request.GroupName].Users.Union(new[] { new EstimationUser
            {
                UserId = request.UserId,
                ConnectionId = this.Context.ConnectionId
            } });

            var response = new JoinResponse
            {
                GroupName = request.GroupName,
                PresentUserIds = groups[request.GroupName].Users.Select(x => x.UserId),
                ActiveWorkItemId = groups[request.GroupName].ActiveWorkItemId
            };

            await SendToGroup(GroupUpdatedMessageName, request, response);
        }

        public async Task Vote(VoteRequest request)
        {
            if (IsInvalidRequest(request))
                return;

            var response = new VoteResponse
            {
                GroupName = request.GroupName,
                UserId = request.UserId,
                Value = request.Value,
                WorkItemId = request.WorkItemId
            };

            await SendToGroup(VotedMessageName, request, response);
        }

        public async Task Reveal(RevealRequest request)
        {
            if (IsInvalidRequest(request))
                return;

            var response = new RevealResponse
            {
                GroupName = request.GroupName,
                UserId = request.UserId,
                WorkItemId = request.WorkItemId
            };

            await SendToGroup(RevealedMessageName, request, response);
        }

        public async Task SwitchSelectedWorkItem(SwitchSelectedWorkItemRequest request)
        {
            if (IsInvalidRequest(request))
                return;

            groups[request.GroupName].ActiveWorkItemId = request.WorkItemId;

            var response = new SwitchSelectedWorkItemResponse
            {
                GroupName = request.GroupName,
                UserId = request.UserId,
                WorkItemId = request.WorkItemId
            };

            await SendToGroup(SwitchToWorkItemMessageName, request, response);
        }

        public async Task Score(ScoreRequest request)
        {
            if (IsInvalidRequest(request))
                return;

            var valueResult = decimal.TryParse(request.Value, out var valueParsed)
                ? valueParsed
                : (decimal?)null;

            var response = new ScoreResponse
            {
                GroupName = request.GroupName,
                WorkItemId = request.WorkItemId,
                Value = valueResult
            };

            await SendToGroup(ScoreDataMessageName, request, response);
        }

        public async Task RefreshComments(RefreshCommentsRequest request)
        {
            if (IsInvalidRequest(request))
                return;

            var response = new RefreshCommentsResponse
            {
                GroupName = request.GroupName,
                WorkItemId = request.WorkItemId,
            };

            await SendToGroup(RefreshCommentsMessageName, request, response);
        }

        private bool IsInvalidRequest(RequestBase request)
            => !groups.TryGetValue(request.GroupName, out var session) || !session.Users.Any(x => x.UserId == request.UserId);

        private Task SendToGroup<TResponse>(string messageName, RequestBase request, TResponse response) where TResponse : class
            => Clients.Group(request.GroupName).SendCoreAsync(messageName, new[] { response });
    }
}
