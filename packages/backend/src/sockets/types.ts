export enum MessageType {
  UPLOAD_LIST = 'UPLOAD_LIST',
}
export type Message = {
  type: MessageType;
  payload: Record<string, any>;
};
