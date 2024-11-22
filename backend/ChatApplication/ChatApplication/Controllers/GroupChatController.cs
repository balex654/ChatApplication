using System;
using Application.GroupChat;
using Domain.GroupChat;
using Domain.GroupMember;
using Domain.User;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route("GroupChat")]
public class GroupChatController : ControllerBase
{
    private readonly IGroupChatManager _groupChatManager;

    public GroupChatController(IGroupChatManager groupChatManager)
    {
        _groupChatManager = groupChatManager;
    }

    [HttpPost]
    public async Task CreateGroupChat([FromBody] CreateGroupChatRequest request) 
    {
        await _groupChatManager.AddGroupChat(request.groupChat, request.users);
    }

    [HttpGet("GetGroupChatsForUser")]
    public async Task<IEnumerable<GroupChat>> GetGroupChatsForUser([FromQuery] string userId) {
        return await _groupChatManager.GetGroupChatsForUser(userId);
    }
}

public class CreateGroupChatRequest
{
    public GroupChat groupChat { get; set; }
    public IEnumerable<User> users { get; set; }
}