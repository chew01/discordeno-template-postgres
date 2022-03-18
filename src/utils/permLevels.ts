import { DiscordenoInteraction, validatePermissions } from "../../deps.ts";
import { Command } from "../bot/types/command.ts";

export const PermissionLevelHandlers: Record<
  keyof typeof PermissionLevels,
  (payload: DiscordenoInteraction, command: Command) => boolean | Promise<boolean>
> = {
  MEMBER: () => true,
  MODERATOR: (payload) =>
    Boolean(payload.member?.permissions) &&
    validatePermissions(payload.member!.permissions!, ["MANAGE_GUILD"]),
  ADMIN: (payload) =>
    Boolean(payload.member?.permissions) &&
    validatePermissions(payload.member!.permissions!, ["ADMINISTRATOR"]),
  SERVER_OWNER: () => false,
  BOT_SUPPORT: () => false,
  BOT_DEVS: () => false,
  BOT_OWNERS: () => false,
};

export enum PermissionLevels {
  MEMBER,
  MODERATOR,
  ADMIN,
  SERVER_OWNER,
  BOT_SUPPORT,
  BOT_DEVS,
  BOT_OWNERS,
}
