using System;

namespace Domain.GroupChat;

public interface IGroupChatRepository
{
    Task Add(GroupChat groupChat);
    Task<IEnumerable<GroupChat>> GetChatsForUser(string userId);
}
