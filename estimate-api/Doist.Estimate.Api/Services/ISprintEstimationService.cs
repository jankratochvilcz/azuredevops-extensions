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
            string workItemId);

        Task<SprintEstimation> RevealWorkItemScores(
            string sprintId,
            string workItemId);

        Task<SprintEstimation> ScoreWorkItem(
            string sprintId,
            string workItemId,
            string userId,
            string score);

        Task<SprintEstimation> CommitNumericalScore(
            string sprintId,
            string workItemId,
            decimal score);
    }
}
