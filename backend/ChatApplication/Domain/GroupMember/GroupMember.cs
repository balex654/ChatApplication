using System;

namespace Domain.GroupMember;

public class GroupMember
{
    public string UserId { get; set; }
    public int GroupChatId { get; set; }
    public User.User User { get; set; }
    public GroupChat.GroupChat GroupChat { get; set; }
}
