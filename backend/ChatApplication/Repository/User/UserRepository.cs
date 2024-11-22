using Domain.User;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.User
{
    public class UserRepository : IUserRepository
    {
        private readonly ChatDbContext _context;

        public UserRepository(ChatDbContext context)
        {
            _context = context;
        }

        public async Task Add(Domain.User.User user)
        {
            await _context.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Domain.User.User>> GetAll()
        {
            return await _context.User.ToListAsync();
        }

        public async Task<Domain.User.User?> GetById(string id)
        {
            return await _context.User.Where(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task Update(Domain.User.User user)
        {
            _context.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task ClearConnectionId(string connectionId)
        {
            var users = await _context.User.Where(user => user.ConnectionId == connectionId).ToListAsync();
            foreach (var user in users)
            {
                user.ConnectionId = null;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Domain.User.User>> GetConnectedUsers()
        {
            return await _context.User.Where(u => u.ConnectionId != null).ToListAsync();
        }

        public async Task<Domain.User.User?> GetUserByConnectionId(string connectionId)
        {
            return await _context.User.Where(u => u.ConnectionId == connectionId).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Domain.User.User>> GetUsersForGroup(int groupId)
        {
            return await _context.User.Join(
                _context.GroupMember,
                u => u.Id,
                gm => gm.UserId,
                (u, gm) => new { u, gm }
            )
            .Where(result => result.gm.GroupChatId == groupId)
            .Select(result => result.u)
            .ToListAsync();
        }
    }
}
