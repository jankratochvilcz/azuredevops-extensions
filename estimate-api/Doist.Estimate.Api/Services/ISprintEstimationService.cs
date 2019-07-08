using Doist.Estimate.Api.Entities;
using System.Threading.Tasks;

namespace Doist.Estimate.Api.Services
{
    public interface ISprintEstimationService
    {
        Task<bool> HasUserJoinedSprintEstimation(
            string sprintId,
            string userId);

        Task<SprintEstimation> JoinSprintEstimation(
            string sprintId,
            string userId);

        Task<SprintEstimation> ChangeActiveWorkItem(
            string sprintId,
            int? workItemId);

        Task<SprintEstimation> RevealWorkItemScores(
            string sprintId,
            int workItemId);

        Task<SprintEstimation> ScoreWorkItem(
            string sprintId,
            int workItemId,
            string userId,
            string score);

        Task<SprintEstimation> CommitNumericalScore(
            string sprintId,
            int workItemId,
            decimal? score);
    }
}
