import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';
import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const nameLike = `%${param.toLowerCase()}%`;
    const games = await this.repository
      .createQueryBuilder("games")      
      .where("LOWER(games.title) like :title", { title: nameLike })
      .getMany();
    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`SELECT COUNT(*) FROM games`); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
   
    const game = await this.repository.createQueryBuilder("games")
      .select("games.title")
      .leftJoinAndSelect("games.users", "user")
      .where("games.id = :id" ,{id : id})
      .getOne();
      return game.users
  }
}
