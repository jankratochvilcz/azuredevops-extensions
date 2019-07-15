using Doist.Estimate.Api.Services;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Doist.Estimate.Api.Test.Services
{
    public class SprintEstimationServiceTests
    {
        private const string DefaultSprintId = nameof(DefaultSprintId);
        private const string OtherSprintId = nameof(OtherSprintId);
        private const string DefaultUserId = nameof(DefaultUserId);
        private const string OtherUserId = nameof(OtherUserId);
        private const int DefaultWorkItemId = 1001;
        private const int OtherWorkItemId = 1002;
        private const string DefaultScore = nameof(DefaultScore);
        private const string OtherScore = nameof(OtherScore);
        private const decimal DefaultNumericalScore = 8008;

        #region JoinSprintEstimation

        [Fact]
        public async Task JoinSprintEstimation_SprintEstimationCreated()
        {
            var actual = await GetTarget().JoinSprintEstimation(
                DefaultSprintId,
                DefaultUserId);

            Assert.NotNull(actual);

            Assert.Equal(DefaultSprintId, actual.SprintId);

            Assert.Single(actual.UserIds);
            Assert.Equal(DefaultUserId, actual.UserIds.Single());

            Assert.Empty(actual.ActiveWorkItemScores);
            Assert.Null(actual.ActiveWorkItemId);
        }

        [Fact]
        public async Task JoinSprintEstimation_AlreadyJoined_DulplicityNotCreated()
        {
            var target = GetTarget();

            await target.JoinSprintEstimation(
                DefaultSprintId,
                DefaultUserId);

            var actual = await target.JoinSprintEstimation(
                DefaultSprintId,
                DefaultUserId);

            Assert.Single(actual.UserIds);
            Assert.Equal(DefaultUserId, actual.UserIds.Single());
        }

        #endregion

        #region HasUserJoinedSprintEstimation

        [Fact]
        public async Task HasUserJoinedSprintEstimation_UserAlreadyJoined_ReturnsTrue()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();

            var actual = await target.HasUserJoinedSprintEstimation(
                DefaultSprintId,
                DefaultUserId);

            Assert.True(actual);
        }

        [Fact]
        public async Task HasUserJoinedSprintEstimation_UseNotJoined_ReturnsFalse()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();

            var actual = await target.HasUserJoinedSprintEstimation(
                DefaultSprintId,
                OtherUserId);

            Assert.False(actual);
        }

        [Fact]
        public async Task HasUserJoinedSprintEstimation_SprintNotFound_ReturnsFalse()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();

            var actual = await target.HasUserJoinedSprintEstimation(
                OtherSprintId,
                DefaultUserId);

            Assert.False(actual);
        }

        [Fact]
        public async Task HasUserJoinedSprintEstimation_NoSprintsAdded_ReturnsFalse()
        {
            var target = GetTarget();

            var actual = await target.HasUserJoinedSprintEstimation(
                OtherSprintId,
                DefaultUserId);

            Assert.False(actual);
        }

        #endregion

        #region ChangeActiveWorkItem

        [Fact]
        public async Task ChangeActiveWorkItem_ValidOperation_ReturnsSprintEstimationWithNewActiveWorkItem()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();

            var actual = await target.ChangeActiveWorkItem(
                DefaultSprintId, 
                DefaultWorkItemId);

            Assert.Equal(DefaultWorkItemId, actual.ActiveWorkItemId);
        }

        [Fact]
        public async Task ChangeActiveWorkItem_SetsToNull_ReturnsSprintEstimationWithNull()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();

            var actual = await target.ChangeActiveWorkItem(
                DefaultSprintId,
                null);

            Assert.Null(actual.ActiveWorkItemId);
        }

        [Fact]
        public async Task ChangeActiveWorkItem_SetsToNullWithPreviousNotNull_ReturnsSprintEstimationWithNull()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();
            await target.ChangeActiveWorkItem(DefaultSprintId, DefaultWorkItemId);

            var actual = await target.ChangeActiveWorkItem(
                DefaultSprintId,
                null);

            Assert.Null(actual.ActiveWorkItemId);
        }

        [Fact]
        public async Task ChangeActiveWorkItem_SprintDoesNotExist_Throws()
            => await Assert.ThrowsAsync<InvalidOperationException>(
                async () => await (await GetTargetWithDefaultUserJoiningDefaultSprint())
                    .ChangeActiveWorkItem(OtherSprintId, DefaultWorkItemId));

        [Fact]
        public async Task ChangeActiveWorkItem_PreviousScoredItems_SetsToEmpty()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();
            await target.ChangeActiveWorkItem(DefaultSprintId, DefaultWorkItemId);

            await target.ScoreWorkItem(
                DefaultSprintId,
                DefaultWorkItemId,
                DefaultUserId,
                DefaultScore);

            var actual = await target.ChangeActiveWorkItem(DefaultSprintId, OtherWorkItemId);

            Assert.Empty(actual.ActiveWorkItemScores);
        }

        [Fact]
        public async Task ChangeActiveWorkItem_PreviousComittedScore_SetsToNull()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();
            await target.ChangeActiveWorkItem(DefaultSprintId, DefaultWorkItemId);
            await target.ScoreWorkItem(DefaultSprintId, DefaultWorkItemId, DefaultUserId, DefaultScore);
            await target.RevealWorkItemScores(DefaultSprintId, DefaultWorkItemId);

            await target.CommitNumericalScore(
                DefaultSprintId,
                DefaultWorkItemId,
                DefaultNumericalScore);

            var actual = await target.ChangeActiveWorkItem(DefaultSprintId, OtherWorkItemId);

            Assert.Null(actual.ComittedNumericalScore);
        }

        [Fact]
        public async Task ChangeActiveWorkItem_PreviousIsActiveWorkItemRevealed_SetsToFalse()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();
            await target.ChangeActiveWorkItem(DefaultSprintId, DefaultWorkItemId);
            await target.ScoreWorkItem(
                DefaultSprintId,
                DefaultWorkItemId,
                DefaultUserId,
                DefaultScore);

            await target.RevealWorkItemScores(DefaultSprintId, DefaultWorkItemId);

            var actual = await target.ChangeActiveWorkItem(DefaultSprintId, OtherWorkItemId);

            Assert.False(actual.IsActiveWorkItemRevealed);
        }

        #endregion

        #region ScoreWorkItem

        [Fact]
        public async Task ScoreWorkItem_NewScoreByUser_AddsScore()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();
            await target.ChangeActiveWorkItem(DefaultSprintId, DefaultWorkItemId);

            var actual = await target.ScoreWorkItem(
                DefaultSprintId,
                DefaultWorkItemId,
                DefaultUserId,
                DefaultScore);

            Assert.Single(actual.ActiveWorkItemScores);
            Assert.Equal(DefaultScore, actual.ActiveWorkItemScores.Single().Value);
            Assert.Equal(DefaultUserId, actual.ActiveWorkItemScores.Single().Key);
        }

        [Fact]
        public async Task ScoreWorkItem_DifferentScoreByUserExists_ScoreSwapped()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();
            await target.ChangeActiveWorkItem(DefaultSprintId, DefaultWorkItemId);

            await target.ScoreWorkItem(
                DefaultSprintId,
                DefaultWorkItemId,
                DefaultUserId,
                DefaultScore);

            var actual = await target.ScoreWorkItem(
                DefaultSprintId,
                DefaultWorkItemId,
                DefaultUserId,
                OtherScore);

            Assert.Single(actual.ActiveWorkItemScores);
            Assert.Equal(OtherScore, actual.ActiveWorkItemScores.Single().Value);
            Assert.Equal(DefaultUserId, actual.ActiveWorkItemScores.Single().Key);
        }

        [Fact]
        public async Task ScoreWorkItem_UserNotInEstimation_Throws()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();
            await target.ChangeActiveWorkItem(DefaultSprintId, DefaultWorkItemId);

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => target.ScoreWorkItem(
                    DefaultSprintId,
                    DefaultWorkItemId,
                    OtherUserId,
                    DefaultScore));
        }

        [Fact]
        public Task ScoreWorkItem_SprintDoesNotExist_Throws()
            => Assert.ThrowsAsync<InvalidOperationException>(
                () => GetTarget().ScoreWorkItem(
                    DefaultSprintId,
                    DefaultWorkItemId,
                    DefaultUserId,
                    DefaultScore));

        [Fact]
        public async Task ScoreWorkItem_WorkItemNotActive_Throws()
            => await Assert.ThrowsAsync<InvalidOperationException>(
                async () => await (await GetTargetWithDefaultUserJoiningDefaultSprint())
                    .ScoreWorkItem(
                        DefaultSprintId,
                        DefaultWorkItemId,
                        DefaultUserId,
                        DefaultScore));

        [Fact]
        public async Task ScoreWorkItem_WorkItemRevealed_Throws()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();
            await target.ChangeActiveWorkItem(DefaultSprintId, DefaultWorkItemId);

            await target.ScoreWorkItem(
                DefaultSprintId,
                DefaultWorkItemId,
                DefaultUserId,
                DefaultScore);

            await target.RevealWorkItemScores(DefaultSprintId, DefaultWorkItemId);

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => target.ScoreWorkItem(
                    DefaultSprintId,
                    DefaultWorkItemId,
                    DefaultUserId,
                    DefaultScore));
        }

        #endregion

        #region RevealWorkItemScores

        [Fact]
        public async Task RevealWorkItemScores_WorkItemRevealed()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();
            await target.ChangeActiveWorkItem(DefaultSprintId, DefaultWorkItemId);

            await target.ScoreWorkItem(
                DefaultSprintId,
                DefaultWorkItemId,
                DefaultUserId,
                DefaultScore);

            var actual = await target.RevealWorkItemScores(DefaultSprintId, DefaultWorkItemId);

            Assert.True(actual.IsActiveWorkItemRevealed);
        }

        [Fact]
        public async Task RevealWorkItemScores_NoScores_Throws()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();
            await target.ChangeActiveWorkItem(DefaultSprintId, DefaultWorkItemId);

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => target.RevealWorkItemScores(
                    DefaultSprintId,
                    DefaultWorkItemId));
        }

        [Fact]
        public Task RevealWorkItemScores_WorkItemNotActive_Throws()
            => Assert.ThrowsAsync<InvalidOperationException>(
                async () => await (await GetTargetWithDefaultUserJoiningDefaultSprint())
                    .RevealWorkItemScores(
                        DefaultSprintId,
                        DefaultWorkItemId));

        [Fact]
        public Task RevealWorkItemScores_SprintDoesNotExist_Throws()
            => Assert.ThrowsAsync<InvalidOperationException>(
                () => GetTarget().RevealWorkItemScores(
                    DefaultSprintId,
                    DefaultWorkItemId));

        #endregion

        #region CommitNumericalScore

        [Fact]
        public async Task CommitNumericalScore_ScoreComitted()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();
            await target.ChangeActiveWorkItem(DefaultSprintId, DefaultWorkItemId);
            await target.ScoreWorkItem(DefaultSprintId, DefaultWorkItemId, DefaultUserId, DefaultScore);
            await target.RevealWorkItemScores(DefaultSprintId, DefaultWorkItemId);

            var actual = await target.CommitNumericalScore(
                DefaultSprintId,
                DefaultWorkItemId,
                DefaultNumericalScore);

            Assert.Equal(DefaultNumericalScore, actual.ComittedNumericalScore);
        }

        [Fact]
        public async Task CommitNumericalScore_CommitNullWithoutReveal_ScoreComitted()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();
            await target.ChangeActiveWorkItem(DefaultSprintId, DefaultWorkItemId);
            await target.ScoreWorkItem(DefaultSprintId, DefaultWorkItemId, DefaultUserId, DefaultScore);

            var actual = await target.CommitNumericalScore(
                DefaultSprintId,
                DefaultWorkItemId,
                null);

            Assert.Equal(null, actual.ComittedNumericalScore);
        }

        [Fact]
        public async Task CommitNumericalScore_WorkItemNotRevealed_Throws()
        {
            var target = await GetTargetWithDefaultUserJoiningDefaultSprint();
            await target.ChangeActiveWorkItem(DefaultSprintId, DefaultWorkItemId);
            await target.ScoreWorkItem(DefaultSprintId, DefaultWorkItemId, DefaultUserId, DefaultScore);

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => target.CommitNumericalScore(
                    DefaultSprintId,
                    DefaultWorkItemId,
                    DefaultNumericalScore));
        }

        [Fact]
        public Task CommitNumericalScore_SprintDoesNotExist_Throws()
            => Assert.ThrowsAsync<InvalidOperationException>(
                () => GetTarget().CommitNumericalScore(
                    DefaultSprintId,
                    DefaultWorkItemId,
                    DefaultNumericalScore));

        #endregion

        private SprintEstimationService GetTarget()
            => new SprintEstimationService();

        private async Task<SprintEstimationService> GetTargetWithDefaultUserJoiningDefaultSprint()
        {
            var target = GetTarget();

            await target.JoinSprintEstimation(DefaultSprintId, DefaultUserId);

            return target;
        }
    }
}
