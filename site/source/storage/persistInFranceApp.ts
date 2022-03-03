import { Action } from '@/actions/actions'
import { InFranceAppState } from '@/reducers/inFranceAppReducer'
import { RootState } from '@/reducers/rootReducer'
import { Store } from 'redux'
import { debounce } from '../utils'
import * as safeLocalStorage from './safeLocalStorage'

const VERSION = 7

const LOCAL_STORAGE_KEY = 'mon-entreprise::persisted-infranceapp::v' + VERSION

export function setupInFranceAppPersistence(store: Store<RootState, Action>) {
	const listener = () => {
		const state = store.getState()
		safeLocalStorage.setItem(
			LOCAL_STORAGE_KEY,
			JSON.stringify(state.inFranceApp)
		)
	}
	store.subscribe(debounce(1000, listener))
}

export function retrievePersistedInFranceApp(): InFranceAppState {
	const serializedState = safeLocalStorage.getItem(LOCAL_STORAGE_KEY)
	return serializedState ? JSON.parse(serializedState) : undefined
}
