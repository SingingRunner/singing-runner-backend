import { registerEnumType } from "@nestjs/graphql";

export enum characterEnum {
  BELUGA = "beluga",
  PUMA = "puma",
  HUSKY = "husky",
  HARE = "hare",
  LYNX = "lynx",
  SNOWLEOPARD = "snowleopard",
  NARWHAL = "narwhal",
  PUFFIN = "puffin",
  MOOSE = "moose",
}

registerEnumType(characterEnum, {
  name: "characterEnum",
});
