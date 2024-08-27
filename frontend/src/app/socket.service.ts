import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { APIService } from './apiservice';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket;

    constructor(private apiService: APIService) { }

    createSocket() {
        this.socket = io(this.apiService.HOST);
    }

    getMessages(): Observable<{ roomId: string, hurtRate: string, oxLvl: string }> {
        return new Observable(observer => {
            this.socket.on('receive', (data: { roomId: string, hurtRate: string, oxLvl: string }) => {
                observer.next(data);
            });
        });
    }

    closeSocket() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}
