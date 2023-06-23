export const WebOSEndpoints = {
  CHANNEL_LIST: "ssap://tv/getChannelList",
  CURRENT_CHANNEL: "ssap://tv/getCurrentChannel",
  CHANNEL_PROGRAM_INFO: "ssap://tv/getChannelProgramInfo",
  CHANNEL_UP: "ssap://tv/channelUp",
  CHANNEL_DOWN: "ssap://tv/channelDown",
  OPEN_CHANNEL: "ssap://tv/openChannel",
  CURRENT_SOFTWARE_INFORMATION:
    "ssap://com.webos.service.update/getCurrentSWInformation",
  TURN_OFF_SYSTEM: "ssap://system/turnOff",
  POWER_STATE: "ssap://com.webos.service.tvpower/power/getPowerState",
  TURN_ON_SCREEN: "ssap://com.webos.service.tvpower/power/turnOnScreen",
  TURN_OFF_SCREEN: "ssap://com.webos.service.tvpower/power/turnOffScreen",
  GET_SOUND_OUTPUT: "ssap://audio/getSoundOutput",
  SET_SOUND_OUTPUT: "ssap://audio/setSoundOutput",
  PAUSE_PLAYBACK: "ssap://media.controls/pause",
  START_PLAYBACK: "ssap://media.controls/play",
  FAST_FORWARD_PLAYBACK: "ssap://media.controls/fastForward",
  REWIND_PLAYBACK: "ssap://media.controls/rewind",
  GET_VOLUME: "ssap://audio/getVolume",
  SET_VOLUME: "ssap://audio/setVolume",
  VOLUME_UP: "ssap://audio/volumeUp",
  VOLUME_DOWN: "ssap://audio/volumeDown",
  SET_MUTE: "ssap://audio/setMute",
  INSERT_TEXT: "ssap://com.webos.service.ime/insertText",
  DELETE_CHARACTERS: "ssap://com.webos.service.ime/deleteCharacters",
  SEND_ENTER_KEY: "ssap://com.webos.service.ime/sendEnterKey",
  LIST_APPS: "ssap://com.webos.applicationManager/listApps",
  FOREGROUND_APP_INFO:
    "ssap://com.webos.applicationManager/getForegroundAppInfo",
  LIST_LAUNCH_POINTS: "ssap://com.webos.applicationManager/listLaunchPoints",
  LAUNCH_APP: "ssap://com.webos.applicationManager/launch",
};
