using Microsoft.AspNetCore.SignalR;
using Application.User;
using Domain.User;
using Domain.Message;
using Application.Message;

namespace Api
{
    public class ChatHub : Hub
    {
        private readonly IUserManager _userManager;
        private readonly IMessageManager _messageManager;

        public ChatHub(
            IUserManager userManager,
            IMessageManager messageManager)
        {
            _userManager = userManager;
            _messageManager = messageManager;
        }

        public async Task SendMessage(Message message)
        {
            await _messageManager.AddMessage(message);
            if (message.ToConnectionId != null)
            {
                await Clients.Client(message.ToConnectionId).SendAsync("ReceiveMessage", message);
            }
            if (message.GroupChatId != null) {
                var usersForGroup = (await _userManager.GetUsersForGroup(message.GroupChatId.Value)).Where(u => u.Id != message.FromUserId);
                await Clients.Clients(usersForGroup.Where(u => u.ConnectionId != null).Select(u => u.ConnectionId!)).SendAsync("ReceiveGroupMessage", message);
            }
        }

        public async Task BroadcastMessage(Message message)
        {
            await _messageManager.AddMessage(message);
            await Clients.All.SendAsync("ReceiveMessage", message);
        }

        public async Task UsernameChanged(Message message, string oldUsername, string newUsername, string? connectionId = null)
        {
            if (connectionId == null)
            {
                await Clients.All.SendAsync("UsernameChanged", oldUsername, newUsername);
            }
            else
            {
                await Clients.Client(connectionId).SendAsync("UsernameChanged", oldUsername, newUsername);
            }
            await _messageManager.AddMessage(message);
        }

        public async Task SendUserConnected()
        {
            var userConnected = await _userManager.GetUserByConnectionId(Context.ConnectionId);
            await Clients.All.SendAsync("UserConnected", userConnected);
        }

        public async Task SendUserTyping(User toUser, User fromUser)
        {
            await Clients.Client(toUser.ConnectionId).SendAsync("UserTyping", fromUser);
        }

        public async Task SendUserStoppedTyping(User toUser, User fromUser)
        {
            await Clients.Client(toUser.ConnectionId).SendAsync("UserStoppedTyping", fromUser);
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.Client(Context.ConnectionId).SendAsync("ConnectionEstablished", Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userDisconnected = await _userManager.GetUserByConnectionId(Context.ConnectionId);
            await Clients.All.SendAsync("UserDisconnected", userDisconnected);
            await _userManager.ClearConnectionId(Context.ConnectionId);
            await Clients.Client(Context.ConnectionId).SendAsync("Disconnected");
            await base.OnDisconnectedAsync(exception);
        }
    }
}
