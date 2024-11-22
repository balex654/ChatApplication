using Application.Message;
using Domain.Message;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("Message")]
    public class MessageController : ControllerBase
    {
        private readonly IMessageManager _messageManager;

        public MessageController(IMessageManager messageManager)
        {
            _messageManager = messageManager;
        }

        [HttpPost]
        [Route("GetMessagesForChat")]
        public async Task<IEnumerable<Message>> GetMessagesForChat([FromBody] GetMessageForChatQuery query)
        {
            return await _messageManager.GetMessagesForChat(query.FirstUser, query.SecondUser);
        }

        [HttpGet]
        [Route("GetGroupChatMessages")]
        public async Task<IEnumerable<Message>> GetGroupChatMessages([FromQuery] int groupId) {
            return await _messageManager.GetGroupChatMessages(groupId);
        }
    }

    public class GetMessageForChatQuery
    {
        public string FirstUser { get; set; }
        public string SecondUser { get; set; }
    }
}
