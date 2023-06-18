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

const Slider = styled.div`
	top: -100px;
	display: flex;
	justify-content: space-between;
`

const Row = styled(motion.div)`
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 5px;
	position: absolute;
	width: 90%;
	left: 5%;
`

const Box = styled(motion.div)<{ bgPhoto: string }>`
	background-color: white;
	height: 132px;
	font-size: 64px;
	background-image: url(${(props) => props.bgPhoto});
	background-size: cover;
	background-position: center center;
	cursor: pointer;
	&:first-child {
		transform-origin: center left;
	}
	&:last-child {
		transform-origin: center right;
	}
`

const Info = styled(motion.div)`
	padding: 10px;
	background-color: ${(props) => props.theme.black.lighter};
	opacity: 0;
	position: absolute;
	width: 100%;
	bottom: 0;
	h4 {
		text-align: center;
		font-size: 18px;
	}
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

const ArrowBtn = styled(motion.div)`
	z-index: 10;
	height: 132px;
	width: 5%;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-size: 32px;
`

const Subject = styled.div`
	width: 100%;
	margin-bottom: 60px;
`

const SubjectTitle = styled.div`
	font-size: 32px;
	font-weight: 400;
	left: 5%;
	position: relative;
	margin-bottom: 8px;
`

const rowVars = {
	hidden: (isBack: boolean) => ({ x: isBack ? window.innerWidth + 5 : -window.innerWidth - 5 }),
	visible: { x: 0 },
	exit: (isBack: boolean) => ({ x: isBack ? -window.innerWidth - 5 : window.innerWidth + 5 })
}

const offset = 6

const boxVars = {
	normal: {
		scale: 1
	},
	hover: {
		scale: 1.3,
		y: -50,
		transition: {
			delay: 0.3,
			type: 'tween'
		}
	}
}

const infoVars = {
	hover: {
		opacity: 1,
		transition: {
			delay: 0.3,
			duration: 0.1,
			type: 'tween'
		}
	}
}

const btnVars = {
	hover: {
		scale: 1.3
	}
}

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

	const [nowPlayingIndex, setNowPlayingIndex] = useState(0)
	const [popularIndex, setPopularIndex] = useState(0)
	const [topRatedIndex, setTopRatedIndex] = useState(0)
	const [upcomingIndex, setUpcomingIndex] = useState(0)

	const [leaving, setLeaving] = useState(false)
	const [back, setBack] = useState(false)
	const [eventSub, setEventSub] = useState('')
	const onBoxClicked = (movieId: number, subName: string) => {
		setEventSub(subName)
		history.push(`/movies/${movieId}`)
	}

	const increaseIndex = (
		movieData: IGetMovie,
		setIndex: React.Dispatch<React.SetStateAction<number>>
	) => {
		setBack(false)
		if (movieData) {
			if (leaving) return
			toggleLeaving()
			const totalMovies = movieData.results.length - 1
			const maxIndex = Math.floor(totalMovies / offset) - 1
			setIndex((prev) => (prev === maxIndex ? 0 : prev + 1))
		}
	}

	const decreaseIndex = (
		movieData: IGetMovie,
		setIndex: React.Dispatch<React.SetStateAction<number>>
	) => {
		setBack(true)
		if (movieData) {
			if (leaving) return
			toggleLeaving()
			const totalMovies = movieData.results.length - 1
			const maxIndex = Math.floor(totalMovies / offset) - 1
			setIndex((prev) => (prev === maxIndex ? 0 : prev + 1))
		}
	}

	const toggleLeaving = () => {
		setLeaving((prev) => !prev)
	}

	const onOverlayClick = () => history.push('/')

	const clickedMovie =
		bigMovieMatch?.params.movieId &&
		allData?.find((movie) => String(movie.id) === bigMovieMatch.params.movieId)

	return (
		<Wrapper>
			{nowPlayingLoading ? (
				<Loader>Loading..</Loader>
			) : (
				<>
					<Banner bgPhoto={makeImagePath(nowPlayingData?.results[0].backdrop_path || '')}>
						<Title>{nowPlayingData?.results[0].title}</Title>
						<Overview>{nowPlayingData?.results[0].overview}</Overview>
					</Banner>

					<Subject>
						<SubjectTitle>Now Playing</SubjectTitle>
						<Slider>
							<AnimatePresence
								custom={back}
								initial={false}
								onExitComplete={toggleLeaving}
							>
								<ArrowBtn
									onClick={() => {
										if (nowPlayingData)
											increaseIndex(nowPlayingData, setNowPlayingIndex)
									}}
									variants={btnVars}
									whileHover="hover"
								>
									&lt;
								</ArrowBtn>
								<Row
									variants={rowVars}
									custom={back}
									initial="hidden"
									animate="visible"
									exit="exit"
									transition={{ type: 'tween', duration: 1 }}
									key={'nowPlaying' + nowPlayingIndex}
								>
									{nowPlayingData?.results
										.slice(1)
										.slice(
											offset * nowPlayingIndex,
											offset * nowPlayingIndex + offset
										)
										.map((movie) => (
											<Box
												key={'nowPlaying' + movie.id}
												variants={boxVars}
												whileHover="hover"
												initial="normal"
												transition={{ type: 'tween' }}
												bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
												onClick={() => onBoxClicked(movie.id, 'nowPlaying')}
												layoutId={'nowPlaying' + movie.id}
											>
												<img src="" alt="" />
												<Info variants={infoVars}>
													<h4>{movie.title}</h4>
												</Info>
											</Box>
										))}
								</Row>
								<ArrowBtn
									onClick={() => {
										if (nowPlayingData)
											decreaseIndex(nowPlayingData, setNowPlayingIndex)
									}}
									variants={btnVars}
									whileHover="hover"
								>
									&gt;
								</ArrowBtn>
							</AnimatePresence>
						</Slider>
					</Subject>

					<Subject>
						<SubjectTitle>Popular</SubjectTitle>
						<Slider>
							<AnimatePresence
								custom={back}
								initial={false}
								onExitComplete={toggleLeaving}
							>
								<ArrowBtn
									onClick={() => {
										if (popularData) increaseIndex(popularData, setPopularIndex)
									}}
									variants={btnVars}
									whileHover="hover"
								>
									&lt;
								</ArrowBtn>
								<Row
									variants={rowVars}
									custom={back}
									initial="hidden"
									animate="visible"
									exit="exit"
									transition={{ type: 'tween', duration: 1 }}
									key={'popular' + popularIndex}
								>
									{popularData?.results
										.slice(1)
										.slice(
											offset * popularIndex,
											offset * popularIndex + offset
										)
										.map((movie) => (
											<Box
												key={'popular' + movie.id}
												variants={boxVars}
												whileHover="hover"
												initial="normal"
												transition={{ type: 'tween' }}
												bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
												onClick={() => onBoxClicked(movie.id, 'popular')}
												layoutId={'popular' + movie.id}
											>
												<img src="" alt="" />
												<Info variants={infoVars}>
													<h4>{movie.title}</h4>
												</Info>
											</Box>
										))}
								</Row>
								<ArrowBtn
									onClick={() => {
										if (popularData) decreaseIndex(popularData, setPopularIndex)
									}}
									variants={btnVars}
									whileHover="hover"
								>
									&gt;
								</ArrowBtn>
							</AnimatePresence>
						</Slider>
					</Subject>

					<Subject>
						<SubjectTitle>Top Rated</SubjectTitle>
						<Slider>
							<AnimatePresence
								custom={back}
								initial={false}
								onExitComplete={toggleLeaving}
							>
								<ArrowBtn
									onClick={() => {
										if (topRatedData)
											increaseIndex(topRatedData, setTopRatedIndex)
									}}
									variants={btnVars}
									whileHover="hover"
								>
									&lt;
								</ArrowBtn>
								<Row
									variants={rowVars}
									custom={back}
									initial="hidden"
									animate="visible"
									exit="exit"
									transition={{ type: 'tween', duration: 1 }}
									key={'topRated' + topRatedIndex}
								>
									{topRatedData?.results
										.slice(1)
										.slice(
											offset * topRatedIndex,
											offset * topRatedIndex + offset
										)
										.map((movie) => (
											<Box
												key={'topRated' + movie.id}
												variants={boxVars}
												whileHover="hover"
												initial="normal"
												transition={{ type: 'tween' }}
												bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
												onClick={() => onBoxClicked(movie.id, 'topRated')}
												layoutId={'topRated' + movie.id}
											>
												<img src="" alt="" />
												<Info variants={infoVars}>
													<h4>{movie.title}</h4>
												</Info>
											</Box>
										))}
								</Row>
								<ArrowBtn
									onClick={() => {
										if (topRatedData)
											decreaseIndex(topRatedData, setTopRatedIndex)
									}}
									variants={btnVars}
									whileHover="hover"
								>
									&gt;
								</ArrowBtn>
							</AnimatePresence>
						</Slider>
					</Subject>

					<Subject>
						<SubjectTitle>Upcoming</SubjectTitle>
						<Slider>
							<AnimatePresence
								custom={back}
								initial={false}
								onExitComplete={toggleLeaving}
							>
								<ArrowBtn
									onClick={() => {
										if (upcomingData)
											increaseIndex(upcomingData, setUpcomingIndex)
									}}
									variants={btnVars}
									whileHover="hover"
								>
									&lt;
								</ArrowBtn>
								<Row
									variants={rowVars}
									custom={back}
									initial="hidden"
									animate="visible"
									exit="exit"
									transition={{ type: 'tween', duration: 1 }}
									key={'upcoming' + upcomingIndex}
								>
									{upcomingData?.results
										.slice(1)
										.slice(
											offset * upcomingIndex,
											offset * upcomingIndex + offset
										)
										.map((movie) => (
											<Box
												key={'upcoming' + movie.id}
												variants={boxVars}
												whileHover="hover"
												initial="normal"
												transition={{ type: 'tween' }}
												bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
												onClick={() => onBoxClicked(movie.id, 'upcoming')}
												layoutId={'upcoming' + movie.id}
											>
												<img src="" alt="" />
												<Info variants={infoVars}>
													<h4>{movie.title}</h4>
												</Info>
											</Box>
										))}
								</Row>
								<ArrowBtn
									onClick={() => {
										if (upcomingData)
											decreaseIndex(upcomingData, setUpcomingIndex)
									}}
									variants={btnVars}
									whileHover="hover"
								>
									&gt;
								</ArrowBtn>
							</AnimatePresence>
						</Slider>
					</Subject>

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
									layoutId={`${eventSub}` + bigMovieMatch.params.movieId}
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
