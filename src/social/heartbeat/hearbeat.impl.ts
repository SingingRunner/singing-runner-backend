import { Injectable } from "@nestjs/common";
import { HeartBeat } from "./hearbeat";
import { UserService } from "src/user/user.service";
import { userActiveStatus } from "src/user/util/user.enum";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class HeartBeatimpl implements HeartBeat {
  constructor(private userService: UserService) {}

  private heartBeatMap: Map<string, number> = new Map();

  @Cron("* * * * *")
  async updateHeartBeatMap() {
    console.log("updateHearbeatMap");
    console.log("hearBeatMap : ", this.heartBeatMap);
    const updateDate: number = Date.now();
    if (this.heartBeatMap.size === 0) {
      console.log("no login user!");
      return;
    }
    for (const userId of this.heartBeatMap.keys()) {
      const lastUpdateDate: number = this.getHeratbeatMap(userId);
      if (lastUpdateDate < updateDate - 50000) {
        await this.updateDB(userId);
        this.deleteHeartBeatMap(userId);
      }
    }
  }

  public setHeartBeatMap(userId: string, updateAt: number) {
    console.log("hearbeat set!!", userId);
    this.heartBeatMap.set(userId, updateAt);
  }

  public deleteHeartBeatMap(userId: string) {
    console.log("delete heartbeat");
    this.heartBeatMap.delete(userId);
  }

  public async updateDB(userId: string) {
    console.log("update!!!");
    await this.userService.updateUserActive(userId, userActiveStatus.LOGOUT);
  }

  private getHeratbeatMap(userId: string) {
    const updateDate: number | undefined = this.heartBeatMap.get(userId);
    if (updateDate === undefined) {
      throw new Error("Heartbeat에 map 에 해당 userId가 존재하지 않습니다");
    }
    return updateDate;
  }
}
