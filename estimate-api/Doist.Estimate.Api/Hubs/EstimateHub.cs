﻿using Microsoft.AspNetCore.SignalR;
using System;
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
        private static Dictionary<string, IEnumerable<EstimationUser>> groups = new Dictionary<string, IEnumerable<EstimationUser>>();

        public async Task Join(JoinRequest request)
        {
            if (!groups.ContainsKey(request.GroupName))
                groups.Add(request.GroupName, Enumerable.Empty<EstimationUser>());

            groups[request.GroupName] = groups[request.GroupName].Where(x => x.UserId != request.UserId);

            await this.Groups.AddToGroupAsync(this.Context.ConnectionId, request.GroupName);

            groups[request.GroupName] = groups[request.GroupName].Union(new[] { new EstimationUser
            {
                UserId = request.UserId,
                ConnectionId = this.Context.ConnectionId
            } });

            var response = new JoinResponse
            {
                GroupName = request.GroupName,
                PresentUserIds = groups[request.GroupName].Select(x => x.UserId)
            };

            await Clients.Group(request.GroupName).SendCoreAsync("user_joined", new[] { response });
        }
    }
}