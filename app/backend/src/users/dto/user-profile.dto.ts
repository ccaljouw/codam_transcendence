import { IntersectionType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { UpdateUserStateDto } from "./update-userState.dto";

export class UserProfileDto extends IntersectionType(CreateUserDto, UpdateUserStateDto) {
  // Retreves properties from both User and UserState
}
