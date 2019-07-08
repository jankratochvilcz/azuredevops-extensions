using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using Doist.Estimate.Api.Entities;
using Sentry;

namespace Doist.Estimate.Api.Services
{
    public class SprintEstimationService
        : ISprintEstimationService
    {
        private readonly ConcurrentDictionary<string, SprintEstimation> cache
            = new ConcurrentDictionary<string, SprintEstimation>();

        public Task<SprintEstimation> JoinSprintEstimation(
            string sprintId,
            string userId)
        {
            var result = cache.AddOrUpdate(
                sprintId,
                x => new SprintEstimation(
                    x,
                    new[] { userId },
                    null,
                    false,
                    ImmutableDictionary<string, string>.Empty,
                    null),
                (x, existingEstimation) => new SprintEstimation(
                    x,
                    existingEstimation.UserIds
                        .Union(new[] { userId })
                        .Distinct()
                        .ToList(),
                    existingEstimation.ActiveWorkItemId,
                    existingEstimation.IsActiveWorkItemRevealed,
                    existingEstimation.ActiveWorkItemScores,
                    existingEstimation.ComittedNumericalScore));

            return Task.FromResult(result);
        }

        public Task<bool> HasUserJoinedSprintEstimation(
            string sprintId,
            string userId)
            => Task.FromResult(
                cache.TryGetValue(sprintId, out var sprintEstimation) && sprintEstimation.UserIds.Contains(userId));

        public Task<SprintEstimation> ChangeActiveWorkItem(
            string sprintId,
            int? workItemId)
            => UpdateSprintEstimation(
                sprintId,
                estimation => new SprintEstimation(
                    estimation.SprintId,
                    estimation.UserIds,
                    workItemId,
                    false,
                    ImmutableDictionary<string, string>.Empty,
                    estimation.ComittedNumericalScore));

        public Task<SprintEstimation> ScoreWorkItem(
            string sprintId,
            int workItemId,
            string userId,
            string score)
            => UpdateSprintEstimation(
                sprintId,
                estimation => new SprintEstimation(
                    estimation.SprintId,
                    estimation.UserIds,
                    estimation.ActiveWorkItemId,
                    estimation.IsActiveWorkItemRevealed,
                    estimation.ActiveWorkItemScores
                        .Where(x => x.Key != userId)
                        .Union(new Dictionary<string, string>
                        {
                            { userId, score }
                        })
                        .ToDictionary(x => x.Key, x => x.Value),
                    estimation.ComittedNumericalScore),
                estimation =>
                    estimation.ActiveWorkItemId == workItemId &&
                    estimation.UserIds.Contains(userId) &&
                    !estimation.IsActiveWorkItemRevealed);

        public Task<SprintEstimation> RevealWorkItemScores(
            string sprintId,
            int workItemId)
            => UpdateSprintEstimation(
                sprintId,
                estimation => new SprintEstimation(
                    estimation.SprintId,
                    estimation.UserIds,
                    estimation.ActiveWorkItemId,
                    true,
                    estimation.ActiveWorkItemScores,
                    estimation.ComittedNumericalScore),
                estimation => 
                    estimation.ActiveWorkItemId == workItemId &&
                    estimation.ActiveWorkItemScores.Any());

        public Task<SprintEstimation> CommitNumericalScore(
            string sprintId,
            int workItemId,
            decimal? numericalScore)
            => UpdateSprintEstimation(
                sprintId,
                estimation => new SprintEstimation(
                    estimation.SprintId,
                    estimation.UserIds,
                    estimation.ActiveWorkItemId,
                    estimation.IsActiveWorkItemRevealed,
                    estimation.ActiveWorkItemScores,
                    numericalScore),
                estimation =>
                    estimation.ActiveWorkItemId == workItemId &&
                    estimation.IsActiveWorkItemRevealed);

        private Task<SprintEstimation> UpdateSprintEstimation(
            string sprintId,
            Func<SprintEstimation, SprintEstimation> changedEstimationFactory,
            Func<SprintEstimation, bool> isValidUpdate = null)
        {
            if (cache.TryGetValue(sprintId, out var sprintEstimation))
            {
                if (isValidUpdate != null && !isValidUpdate(sprintEstimation))
                    throw new InvalidOperationException("The operation is not valid");

                var updatedSprintEstimation = changedEstimationFactory(sprintEstimation);

                var updateResult = cache.TryUpdate(sprintId, updatedSprintEstimation, sprintEstimation);

                if (updateResult)
                    return Task.FromResult(updatedSprintEstimation);
                else
                    throw new AccessViolationException("The cache was updated in a different place before save");
            }
            else
            {
                throw new InvalidOperationException("Sprint not found");
            }
        }
    }
}
