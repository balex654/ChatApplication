using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.User
{
    public class User
    {
        public string Id { get; set; }
        public string? Username { get; set; }
        public string? ConnectionId { get; set; }
        public ICollection<Message.Message> Messages { get; set; }
        public ICollection<Domain.GroupMember.GroupMember> GroupMembers { get; set; }
    }
}
