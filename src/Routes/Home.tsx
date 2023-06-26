import { useQuery } from 'react-query'
import {
	IGetMovie,
	getNowPlayingMovie,
	getPopularMovies,
	getTopRatedMovies,
	getUpcomingMovies
} from '../api'
import styled from 'styled-components'
import { makeImagePath } from '../utils'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import SubjectCom from '../Components/SubjectCom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { atomEventSub } from '../atoms'

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

const Banner = styled.div<{ bgPhoto: string }>`
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 60px;
	background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
		url(${(props) => props.bgPhoto});
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

const Overlay = styled(motion.div)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	opacity: 0;
`

const BigMovie = styled(motion.div)`
	position: absolute;
	width: 40vw;
	height: 80vh;
	left: 0;
	right: 0;
	margin: 0 auto;
	background-color: ${(props) => props.theme.black.lighter};
	border-radius: 12px;
	overflow: hidden;
`

const BigCover = styled.div`
	width: 100%;
	background-size: cover;
	background-position: center center;
	height: 400px;
`

const BigTitle = styled.h2`
	color: ${(props) => props.theme.white.lighter};
	padding: 20px;
	text-align: center;
	font-size: 36px;
	position: relative;
	top: -80px;
`

const BigOverview = styled.div`
	top: -80px;
	padding: 20px;
	color: ${(props) => props.theme.white.lighter};
`

const Home = () => {
	const history = useHistory()
	const bigMovieMatch = useRouteMatch<{ movieId: string }>('/movies/:movieId')
	const { data: nowPlayingData, isLoading: nowPlayingLoading } = useQuery<IGetMovie>(
		['movies', 'nowPlaying'],
		getNowPlayingMovie
	)
	const { data: popularData, isLoading: popularLoading } = useQuery<IGetMovie>(
		['movies', 'popular'],
		getPopularMovies
	)
	const { data: topRatedData, isLoading: topRatedLoading } = useQuery<IGetMovie>(
		['movies', 'topRated'],
		getTopRatedMovies
	)
	const { data: upcomingData, isLoading: upcomingLoading } = useQuery<IGetMovie>(
		['movies', 'upcoming'],
		getUpcomingMovies
	)

	const allData = [
		...(nowPlayingData?.results || []),
		...(popularData?.results || []),
		...(topRatedData?.results || []),
		...(upcomingData?.results || [])
	]

	const { scrollY } = useScroll()

	const eventSubString = useRecoilValue(atomEventSub)

	const onOverlayClick = () => history.push('/')

	const clickedMovie =
		bigMovieMatch?.params.movieId &&
		allData?.find((movie) => String(movie.id) === bigMovieMatch.params.movieId)

	return (
		<Wrapper>
			{nowPlayingLoading && popularLoading && topRatedLoading && upcomingLoading ? (
				<Loader>Loading..</Loader>
			) : (
				<>
					<Banner bgPhoto={makeImagePath(nowPlayingData?.results[0].backdrop_path || '')}>
						<Title>{nowPlayingData?.results[0].title}</Title>
						<Overview>{nowPlayingData?.results[0].overview}</Overview>
					</Banner>

					<SubjectCom
						subject="nowPlaying"
						movieApi={getNowPlayingMovie}
						title="Now Playing"
					/>
					<SubjectCom subject="popular" movieApi={getPopularMovies} title="Popular" />
					<SubjectCom subject="topRated" movieApi={getTopRatedMovies} title="Top Rated" />
					<SubjectCom subject="upcoming" movieApi={getUpcomingMovies} title="Upcoming" />

					<AnimatePresence>
						{bigMovieMatch ? (
							<>
								<Overlay
									onClick={onOverlayClick}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								/>
								<BigMovie
									style={{ top: scrollY.get() + 80 }}
									layoutId={`${eventSubString}` + bigMovieMatch.params.movieId}
								>
									{clickedMovie && (
										<>
											<BigCover
												style={{
													backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
														clickedMovie.backdrop_path,
														'w500'
													)})`
												}}
											/>
											<BigTitle>{clickedMovie.title}</BigTitle>
											<BigOverview>{clickedMovie.overview}</BigOverview>
										</>
									)}
								</BigMovie>
							</>
						) : null}
					</AnimatePresence>
				</>
			)}
		</Wrapper>
	)
}

export default Home
