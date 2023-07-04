import { UserMatchDto } from "src/user/dto/user.match.dto";

export interface MatchInfoDto {
  accept: boolean;
  userMatchDto: UserMatchDto;
}
