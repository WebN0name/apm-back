import { Expose } from 'class-transformer';

export abstract class Entity<TId> {
  @Expose()
  public id: TId;
}
