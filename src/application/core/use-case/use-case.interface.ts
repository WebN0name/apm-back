export interface IUseCase<TCommand, TOutput = TCommand> {
    execute(command: TCommand): Promise<TOutput>;
}

export interface IQueryHandler<TQuery, TResult = TQuery> {
    execute(query: TQuery): Promise<TResult>;
}