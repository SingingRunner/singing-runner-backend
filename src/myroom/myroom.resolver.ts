import { Resolver } from "@nestjs/graphql";
import { MyroomService } from "./myroom.service";

@Resolver()
export class MyroomResolver {
  constructor(private myroomService: MyroomService) {}
}
