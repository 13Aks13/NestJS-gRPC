import { Observable } from 'rxjs';

export interface Message {
  content: string;
}

export type Empty = object;

export interface ChatService {
  sendMessage(data: Message): Observable<Empty>;
}
