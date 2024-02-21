import { chatModel } from "../models/chats.model.js";

export class ChatManagerDB {
  constructor() {
    this.model = chatModel;
  }

  async addChat(user, message) {
    try {
      const chat = await this.model.create({ user, message });
      return chat;
    } catch (error) {
      console.error("Error al añadir mensaje al chat", error);
      throw error;
    }
  }
}
