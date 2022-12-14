import { getRepository, Repository } from 'typeorm';

import { IFindUserByFullNameDTO, IFindUserWithGamesDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({user_id}: IFindUserWithGamesDTO): Promise<User> {
    // Complete usando ORM
    const user = await this.repository.createQueryBuilder()
      .select("users")
      .from(User,"users")
      .leftJoinAndSelect("users.games", "game")
      .where("users.id = :id", { id: user_id })
      .getOne()
    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("SELECT * FROM users ORDER BY first_name ASC"); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const firstName = first_name.toLowerCase();
    const lastName = last_name.toLowerCase();
    return this.repository.query("SELECT * FROM users WHERE LOWER(first_name)=$1 AND LOWER(last_name)=$2",[firstName, lastName]); // Complete usando raw query
  }
}
