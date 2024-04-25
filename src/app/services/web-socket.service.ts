import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private websocket: WebSocket = new WebSocket(
    'ws://localhost:8080/project_management-2.0/websocket'
  );
  private messageSubject: Subject<MessageEvent>;

  constructor() {
    this.messageSubject = new Subject<MessageEvent>();
  }

  public connect(): Subject<MessageEvent> {
    this.websocket.onmessage = (event) => {
      this.messageSubject.next(event);
    };
    this.websocket.onclose = (event) => {
      console.log('WebSocket is closed');
    };

    return this.messageSubject;
  }

  sendMessage(message: string): void {
    this.websocket.send(message);
  }

  closeConnection(): void {
    if (this.websocket) {
      this.websocket.close();
    }
  }
}
