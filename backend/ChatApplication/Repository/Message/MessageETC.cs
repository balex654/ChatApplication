using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.Message
{
    public class MessageETC : IEntityTypeConfiguration<Domain.Message.Message>
    {
        public void Configure(EntityTypeBuilder<Domain.Message.Message> builder)
        {
            builder.Property(m => m.Id).ValueGeneratedOnAdd();
            builder.Ignore(m => m.ToConnectionId);

            builder.HasOne(m => m.FromUser)
                .WithMany()
                .HasForeignKey(m => m.FromUserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(m => m.ToUser)
                .WithMany()
                .HasForeignKey(m => m.ToUserId)
                .OnDelete(DeleteBehavior.NoAction)
                .IsRequired(false);

            builder.HasOne<Domain.User.User>()
                .WithMany()
                .HasForeignKey(m => m.FromUsername)
                .HasPrincipalKey(u => u.Username)
                .OnDelete(DeleteBehavior.NoAction)
                .IsRequired();

            builder.HasOne(m => m.GroupChat)
                .WithMany(g => g.Messages)
                .HasForeignKey(m => m.GroupChatId)
                .IsRequired(false);
        }
    }
}
