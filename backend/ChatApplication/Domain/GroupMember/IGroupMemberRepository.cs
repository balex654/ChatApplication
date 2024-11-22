using System;

namespace Domain.GroupMember;

public interface IGroupMemberRepository
{
    Task AddRange(IEnumerable<GroupMember> groupMembers);
}
