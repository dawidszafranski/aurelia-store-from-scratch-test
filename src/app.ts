import { inlineView, inject } from "aurelia-framework";
import { Store } from "store-lib";
import { Actions, InitState } from "./store";

@inlineView("<template><h1>${_word}</h1><button click.delegate='reverseWord()'>click me!</button></template>")
@inject(Store)
export class App {
	public _word: string;
	public disposeStore: (() => boolean)[];

	constructor(
		private readonly store: Store<InitState, Actions>,
	) {
		this.disposeStore = [];
	}

	public bind(): void {
		const disposeToggle = this.store.observe((s) => s.word, this.onWordChange.bind(this));
		this.disposeStore.push(disposeToggle);
	}

	public dispose(): void {
		this.disposeStore.forEach(disposable => disposable());
	}

	public reverseWord(): void {
		this.store.dispatch(Actions.REVERSE_WORD);
	}

	private onWordChange(word: string): void {
		this._word = word;
	}
}
