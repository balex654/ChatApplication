using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.GroupChat;

public class GroupChatETC : IEntityTypeConfiguration<Domain.GroupChat.GroupChat>
{
    public void Configure(EntityTypeBuilder<Domain.GroupChat.GroupChat> builder)
    {
        builder.Property(g => g.Id).ValueGeneratedOnAdd();
    }
}
