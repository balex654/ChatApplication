using System;

namespace Domain.GroupChat;

public class GroupChat
{
    public int Id { get; set; }
    public string Name { get; set; }
    public ICollection<Message.Message> Messages { get; set; }
    public ICollection<GroupMember.GroupMember> GroupMembers { get; set; }
}
