using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Message
{
    public interface IMessageRepository
    {
        Task Add(Message message);
        Task<IEnumerable<Message>> GetMessagesForChat(string firstUserId, string secondUserId);
        Task<IEnumerable<Message>> GetGlobalMessages();
        Task<IEnumerable<Message>> GetGroupChatMessages(int groupId);
    }
}
