using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.User
{
    public interface IUserRepository
    {
        Task Add(User user);
        Task Update(User user);
        Task<IEnumerable<User>> GetAll();
        Task<User?> GetById(string id);
        Task ClearConnectionId(string connectionId);
        Task<IEnumerable<User>> GetConnectedUsers();
        Task<User?> GetUserByConnectionId(string connectionId);
        Task<IEnumerable<User>> GetUsersForGroup(int groupId);
    }
}
