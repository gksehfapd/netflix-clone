import { atom } from 'recoil'
import { IMovie } from './api'

export const atomEventSub = atom({
	key: 'eventSub',
	default: ''
})

export const atomAllData = atom<IMovie[]>({
	key: 'allData',
	default: []
})
