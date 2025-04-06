export interface ChatMessage {
    userId: string | any;
    socketId?: string
    toId?: string
    fromId?: string
    username: string | undefined;
    message: string;
    from?: string
    type?: string
}

export interface ChatWindowProps {
    username: string | any;
    toId: string | any;
    currentUser?: string | any
    chatwith: string | any | undefined | null
    onClose: () => void;
    setMessages: any;
    fetchConversationHistory?: any
    messages: []
}

export type Message = {
    from: string;
    text: string;
    type?: "user" | "system"; // 👈
    timestamp?: string;
};
