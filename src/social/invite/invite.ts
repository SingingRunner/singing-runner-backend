import { ConsoleLogger, Injectable } from "@nestjs/common";
import { Subject } from "rxjs";
import { HostUserDto } from "src/user/dto/host-user.dto";

@Injectable()
export class Invite {
  private inviteMap: Map<
    string,
    Subject<{ userId: string; host: HostUserDto }>
  > = new Map();
  private logger = new ConsoleLogger(Invite.name);

  public inviteFriend(friendId: string, host: HostUserDto) {
    if (!this.inviteMap.has(friendId)) {
      this.inviteMap.set(friendId, new Subject());
      return;
    }
    this.getHost(friendId).next({ userId: friendId, host: host });
    this.logger.log(`${host.nickname} 가 ${friendId}를 초대했습니다.`);
  }

  public inviteEvents(
    userId: string
  ): Subject<{ userId: string; host: HostUserDto }> {
    return this.getHost(userId);
  }

  public getHost(
    userId: string
  ): Subject<{ userId: string; host: HostUserDto }> {
    let host = this.inviteMap.get(userId);
    if (host === undefined) {
      this.inviteMap.set(userId, new Subject());
      host = this.inviteMap.get(userId)!;
    }
    return host;
  }
}
