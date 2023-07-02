import { useQuery } from 'react-query'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { IGetData, getSearchMovie, getSearchTv } from '../api'
import SubjectCom from '../Components/SubjectCom'
import { AnimatePresence, useScroll } from 'framer-motion'
import Modal from '../Components/Modal'

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

	const bigSearchMatch = useRouteMatch<{ id: string }>('/search/:id')
	const { scrollY } = useScroll()

	const allSearchData = [...(movieData?.results || []), ...(tvData?.results || [])]
	const history = useHistory()
	return (
		<Wrapper>
			<InnerWrapper>
				<SearchKeyword onClick={() => console.log(history)}>
					Search for '{keyword}'
				</SearchKeyword>

				{isMovieLoading ? (
					<Loader>Loading..</Loader>
				) : movieData ? (
					<SubjectCom subject="movieData" data={movieData} title="Movies" />
				) : null}

				{isTvLoading ? (
					<Loader>Loading..</Loader>
				) : tvData ? (
					<SubjectCom subject="tvData" data={tvData} title="Tv Shows" />
				) : null}
			</InnerWrapper>

			<AnimatePresence>
				{bigSearchMatch ? (
					<Modal allData={allSearchData} bigMatch={bigSearchMatch} Y={scrollY.get()} />
				) : null}
			</AnimatePresence>
		</Wrapper>
	)
}

export default Search
