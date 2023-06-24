import { registerEnumType } from "@nestjs/graphql";

export enum KeynoteEnum {
  Original = 0,
  Male = 1,
  Female = 2,
}

registerEnumType(KeynoteEnum, {
  name: "KeynoteEnum",
});
