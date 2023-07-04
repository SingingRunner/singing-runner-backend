export enum GameRoomStatus {
  IN_GAME = "inGame",
  MATCHING = "matching",
}

export enum UserMatchTier {
  BRONZE = 1000,
  SILVER = 2000,
  GOLD = 3000,
  PLATINUM = 4000,
  DIAMOND = 5000,
}

export enum Message {
  MATCH_MAKING = "match_making",
  ACCEPT = "accept",
  LOADING = "loading",
  GAME_READY = "game_ready",
  USE_ITEM = "use_item",
  GET_ITEM = "get_item",
  GAME_MODE = "game_mode",
  ESCAPE_ITEM = "escape_item",
  SCORE = "score",
  GAME_TERMINATED = "game_terminated",
  INVITE = "invite",
  CREATE_CUSTOM = "create_custom",
  SET_SONG = "set_song",
  LEAVE_ROOM = "leave_room",
  CUSTOM_START = "custom_start",
  LOAD_REPLAY = "load_replay",
  START_REPLAY = "start_replay",
}