using System;
using Domain.GroupMember;

namespace Repository.GroupMember;

public class GroupMemberRepository : IGroupMemberRepository
{
    private readonly ChatDbContext _context;

    public GroupMemberRepository(ChatDbContext context)
    {
        _context = context;
    }

    public async Task AddRange(IEnumerable<Domain.GroupMember.GroupMember> groupMembers)
    {
        await _context.AddRangeAsync(groupMembers);
        await _context.SaveChangesAsync();
    }
}
