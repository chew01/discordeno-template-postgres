import { ApplicationCommandOption, ApplicationCommandTypes, DiscordenoInteraction, Permission } from "../../../deps.ts";
import { BotClient } from "../botClient.ts";
import { PermissionLevelHandlers } from "../../utils/permLevels.ts";

export interface Command {
  /** The name of the command.. */
  name: string;
  /** The description of the command. */
  description: string;
  /** The type of command. */
  type?: ApplicationCommandTypes;
  /** The options for the command. */
  options?: ApplicationCommandOption[];
  /** Whether or not this command is to be deployed globally. False by default. */
  global?: boolean;
  /** Whether or not this command is still in development and should be setup in the dev server for testing. */
  devOnly?: boolean;
  /** Whether or not this command will take longer than 3s and need to acknowledge to discord. */
  acknowledge?: boolean;
  /** Subcommands under this command. */
  subcommands?: Record<
    string,
    Omit<Command, "subcommands"> & { group?: string }
  >;
  /** Permission levels for which to enable this command. */
  permissionLevels?:
    | (keyof typeof PermissionLevelHandlers)[]
    | ((
      data: DiscordenoInteraction,
      command: Command,
    ) => boolean | Promise<boolean>);
  botServerPermissions?: Permission[];
  botChannelPermissions?: Permission[];
  userServerPermissions?: Permission[];
  userChannelPermissions?: Permission[];

  /** Function to be executed upon command call. */
  execute: (
    bot: BotClient,
    interaction: DiscordenoInteraction,
  ) => unknown;
}

export default Command;
