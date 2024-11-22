using Api;
using Application.GroupChat;
using Application.GroupMember;
using Application.Message;
using Application.User;
using Domain.GroupChat;
using Domain.GroupMember;
using Domain.Message;
using Domain.User;
using Microsoft.Azure.SignalR;
using Microsoft.EntityFrameworkCore;
using Repository;
using Repository.GroupChat;
using Repository.GroupMember;
using Repository.Message;
using Repository.User;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", p =>
    {
        p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
// builder.Services.AddSignalR().AddAzureSignalR(options => {
//     options.Endpoints = [
//         new ServiceEndpoint("Endpoint=https://scrummybears.service.signalr.net;AccessKey=VPe01lAa4h+9b4BqOyTH5L7D3dKz8mmMoResIv+tXYo=;Version=1.0;")
//     ];
// });
//builder.Services.AddDbContext<ChatDbContext>(options => options.UseInMemoryDatabase("chat-application"));
builder.Services.AddDbContext<ChatDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserManager,  UserManager>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IMessageManager,  MessageManager>();
builder.Services.AddScoped<IGroupChatRepository, GroupChatRepository>();
builder.Services.AddScoped<IGroupChatManager, GroupChatManager>();
builder.Services.AddScoped<IGroupMemberRepository, GroupMemberRepository>();
builder.Services.AddScoped<IGroupMemberManager, GroupMemberManager>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ChatDbContext>();
    context.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

app.UseCors("AllowAll");

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<ChatHub>("/chatHub").RequireCors("AllowAll");
});

app.MapControllers();

app.Run();
