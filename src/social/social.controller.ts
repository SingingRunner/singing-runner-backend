import { Controller, Param, Sse } from "@nestjs/common";
import { SocialService } from "./social.service";
import { Observable, map } from "rxjs";

@Controller("social")
export class SocialController {
  constructor(private socialService: SocialService) {}

  @Sse("/:userId")
  invite(@Param("userId") userId: string): Observable<any> {
    console.log("SSE SUBSCRIPTION");
    return this.socialService.inviteEvents(userId).pipe(
      map((event) => ({
        data: { host: event.host },
      }))
    );
  }
}
