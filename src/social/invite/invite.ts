import { Injectable } from "@nestjs/common";
import { HostUserDto } from "src/user/dto/host-user.dto";

@Injectable()
export class Invite {
  private inviteMap: Map<string, HostUserDto[]> = new Map();

  public inviteFriend(friendId: string, host: HostUserDto) {
    let inviteQueue = this.inviteMap.get(friendId);
    if (inviteQueue === null || inviteQueue === undefined) {
      inviteQueue = [];
      this.inviteMap.set(friendId, inviteQueue);
    }
    inviteQueue.push(host);
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
      (hostInfo) => hostInfo.getUserId() !== host.getUserId()
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
    return invitationList;
  }
}
