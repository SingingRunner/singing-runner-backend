import { ConsoleLogger, Injectable } from "@nestjs/common";
import { HostUserDto } from "src/user/dto/host-user.dto";

@Injectable()
export class Invite {
  private inviteMap: Map<string, HostUserDto[]> = new Map();
  private logger = new ConsoleLogger();

  public inviteFriend(friendId: string, host: HostUserDto) {
    let inviteQueue = this.inviteMap.get(friendId);
    if (inviteQueue === null || inviteQueue === undefined) {
      inviteQueue = [];
      this.inviteMap.set(friendId, inviteQueue);
    }
    inviteQueue.push(host);
    this.logger.log(`${host.nickname} 가 ${friendId}를 초대했습니다.`);
  }

  public deleteInvite(userId: string) {
    this.inviteMap.delete(userId);
  }

  public cancleInvite(userId: string, host: HostUserDto) {
    let inviteQueue = this.inviteMap.get(userId);
    if (inviteQueue === null || inviteQueue === undefined) {
      throw new Error("userID is undefined or null");
    }
    inviteQueue = inviteQueue.filter(
      (hostInfo) => hostInfo.userId !== host.userId
    );
    this.inviteMap.set(userId, inviteQueue);
  }

  public hasInvitation(userId: string): boolean {
    return this.inviteMap.has(userId);
  }

  public getAllInvitation(userId: string): HostUserDto[] {
    const invitationList: HostUserDto[] | undefined =
      this.inviteMap.get(userId);
    if (invitationList === null || invitationList === undefined) {
      throw new Error("유저의 초대리스트가 비어있습니다.");
    }
    this.inviteMap.delete(userId);
    this.logger.log(`${userId}(이)가 초대를 받았습니다.`);
    return invitationList;
  }
}
