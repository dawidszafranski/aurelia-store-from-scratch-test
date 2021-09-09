import { IReducer } from "./store-lib";

export type InitState = {
	word: string;
}

export enum Actions {
	REVERSE_WORD,
	SET_WORD,
}

export const initState: InitState = {
	word: "okay!",
}

export const reducer: IReducer<Actions, InitState> = (action, data, state) => {
	switch(action) {
		case Actions.REVERSE_WORD:
			return {...state, word: state.word.split("").reverse().join("") }

		case Actions.SET_WORD: {
			const nData = data as { word: string };
			return { ...state, word: nData.word }
		}

		default:
			return { ...state }
	}
};