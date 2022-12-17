export enum EventCategory {
  /**
   * The volume of the TV has changed
   */
  VOLUME_CHANGED,
  /**
   * The selected channel on the TV has changed
   */
  CHANNEL_CHANGED,
  /**
   * The power state of the TV has changed
   */
  POWER_STATE_CHANGED,
  /**
   * The TV channel history has changed
   */
  CHANNEL_HISTORY_CHANGED,
  /**
   * The app running in the foreground on the TV has changed
   */
  FOREGROUND_APP_CHANGED,
  /**
   * An automation rule has been added to the system
   */
  AUTOMATION_RULE_ADDED,
  /**
   * An automation rule of the system has been modified
   */
  AUTOMATION_RULE_MODIFIED,
  /**
   * An automation rule has been deleted
   */
  AUTOMATION_RULE_REMOVED,
}
