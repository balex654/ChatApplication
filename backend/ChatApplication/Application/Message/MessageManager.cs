using Domain.Message;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Message
{
    public interface IMessageManager
    {
        Task AddMessage(Domain.Message.Message message);
        Task<IEnumerable<Domain.Message.Message>> GetMessagesForChat(string firstUserId, string secondUserId);
        Task<IEnumerable<Domain.Message.Message>> GetGroupChatMessages(int groupId);
    }

    public class MessageManager : IMessageManager
    {
        private readonly IMessageRepository _messageRepository;

        public MessageManager(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }

        public async Task AddMessage(Domain.Message.Message message)
        {
            await _messageRepository.Add(message);
        }

        public async Task<IEnumerable<Domain.Message.Message>> GetMessagesForChat(string firstUserId, string secondUserId)
        {
            if (string.IsNullOrWhiteSpace(secondUserId))
            {
                return await _messageRepository.GetGlobalMessages();
            }
            return await _messageRepository.GetMessagesForChat(firstUserId, secondUserId);
        }

        public async Task<IEnumerable<Domain.Message.Message>> GetGroupChatMessages(int groupId)
        {
            return await _messageRepository.GetGroupChatMessages(groupId);
        }
    }
}
