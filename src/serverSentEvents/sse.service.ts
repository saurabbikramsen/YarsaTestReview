import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  private sseSubject = new Subject<string>();

  send(message: string) {
    this.sseSubject.next(message);
    return { message: `${message} message sent successfully` };
  }

  stream() {
    return this.sseSubject.asObservable();
  }
}
