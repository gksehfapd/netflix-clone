import { useQuery } from 'react-query'
import { IGetData, getAiringTv, getOnAirTv, getPopularTv, getTopRatedTv } from '../api'
import styled from 'styled-components'
import { makeImagePath } from '../utils'
import { AnimatePresence, useScroll } from 'framer-motion'
import { useRouteMatch } from 'react-router-dom'
import ContentSlider from '../Components/ContentSlider'
import ContentModal from '../Components/ContentModal'
import { Helmet } from 'react-helmet-async'
import Loader from '../Components/Loader'

const Wrapper = styled.div`
	background-color: black;
	padding-bottom: 200px;
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

const Tv = () => {
	const bigTvMatch = useRouteMatch<{ id: string }>('/tv/:id')
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

	return (
		<Wrapper>
			<Helmet>
				<title>Netflix | TV</title>
			</Helmet>
			{onAirTvLoading ? (
				<Loader />
			) : (
				<>
					<Banner bgphoto={makeImagePath(onAirTvData?.results[0].backdrop_path || '')}>
						<Title>{onAirTvData?.results[0].name}</Title>
						<Overview>{onAirTvData?.results[0].overview}</Overview>
					</Banner>

					{onAirTvData && !onAirTvLoading ? (
						<ContentSlider subject="nowPlaying" data={onAirTvData} title="On The Air" />
					) : (
						<Loader />
					)}
					{topRatedTvData && !topRatedTvLoading ? (
						<ContentSlider subject="upcoming" data={topRatedTvData} title="Top Rated" />
					) : (
						<Loader />
					)}
					{popularTvData && !popularTvLoading ? (
						<ContentSlider subject="topRated" data={popularTvData} title="Popular" />
					) : (
						<Loader />
					)}

					{airingTvData && !airingTvLoading ? (
						<ContentSlider subject="popular" data={airingTvData} title="Airing Today" />
					) : (
						<Loader />
					)}

					<AnimatePresence>
						{bigTvMatch ? (
							<ContentModal
								allData={allTvData}
								bigMatch={bigTvMatch}
								Y={scrollY.get()}
							/>
						) : null}
					</AnimatePresence>
				</>
			)}
		</Wrapper>
	)
}

export default Tv
