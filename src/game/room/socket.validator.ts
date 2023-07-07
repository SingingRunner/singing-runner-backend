import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class SocketValidator {
  private socketMap: Map<string, Socket> = new Map();

  public setSocket(userId: string, socket: Socket) {
    this.socketMap.set(userId, socket);
    socket.on("disconnect", () => {
      this.socketMap.delete(userId);
    });
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

  public getSocket(userId: string): Socket {
    const socket: Socket | undefined = this.socketMap.get(userId);
    if (socket === undefined) {
      throw new Error("Socket not found");
    }
    return socket;
  }
}
