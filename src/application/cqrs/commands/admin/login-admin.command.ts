import { ICommand } from "@nestjs/cqrs";

export class LoginAdminCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}