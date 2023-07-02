import { useQuery } from 'react-query'
import { useLocation, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { IGetData, IGetPerson, getSearchMovie, getSearchPerson, getSearchTv } from '../api'
import SubjectCom from '../Components/SubjectCom'
import { AnimatePresence, useScroll } from 'framer-motion'
import Modal from '../Components/Modal'

import Person from '../Components/Person'
import { useState } from 'react'
import PersonModal from '../Components/PersonModal'
import { Helmet } from 'react-helmet-async'

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

const Loader = styled.div`
	height: 20vh;
	display: flex;
	justify-content: center;
	align-items: center;
`

const Search = () => {
	const location = useLocation()
	const keyword = new URLSearchParams(location.search).get('keyword')

	const { data: movieData, isLoading: isMovieLoading } = useQuery<IGetData>(
		['search', 'searchMovie'],
		() => getSearchMovie(keyword)
	)

	const { data: tvData, isLoading: isTvLoading } = useQuery<IGetData>(
		['search', 'searchTv'],
		() => getSearchTv(keyword)
	)

	const { data: personData, isLoading: isPersonLoading } = useQuery<IGetPerson>(
		['search', 'searchPerson'],
		() => getSearchPerson(keyword)
	)

	const bigSearchMatch = useRouteMatch<{ id: string }>('/search/:id')

	const { scrollY } = useScroll()

	const allSearchData = [...(movieData?.results || []), ...(tvData?.results || [])]
	const [clickPerson, setClickPerson] = useState(false)
	return (
		<Wrapper>
			<Helmet>
				<title>Netflix | {keyword}</title>
			</Helmet>
			<InnerWrapper>
				<SearchKeyword>Search for '{keyword}'</SearchKeyword>

				{isMovieLoading ? (
					<Loader>Loading..</Loader>
				) : movieData ? (
					<div onClick={() => setClickPerson(false)}>
						<SubjectCom subject="movieData" data={movieData} title="Movies" />
					</div>
				) : null}

				{isTvLoading ? (
					<Loader>Loading..</Loader>
				) : tvData ? (
					<div onClick={() => setClickPerson(false)}>
						<SubjectCom subject="tvData" data={tvData} title="Tv Shows" />
					</div>
				) : null}

				{isPersonLoading ? (
					<Loader>Loading..</Loader>
				) : personData ? (
					<div onClick={() => setClickPerson(true)}>
						<Person subject="person" data={personData} title="Person" />
					</div>
				) : null}
			</InnerWrapper>

			<AnimatePresence>
				{bigSearchMatch && !clickPerson ? (
					<Modal allData={allSearchData} bigMatch={bigSearchMatch} Y={scrollY.get()} />
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
