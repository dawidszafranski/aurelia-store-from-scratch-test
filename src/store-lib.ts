export type IReducer<TActions, TState> = (action: TActions, data: unknown, state: TState) => TState;

export class Store<TState, TActions> {
	private state: TState;
	private reducer: IReducer<TActions, TState>;
    private observerQueue: Map<string, { match: (state: TState) => unknown, callback: (newState: unknown, prevState: unknown) => void }>

	constructor(initialState: TState, reducer: IReducer<TActions, TState>) {
		this.state = initialState;
        this.reducer = reducer;
        this.observerQueue = new Map();
	}

	dispatch(action: TActions, data?: unknown): void {
        const newState = this.reducer(action, data, Object.assign({}, this.state));
        this.setStateNNotify(newState);
	}

    observe(match: (state: TState) => unknown, callback: (newState: unknown, prevState: unknown) => void): () => boolean {
        const key = new Date().toString();
        this.observerQueue.set(key, { match, callback });

        callback(match(this.state), undefined);
        return () => this.observerQueue.delete(key);
    }

    private setStateNNotify(newState: TState): void {
        const oldState = Object.assign({}, this.state);

        this.observerQueue.forEach((v) => {
            const matchOld = v.match(oldState);
            const matchNew = v.match(newState);

            if (matchOld.toString() !== matchNew.toString()) {
                v.callback(matchNew, matchOld);
            }
        });

        this.state = Object.assign({}, newState);
    }
}
