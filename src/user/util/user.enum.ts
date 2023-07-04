import { registerEnumType } from "@nestjs/graphql";

export enum UserKeynoteStatus {
  ORIGINAL_KEY = 0,
  FEMALE_KEY = 1,
  MALE_KEY = 2,
}

registerEnumType(UserKeynoteStatus, {
  name: "userKeynoteStatus",
});

export enum UserActiveStatus {
  CONNECT = 0,
  LOGOUT = 1,
  IN_GAME = 2,
}
