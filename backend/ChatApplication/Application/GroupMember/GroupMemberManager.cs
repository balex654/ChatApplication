using System;
using Domain.GroupMember;
using D = Domain.GroupMember;

namespace Application.GroupMember;

public interface IGroupMemberManager
{
    Task AddGroupMembers(IEnumerable<D.GroupMember> groupMembers);
}

public class GroupMemberManager : IGroupMemberManager
{
    private readonly IGroupMemberRepository _groupMemberRepository;

    public GroupMemberManager(IGroupMemberRepository groupMemberRepository)
    {
       _groupMemberRepository = groupMemberRepository;
    }

    public async Task AddGroupMembers(IEnumerable<D.GroupMember> groupMembers)
    {
        await _groupMemberRepository.AddRange(groupMembers);
    }
}
