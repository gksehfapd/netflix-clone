import { useQuery } from 'react-query'
import {
	IGetData,
	getNowPlayingMovie,
	getPopularMovies,
	getTopRatedMovies,
	getUpcomingMovies
} from '../api'
import styled from 'styled-components'
import { makeImagePath } from '../utils'
import { AnimatePresence, useScroll } from 'framer-motion'
import { useRouteMatch } from 'react-router-dom'
import SubjectCom from '../Components/SubjectCom'
import { Helmet } from 'react-helmet-async'
import Modal from '../Components/Modal'

const Wrapper = styled.div`
	background-color: black;
	padding-bottom: 200px;
`

const Loader = styled.div`
	height: 20vh;
	display: flex;
	justify-content: center;
	align-items: center;
`

const Banner = styled.div<{ bgphoto: string }>`
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 60px;
	background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
		url(${(props) => props.bgphoto});
	background-size: cover;
`

const Title = styled.h2`
	font-size: 48px;
	margin-bottom: 20px;
`

const Overview = styled.p`
	font-size: 20px;
	width: 50%;
`

const Home = () => {
	const bigMovieMatch = useRouteMatch<{ id: string }>('/movies/:id')
	const { data: nowPlayingData, isLoading: nowPlayingLoading } = useQuery<IGetData>(
		['movies', 'nowPlaying'],
		getNowPlayingMovie
	)
	const { data: popularData, isLoading: popularLoading } = useQuery<IGetData>(
		['movies', 'popular'],
		getPopularMovies
	)
	const { data: topRatedData, isLoading: topRatedLoading } = useQuery<IGetData>(
		['movies', 'topRated'],
		getTopRatedMovies
	)
	const { data: upcomingData, isLoading: upcomingLoading } = useQuery<IGetData>(
		['movies', 'upcoming'],
		getUpcomingMovies
	)

	const allMovieData = [
		...(nowPlayingData?.results || []),
		...(popularData?.results || []),
		...(topRatedData?.results || []),
		...(upcomingData?.results || [])
	]

	const { scrollY } = useScroll()

	return (
		<Wrapper>
			<Helmet>
				<title>Netflix | Movies</title>
			</Helmet>
			{nowPlayingLoading ? (
				<Loader>Loading..</Loader>
			) : (
				<>
					<Banner bgphoto={makeImagePath(nowPlayingData?.results[0].backdrop_path || '')}>
						<Title>{nowPlayingData?.results[0].title}</Title>
						<Overview>{nowPlayingData?.results[0].overview}</Overview>
					</Banner>

					{nowPlayingData && !nowPlayingLoading ? (
						<SubjectCom
							subject="nowPlaying"
							data={nowPlayingData}
							title="Now Playing"
						/>
					) : (
						<Loader>Loading..</Loader>
					)}
					{topRatedData && !topRatedLoading ? (
						<SubjectCom subject="topRated" data={topRatedData} title="Top Rated" />
					) : (
						<Loader>Loading..</Loader>
					)}
					{popularData && !popularLoading ? (
						<SubjectCom subject="popular" data={popularData} title="Popular" />
					) : (
						<Loader>Loading..</Loader>
					)}
					{upcomingData && !upcomingLoading ? (
						<SubjectCom subject="upcoming" data={upcomingData} title="Upcoming" />
					) : (
						<Loader>Loading..</Loader>
					)}

					<AnimatePresence>
						{bigMovieMatch ? (
							<Modal
								allData={allMovieData}
								bigMatch={bigMovieMatch}
								Y={scrollY.get()}
							/>
						) : null}
					</AnimatePresence>
				</>
			)}
		</Wrapper>
	)
}

export default Home