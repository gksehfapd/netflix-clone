import { useQuery } from 'react-query'
import { IGetData, getAiringTv, getOnAirTv, getPopularTv, getTopRatedTv } from '../api'
import styled from 'styled-components'
import { makeImagePath } from '../utils'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { useHistory, useRouteMatch } from 'react-router-dom'
import SubjectCom from '../Components/SubjectCom'
import { useRecoilValue } from 'recoil'
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
	display: flex;
	flex-direction: column;
	overflow-y: scroll;
	::-webkit-scrollbar {
		display: none;
	}
`

const BigCover = styled.div`
	width: 100%;
	background-size: cover;
	background-position: center center;
	height: 50%;
`

const BigTitle = styled.h2`
	color: ${(props) => props.theme.white.lighter};
	padding: 20px;
	text-align: center;
	font-size: 36px;
	position: relative;
`

const BigOverview = styled.div`
	top: -80px;
	padding: 20px;
	color: ${(props) => props.theme.white.lighter};
`

const Info = styled.div`
	height: 50%;
`

const Tv = () => {
	const history = useHistory()
	const bigTvMatch = useRouteMatch<{ tvId: string }>('/tv/:tvId')
	const { data: onAirTvData, isLoading: onAirTvLoading } = useQuery<IGetData>(
		['tvs', 'onAirTv'],
		getOnAirTv
	)
	const { data: airingTvData, isLoading: airingTvLoading } = useQuery<IGetData>(
		['tvs', 'airingTv'],
		getAiringTv
	)
	const { data: popularTvData, isLoading: popularTvLoading } = useQuery<IGetData>(
		['tvs', 'popularTv'],
		getPopularTv
	)
	const { data: topRatedTvData, isLoading: topRatedTvLoading } = useQuery<IGetData>(
		['tvs', 'topRatedTv'],
		getTopRatedTv
	)

	const allTvData = [
		...(onAirTvData?.results || []),
		...(airingTvData?.results || []),
		...(popularTvData?.results || []),
		...(topRatedTvData?.results || [])
	]

	const { scrollY } = useScroll()

	const eventSubString = useRecoilValue(atomEventSub)

	const onOverlayClick = () => history.push('/tv')

	const clickedMovie =
		bigTvMatch?.params.tvId && allTvData?.find((tv) => String(tv.id) === bigTvMatch.params.tvId)

	return (
		<Wrapper>
			{onAirTvLoading ? (
				<Loader>Loading..</Loader>
			) : (
				<>
					<Banner bgphoto={makeImagePath(onAirTvData?.results[0].backdrop_path || '')}>
						<Title>{onAirTvData?.results[0].name}</Title>
						<Overview>{onAirTvData?.results[0].overview}</Overview>
					</Banner>

					{onAirTvData && !onAirTvLoading ? (
						<SubjectCom subject="nowPlaying" data={onAirTvData} title="On The Air" />
					) : (
						<Loader>Loading..</Loader>
					)}
					{topRatedTvData && !topRatedTvLoading ? (
						<SubjectCom subject="upcoming" data={topRatedTvData} title="Top Rated" />
					) : (
						<Loader>Loading..</Loader>
					)}
					{popularTvData && !popularTvLoading ? (
						<SubjectCom subject="topRated" data={popularTvData} title="Popular" />
					) : (
						<Loader>Loading..</Loader>
					)}

					{airingTvData && !airingTvLoading ? (
						<SubjectCom subject="popular" data={airingTvData} title="Airing Today" />
					) : (
						<Loader>Loading..</Loader>
					)}

					<AnimatePresence>
						{bigTvMatch ? (
							<>
								<Overlay
									onClick={onOverlayClick}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								/>
								<BigMovie
									style={{ top: scrollY.get() + 80 }}
									layoutId={`${eventSubString}` + bigTvMatch.params.tvId}
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
											<Info>
												<BigTitle>{clickedMovie.name}</BigTitle>
												<BigOverview>{clickedMovie.overview}</BigOverview>
											</Info>
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

export default Tv
