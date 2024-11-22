using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.GroupMember;

public class GroupMemberETC : IEntityTypeConfiguration<Domain.GroupMember.GroupMember>
{
    public void Configure(EntityTypeBuilder<Domain.GroupMember.GroupMember> builder)
    {
        builder.HasKey(g => new { g.UserId, g.GroupChatId });

        builder.HasOne(g => g.GroupChat)
            .WithMany(g => g.GroupMembers)
            .HasForeignKey(g => g.GroupChatId)
            .IsRequired();

        builder.HasOne(g => g.User)
            .WithMany(u => u.GroupMembers)
            .HasForeignKey(g => g.UserId)
            .IsRequired();
    }
}
