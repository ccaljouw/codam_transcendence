import { UserProfileDto } from '@ft_dto/users';

export class GameResultDto {
	id: number;

  // for now only username, we can exand with more userinfo if needed. (Also created endpoint to get info based on username)
  user1Name: string;

  user2Name: string;

  // array with two numers first number is score for user1, second number score for user2
  score: number[];

  win: boolean;
}
