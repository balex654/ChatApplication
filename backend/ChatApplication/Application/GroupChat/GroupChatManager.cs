using Application.GroupMember;
using Domain.GroupChat;
using DGroupChat = Domain.GroupChat;
using DGroupMember = Domain.GroupMember;

namespace Application.GroupChat;

public interface IGroupChatManager
{
    Task AddGroupChat(DGroupChat.GroupChat groupChat, IEnumerable<Domain.User.User> users);
    Task<IEnumerable<DGroupChat.GroupChat>> GetGroupChatsForUser(string userId);
}

public class GroupChatManager : IGroupChatManager
{
    private readonly IGroupChatRepository _groupChatRepository;
    private readonly IGroupMemberManager _groupMemberManager;

    public GroupChatManager(
        IGroupChatRepository groupChatRepository,
        IGroupMemberManager groupMemberManager
    )
    {
        _groupChatRepository = groupChatRepository;
        _groupMemberManager = groupMemberManager;
    }

    public async Task AddGroupChat(DGroupChat.GroupChat groupChat, IEnumerable<Domain.User.User> users)
    {
        await _groupChatRepository.Add(groupChat);
        var groupMembers = new List<DGroupMember.GroupMember>();
        foreach (var u in users) {
            groupMembers.Add(new DGroupMember.GroupMember {
                GroupChatId = groupChat.Id,
                UserId = u.Id
            });
        }
        await _groupMemberManager.AddGroupMembers(groupMembers);
    }

    public Task<IEnumerable<DGroupChat.GroupChat>> GetGroupChatsForUser(string userId)
    {
        return _groupChatRepository.GetChatsForUser(userId);
    }
}
