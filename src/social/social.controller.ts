import { Controller, Param, Sse } from "@nestjs/common";
import { SocialService } from "./social.service";
import { Observable, map } from "rxjs";

@Controller("social")
export class SocialController {
  constructor(private socialService: SocialService) {}

  @Sse("invite/:userId")
  invite(@Param("userId") userId: string): Observable<any> {
    console.log("SSE invite SUBSCRIPTION", userId);
    return this.socialService.inviteEvents(userId).pipe(
      map((event) => ({
        data: { host: event.host },
      }))
    );
  }

  @Sse("notification/:userId")
  notifictaion(@Param("userId") userId: string): Observable<any> {
    console.log("SSE Noti SUBSCRIPTION", userId);
    return this.socialService.notificationEvensts(userId).pipe(
      map((event) => ({
        data: { alarm: event.alarm },
      }))
    );
  }
}
