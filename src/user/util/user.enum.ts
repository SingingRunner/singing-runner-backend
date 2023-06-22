import { registerEnumType } from "@nestjs/graphql";

export enum userKeynoteStatus {
  ORIGINAL_KEY = 0,
  FEMALE_KEY = 1,
  MALE_KEY = 2,
}

registerEnumType(userKeynoteStatus, {
  name: "userKeynoteStatus",
});

export enum userActiveStatus {
  CONNECT = 0,
  LOGOUT = 1,
  IN_GAME = 2,
}
