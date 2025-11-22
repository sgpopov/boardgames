export interface GameRepository<TGame> {
  list(): Promise<TGame[]>;
  getById(id: string): Promise<TGame | undefined>;
  save(game: TGame): Promise<void>;
  delete(id: string): Promise<void>;
}
