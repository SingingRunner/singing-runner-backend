import { Test } from "@nestjs/testing";
import { Invite } from "./invite";
import { HostUserDto } from "src/user/dto/host-user.dto";

describe("Invite", () => {
  let invite: Invite;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [Invite],
    }).compile();

    invite = moduleRef.get<Invite>(Invite);
  });

  describe("inviteFriend", () => {
    it("should add a new friend to the invite queue", () => {
      const host = new HostUserDto("1", "민규리");

      invite.inviteFriend("friend1", host);

      const inviteQueue = invite["inviteMap"].get("friend1");
      expect(inviteQueue).toBeDefined();
      expect(inviteQueue).toContain(host);
    });
  });

  describe("deleteInvite", () => {
    it("should delete an invite", () => {
      const host = new HostUserDto("1", "민규리");

      invite.inviteFriend("friend1", host);

      invite.deleteInvite("friend1");

      const inviteQueue = invite["inviteMap"].get("friend1");
      expect(inviteQueue).toBeUndefined();
    });
  });

  describe("cancelInvite", () => {
    it("should cancel an existing invite", () => {
      const host1 = new HostUserDto("1", "민규리");
      const host2 = new HostUserDto("2", "오민규");

      invite.inviteFriend("friend1", host1);
      invite.inviteFriend("friend1", host2);

      invite.cancleInvite("friend1", host2);

      const inviteQueue = invite["inviteMap"].get("friend1");
      expect(inviteQueue).toBeDefined();
      expect(inviteQueue).toContain(host1);
      expect(inviteQueue).not.toContain(host2);
    });
  });
});
