using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Repository
{
    public class ChatDbContext : DbContext
    {
        public ChatDbContext(DbContextOptions<ChatDbContext> options) : base(options)
        {
            
        }

        public DbSet<Domain.User.User> User { get; set; }
        public DbSet<Domain.Message.Message> Message { get; set; }
        public DbSet<Domain.GroupChat.GroupChat> GroupChat { get; set; }
        public DbSet<Domain.GroupMember.GroupMember> GroupMember { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            base.OnModelCreating(modelBuilder);
        }
    }
}
