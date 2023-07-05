import { useQuery } from 'react-query'
import { useLocation, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { IGetData, IGetPerson, getSearchMovie, getSearchPerson, getSearchTv } from '../api'
import ContentSlider from '../Components/ContentSlider'
import { AnimatePresence, useScroll } from 'framer-motion'
import ContentModal from '../Components/ContentModal'

import PersonSlider from '../Components/PersonSlider'
import { useEffect, useState } from 'react'
import PersonModal from '../Components/PersonModal'
import { Helmet } from 'react-helmet-async'
import Loader from '../Components/Loader'

const Wrapper = styled.div`
	background-color: black;
	padding-bottom: 200px;
`
const InnerWrapper = styled.div`
	margin-top: 60px;
`

const SearchKeyword = styled.h1`
	font-size: 32px;
	padding: 60px;
`

const Search = () => {
	const location = useLocation()
	const keyword = new URLSearchParams(location.search).get('keyword')

	const {
		data: movieData,
		isLoading: isMovieLoading,
		refetch: movieRefetch
	} = useQuery<IGetData>(['search', 'searchMovie'], () => getSearchMovie(keyword))

	const {
		data: tvData,
		isLoading: isTvLoading,
		refetch: tvRefetch
	} = useQuery<IGetData>(['search', 'searchTv'], () => getSearchTv(keyword))

	const {
		data: personData,
		isLoading: isPersonLoading,
		refetch: personRefetch
	} = useQuery<IGetPerson>(['search', 'searchPerson'], () => getSearchPerson(keyword))

	const bigSearchMatch = useRouteMatch<{ id: string }>('/search/:id')

	const { scrollY } = useScroll()

	const allSearchData = [...(movieData?.results || []), ...(tvData?.results || [])]
	const [clickPerson, setClickPerson] = useState(false)

	useEffect(() => {
		movieRefetch()
		tvRefetch()
		personRefetch()
	}, [keyword, movieRefetch, tvRefetch, personRefetch])
	return (
		<Wrapper>
			<Helmet>
				<title>Netflix | {keyword}</title>
			</Helmet>
			<InnerWrapper>
				<SearchKeyword>Search for '{keyword}'</SearchKeyword>

				{isMovieLoading ? (
					<Loader />
				) : movieData ? (
					<div onClick={() => setClickPerson(false)}>
						<ContentSlider subject="movieData" data={movieData} title="Movies" />
					</div>
				) : null}

				{isTvLoading ? (
					<Loader />
				) : tvData ? (
					<div onClick={() => setClickPerson(false)}>
						<ContentSlider subject="tvData" data={tvData} title="Tv Shows" />
					</div>
				) : null}

				{isPersonLoading ? (
					<Loader />
				) : personData ? (
					<div onClick={() => setClickPerson(true)}>
						<PersonSlider subject="person" data={personData} title="Person" />
					</div>
				) : null}
			</InnerWrapper>

			<AnimatePresence>
				{bigSearchMatch && !clickPerson ? (
					<ContentModal
						allData={allSearchData}
						bigMatch={bigSearchMatch}
						Y={scrollY.get()}
					/>
				) : null}
				{bigSearchMatch && clickPerson ? (
					<PersonModal
						allData={personData?.results || []}
						bigMatch={bigSearchMatch}
						Y={scrollY.get()}
					/>
				) : null}
			</AnimatePresence>
		</Wrapper>
	)
}

export default Search
