using Domain.Message;
using Microsoft.EntityFrameworkCore;

namespace Repository.Message
{
    public class MessageRepository : IMessageRepository
    {
        private readonly ChatDbContext _context;

        public MessageRepository(ChatDbContext context)
        {
            _context = context;
        }

        public async Task Add(Domain.Message.Message message)
        {
            await _context.AddAsync(message);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Domain.Message.Message>> GetMessagesForChat(string firstUserId, string secondUserId)
        {
            return await _context.Message.Where(m =>
                (m.FromUserId == firstUserId && m.ToUserId == secondUserId) ||
                (m.FromUserId == secondUserId && m.ToUserId == firstUserId)).OrderBy(m => m.Date).ToListAsync();
        }

        public async Task<IEnumerable<Domain.Message.Message>> GetGlobalMessages()
        {
            return await _context.Message.Where(m => m.ToUserId == string.Empty).OrderBy(m => m.Date).ToListAsync();
        }

        public async Task<IEnumerable<Domain.Message.Message>> GetGroupChatMessages(int groupId)
        {
            return await _context.Message.Where(m => m.GroupChatId == groupId).OrderBy(m => m.Date).ToListAsync();
        }
    }
}
