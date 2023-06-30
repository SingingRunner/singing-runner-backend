import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class SocketValidator {
  private socketMap: Map<string, Socket> = new Map();

  public setSocket(userId: string, socket: Socket) {
    this.socketMap.set(userId, socket);
  }

  public deleteSocket(userId: string) {
    this.socketMap.get(userId)?.disconnect();
    this.socketMap.delete(userId);
  }

  public IsExistingSocket(userId: string): boolean {
    if (this.socketMap.get(userId) === undefined) {
      return false;
    }
    return true;
  }
}
