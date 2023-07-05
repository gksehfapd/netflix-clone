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
import ContentSlider from '../Components/ContentSlider'
import { Helmet } from 'react-helmet-async'
import ContentModal from '../Components/ContentModal'
import Loader from '../Components/Loader'

const Wrapper = styled.div`
	background-color: black;
	padding-bottom: 200px;
`

const Banner = styled.div<{ photo: string }>`
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 60px;
	background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
		url(${(props) => props.photo});
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
				<Banner photo="">
					<Loader />
				</Banner>
			) : (
				<>
					<Banner photo={makeImagePath(nowPlayingData?.results[0].backdrop_path || '')}>
						<Title>{nowPlayingData?.results[0].title}</Title>
						<Overview>{nowPlayingData?.results[0].overview}</Overview>
					</Banner>

					{nowPlayingData && !nowPlayingLoading ? (
						<ContentSlider
							subject="nowPlaying"
							data={nowPlayingData}
							title="Now Playing"
						/>
					) : (
						<Loader />
					)}
					{topRatedData && !topRatedLoading ? (
						<ContentSlider subject="topRated" data={topRatedData} title="Top Rated" />
					) : (
						<Loader />
					)}
					{popularData && !popularLoading ? (
						<ContentSlider subject="popular" data={popularData} title="Popular" />
					) : (
						<Loader />
					)}
					{upcomingData && !upcomingLoading ? (
						<ContentSlider subject="upcoming" data={upcomingData} title="Upcoming" />
					) : (
						<Loader />
					)}

					<AnimatePresence>
						{bigMovieMatch ? (
							<ContentModal
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
