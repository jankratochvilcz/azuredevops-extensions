using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Doist.Estimate.Api.Entities;
using Doist.Estimate.Api.Hubs.Requests;
using Doist.Estimate.Api.Services;
using System;

namespace Doist.Estimate.Api.Hubs
{
    public class SprintEstimationHub : Hub
    {
        private readonly ISprintEstimationService sprintEstimationService;

        public SprintEstimationHub(
            ISprintEstimationService sprintEstimationService)
            => this.sprintEstimationService = sprintEstimationService;

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

        private async Task ExecuteSprintEstimationOperation<T>(
            T request,
            Func<ISprintEstimationService, Task<SprintEstimation>> operation)
            where T : RequestBase
        {
            if (!await sprintEstimationService.HasUserJoinedSprintEstimation(
                request.SprintId,
                request.UserId))
                return;

            var result = await operation(sprintEstimationService);

            await SprintEstimationUpdated(result);
        }

        private Task SprintEstimationUpdated(SprintEstimation session) 
            => Clients
                .Group(session.SprintId)
                .SendCoreAsync("sprintEstimationUpdated", new[] { session });
    }
}
