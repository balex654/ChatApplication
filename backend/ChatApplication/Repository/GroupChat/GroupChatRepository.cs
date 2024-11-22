using System;
using Domain.GroupChat;
using Microsoft.EntityFrameworkCore;

namespace Repository.GroupChat;

public class GroupChatRepository : IGroupChatRepository
{
    private readonly ChatDbContext _context;

    public GroupChatRepository(ChatDbContext context)
    {
        _context = context;
    }

    public async Task Add(Domain.GroupChat.GroupChat groupChat)
    {
        await _context.AddAsync(groupChat);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Domain.GroupChat.GroupChat>> GetChatsForUser(string userId)
    {
        return await _context.GroupChat.Where(gc => gc.GroupMembers.Any(gm => gm.UserId == userId)).ToListAsync();
    }
}
