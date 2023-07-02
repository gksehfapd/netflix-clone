const API_KEY = '8b6e8954befb534d18e45ec37eed0918'
const BASE_PATH = 'https://api.themoviedb.org/3'

export interface IData {
	id: number
	backdrop_path: string
	poster_path: string
	title: string
	overview: string
	vote_average: number
	genre_ids: number[]
	name: string
	media_type: string
}

export interface IKnown {
	genre_ids: number[]
	id: number
	original_title: string
	poster_path: string
	vote_average: number
	backdrop_path: string
	media_type: string
}

export interface IPerson {
	id: number
	name: string
	profile_path: string
	known_for: IKnown[]
}

export interface IGetData {
	dates?: {
		maximum: string
		minimum: string
	}
	page: number
	results: IData[]
	total_pages: number
	total_results: number
}

export interface IGetPerson {
	page: number
	results: IPerson[]
	total_pages: number
	total_results: number
}

export const getNowPlayingMovie = () => {
	return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then((res) => res.json())
}

export const getPopularMovies = () => {
	return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then((res) => res.json())
}

export const getTopRatedMovies = () => {
	return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then((res) => res.json())
}

export const getUpcomingMovies = () => {
	return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then((res) => res.json())
}

export const getMovieCast = (id: number) => {
	return fetch(`${BASE_PATH}/movie/${id}/credits?api_key=${API_KEY}`).then((res) => res.json())
}

export const getOnAirTv = () => {
	return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then((res) => res.json())
}

export const getAiringTv = () => {
	return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then((res) => res.json())
}

export const getPopularTv = () => {
	return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((res) => res.json())
}

export const getTopRatedTv = () => {
	return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then((res) => res.json())
}

export const getTvCast = (id: number) => {
	return fetch(`${BASE_PATH}/tv/${id}/credits?api_key=${API_KEY}`).then((res) => res.json())
}

export const getSearchMovie = (keyword: string | null) => {
	return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`).then((res) =>
		res.json()
	)
}

export const getSearchTv = (keyword: string | null) => {
	return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`).then((res) =>
		res.json()
	)
}

export const getKnownSearch = (dataId: number, mediaType: string) => {
	return fetch(`${BASE_PATH}/${mediaType}/${dataId}?api_key=${API_KEY}`).then((res) => res.json())
}

export const getSearchPerson = (keyword: string | null) => {
	return fetch(`${BASE_PATH}/search/person?api_key=${API_KEY}&query=${keyword}`).then((res) =>
		res.json()
	)
}
