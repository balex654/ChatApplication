export interface Message {
    fromUserId: string,
    fromUsername: string,
    toUserId?: string,
    date: Date,
    body: string,
    toConnectionId?: string,
    groupChatId?: number
}