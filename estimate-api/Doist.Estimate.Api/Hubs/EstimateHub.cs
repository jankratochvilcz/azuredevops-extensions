using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Doist.Estimate.Api.Entities;
using Doist.Estimate.Api.Hubs.Requests;
using Doist.Estimate.Api.Services;
using System;
using Doist.Estimate.Api.Hubs.Responses;

namespace Doist.Estimate.Api.Hubs
{
    public class SprintEstimationHub : Hub
    {
        private readonly ISprintEstimationService sprintEstimationService;
        private readonly IAnalyticsService analyticsService;

        public SprintEstimationHub(
            ISprintEstimationService sprintEstimationService,
            IAnalyticsService analyticsService)
        {
            this.sprintEstimationService = sprintEstimationService;
            this.analyticsService = analyticsService;
        }

        public async Task JoinSprintEstimation(JoinSprintEstimationRequest request)
        {
            var result = await sprintEstimationService.JoinSprintEstimation(
                request.SprintId, 
                request.UserId);

            await this.Groups.AddToGroupAsync(
                this.Context.ConnectionId, 
                result.SprintId);

            await SprintEstimationUpdated(result);
        }

        public Task ScoreWorkItem(ScoreWorkItemRequest request)
            => ExecuteSprintEstimationOperation(
                request,
                sprintEstimationService => sprintEstimationService.ScoreWorkItem(
                    request.SprintId,
                    request.WorkItemId,
                    request.UserId,
                    request.Score));

        public Task RevealWorkItemScores(RevealWorkItemScoresRequest request)
            => ExecuteSprintEstimationOperation(
                request,
                sprintEstimationService => sprintEstimationService.RevealWorkItemScores(
                    request.SprintId,
                    request.WorkItemId));

        public Task ChangeActiveWorkItem(ChangeActiveWorkitemRequest request)
            => ExecuteSprintEstimationOperation(
                request,
                sprintEstimationService => sprintEstimationService.ChangeActiveWorkItem(
                    request.SprintId,
                    request.WorkItemId));

        public Task CommitNumericalScore(CommitNumericalScoreRequest request)
            => ExecuteSprintEstimationOperation(
                request,
                sprintEstimationService => sprintEstimationService.CommitNumericalScore(
                    request.SprintId,
                    request.WorkItemId,
                    request.Score));

        public async Task RefreshComments(RefreshCommentsRequest request)
        {
            var response = new RefreshCommentsResponse
            {
                WorkItemId = request.WorkItemId
            };

            await Clients
                .Group(request.SprintId)
                .SendCoreAsync("refreshComments", new[] { response });
        }

        private async Task ExecuteSprintEstimationOperation<T>(
            T request,
            Func<ISprintEstimationService, Task<SprintEstimation>> operation)
            where T : RequestBase
        {
            if (!await sprintEstimationService.HasUserJoinedSprintEstimation(
                request.SprintId,
                request.UserId))
                return;

            try
            {
                var result = await operation(sprintEstimationService);
                await SprintEstimationUpdated(result);
            }
            catch (Exception ex)
            {
                analyticsService.LogException(ex);
            }
        }

        private Task SprintEstimationUpdated(SprintEstimation session) 
            => Clients
                .Group(session.SprintId)
                .SendCoreAsync("sprintEstimationUpdated", new[] { session });
    }
}
