using Domain.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.User
{
    public interface IUserManager
    {
        Task AddUser(Domain.User.User user);
        Task UpdateUser(Domain.User.User user);
        Task<IEnumerable<Domain.User.User>> GetAllUsers();
        Task<Domain.User.User> GetUserById(string id);
        Task ClearConnectionId(string connectionId);
        Task<IEnumerable<Domain.User.User>> GetConnectedUsers();
        Task<Domain.User.User> GetUserByConnectionId(string connectionId);
        Task<IEnumerable<Domain.User.User>> GetUsersForGroup(int groupId);
    }

    public class UserManager : IUserManager
    {
        private readonly IUserRepository _userRepository;

        public UserManager(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task AddUser(Domain.User.User user)
        {
            await _userRepository.Add(user);
        }

        public async Task UpdateUser(Domain.User.User user)
        {
            await _userRepository.Update(user);
        }

        public async Task<IEnumerable<Domain.User.User>> GetAllUsers()
        {
            return await _userRepository.GetAll();
        }

        public async Task<Domain.User.User> GetUserById(string id)
        {
            return await _userRepository.GetById(id);
        }

        public async Task ClearConnectionId(string connectionId)
        {
            await _userRepository.ClearConnectionId(connectionId);
        }

        public async Task<IEnumerable<Domain.User.User>> GetConnectedUsers()
        {
            return await _userRepository.GetConnectedUsers();
        }

        public async Task<Domain.User.User> GetUserByConnectionId(string connectionId)
        {
            return await _userRepository.GetUserByConnectionId(connectionId);
        }

        public async Task<IEnumerable<Domain.User.User>> GetUsersForGroup(int groupId)
        {
            return await _userRepository.GetUsersForGroup(groupId);
        }
    }
}
