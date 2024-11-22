namespace Domain.Message
{
    public class Message
    {
        public int Id { get; set; }
        public string FromUserId { get; set; }
        public string FromUsername { get; set; }
        public User.User FromUser { get; set; }
        public string ToUserId { get; set; }
        public User.User? ToUser { get; set; }
        public DateTime Date { get; set; }
        public string Body { get; set; }
        public string ToConnectionId { get; set; }
        public int? GroupChatId { get; set; }
        public Domain.GroupChat.GroupChat? GroupChat { get; set; }
    }
}
