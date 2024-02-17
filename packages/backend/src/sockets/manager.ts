import WebSocket from 'ws';
import { Message, MessageType } from './types.js';
import { fileManegerService } from '@/modules/file-manager/file-manager.service.js';

const users = new Map<number, WebSocket>();

const createMessageHandler = (id: number) => (data: WebSocket.RawData) => {
  console.log(`client (${id}): ${data.toString()}`);
};
const createDisconnectHandler = (id: number) => (code: number, reason: Buffer) => {
  socketManager.removeUser(id);
};
const createOpenHandler = (id: number) => () => {};
const createErrorHandler = (id: number) => (err: Error) => {};

const addUser = (id: number, socket: WebSocket) => {
  socket.on('message', createMessageHandler(id));
  socket.on('close', createDisconnectHandler(id));
  socket.on('open', createOpenHandler(id));
  socket.on('error', createErrorHandler(id));

  users.set(id, socket);
};

const removeUser = (id: number) => {
  const userSocket = users.get(id);
  if (userSocket) {
    userSocket.close();
    userSocket.removeAllListeners();
    users.delete(id);
  }
};
const sendMessageToClient = (id: number, message: Message) => {
  const userSocket = users.get(id);
  if (userSocket) {
    const data = JSON.stringify(message);
    userSocket.send(data);
  }
};

const sendUploadListToClient = async (id: number) => {
  const uploads = await fileManegerService.getUploadList(id);
  sendMessageToClient(id, { type: MessageType.UPLOAD_LIST, payload: uploads });
};

export const socketManager = {
  addUser,
  removeUser,
  sendUploadListToClient,
};
