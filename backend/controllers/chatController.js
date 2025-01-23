import Chat from '../models/Chat.js';
import User from '../models/User.js';

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate('participants', 'name email')
      .populate('item', 'title images')
      .sort({ lastMessage: -1 });
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Error fetching chats' });
  }
};

export const createChat = async (req, res) => {
  try {
    const { itemId, participantId } = req.body;
    
    // Check if chat already exists
    const existingChat = await Chat.findOne({
      item: itemId,
      participants: { $all: [req.user.id, participantId] }
    });

    if (existingChat) {
      return res.json(existingChat);
    }

    const newChat = new Chat({
      participants: [req.user.id, participantId],
      item: itemId,
      messages: []
    });

    const savedChat = await newChat.save();
    const populatedChat = await Chat.findById(savedChat._id)
      .populate('participants', 'name email')
      .populate('item', 'title images');

    // Notify other participant through socket
    req.io.to(`user_${participantId}`).emit('new_chat', populatedChat);

    res.status(201).json(populatedChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Error creating chat' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    const chat = await Chat.findById(chatId)
      .populate('participants', 'name email');
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const message = {
      sender: req.user.id,
      content,
      createdAt: new Date(),
      read: false
    };

    chat.messages.push(message);
    chat.lastMessage = Date.now();
    await chat.save();

    // Populate the sender information
    const populatedMessage = {
      ...message,
      sender: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    };

    // Broadcast to all clients in the chat room
    req.io.to(`chat_${chatId}`).emit('new_message', {
      chatId,
      message: populatedMessage
    });

    // Log the emission
    console.log('Broadcasting message to chat:', chatId);

    res.json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Error sending message' });
  }
};

export const getChatById = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId)
            .populate('participants', 'name email')
            .populate('item', 'title images')
            .populate('messages.sender', 'name');
        
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        
        if (!chat.participants.includes(req.user.id)) {
            return res.status(403).json({ error: "Not authorized" });
        }
        
        res.json(chat);
    } catch (error) {
        res.status(500).json({ error: "Error fetching chat" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId)
            .populate('messages.sender', 'name');
        
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        
        if (!chat.participants.includes(req.user.id)) {
            return res.status(403).json({ error: "Not authorized" });
        }
        
        res.json(chat.messages);
    } catch (error) {
        res.status(500).json({ error: "Error fetching messages" });
    }
}; 