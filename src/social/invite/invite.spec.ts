import { describe } from "node:test";
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

  describe("hasInvitation", () => {
    it("초대를 받지 못한 유저", () => {
      expect(invite.hasInvitation("boo")).toBe(false);
    });

    it("초대가 온 유저 ", () => {
      const host = new HostUserDto("1", "민규리");

      invite.inviteFriend("friend1", host);
      expect(invite.hasInvitation("friend1")).toBe(true);
    });
  });

  describe("getAllinvitation", () => {
    it("초대리스트를 전부 반환", () => {
      const host1 = new HostUserDto("1", "민규리1");
      const host2 = new HostUserDto("2", "민규리2");
      invite.inviteFriend("friend", host1);
      invite.inviteFriend("friend", host2);

      const invitationList: HostUserDto[] = invite.getAllInvitation("friend");

      expect(invitationList[0].getNickname()).toBe("민규리1");
      expect(invitationList[1].getNickname()).toBe("민규리2");
    });

    it("초대리스트 반환후 맵에서 삭제되어야함", () => {
      const host1 = new HostUserDto("1", "민규리1");
      const host2 = new HostUserDto("2", "민규리2");
      invite.inviteFriend("friend", host1);
      invite.inviteFriend("friend", host2);

      invite.getAllInvitation("friend");

      expect(invite.hasInvitation("friend")).toBe(false);
    });

    it("초대리스트 반환후 다시 초대가 올떄 맵이 생성되어야함", () => {
      const host1 = new HostUserDto("1", "민규리1");
      const host2 = new HostUserDto("2", "민규리2");
      invite.inviteFriend("friend", host1);
      invite.inviteFriend("friend", host2);

      invite.getAllInvitation("friend");
      invite.inviteFriend("friend", host1);

      expect(invite.hasInvitation("friend")).toBe(true);
    });
  });
});
