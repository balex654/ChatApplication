using Application.User;
using Domain.User;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("User")]
    public class UserController : ControllerBase
    {
        private readonly IUserManager _userManager;

        public UserController(IUserManager userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<User> GetUserById(string id)
        {
            return await _userManager.GetUserById(id);
        }

        [HttpPost]
        public async Task CreateUser([FromBody] User user)
        {
            await _userManager.AddUser(user);
        }

        [HttpGet]
        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _userManager.GetAllUsers();
        }

        [HttpPut]
        public async Task UpdateUser([FromBody] User user)
        {
            await _userManager.UpdateUser(user);
        }

        [HttpGet]
        [Route("GetConnectedUsers")]
        public async Task<IEnumerable<User>> GetConnectedUsers()
        {
            return await _userManager.GetConnectedUsers();
        }
    }
}
