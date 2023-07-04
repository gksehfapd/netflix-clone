import { motion } from 'framer-motion'
import { match, useHistory, useRouteMatch } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { atomCasts, atomEventSub, atomGenres } from '../atoms'
import { makeImagePath } from '../utils'
import { IData } from '../api'

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
	display: flex;
`

const TitleArea = styled.div`
	width: 100%;
	display: flex;
	justify-content: end;
	align-items: end;
`

const BigTitle = styled.h2`
	color: ${(props) => props.theme.white.lighter};
	padding: 2px 20px;
	text-align: center;
	font-size: 36px;
	position: relative;
	width: 65%;
`

const BigOverview = styled.div`
	top: -80px;
	padding: 6px 20px;
	width: 65%;
	color: ${(props) => props.theme.white.lighter};
`

const Summary = styled.div`
	padding: 4px 0px;
`

const OverviewH4 = styled.h4`
	padding: 4px 0px;
`

const PosterArea = styled.div`
	display: flex;
	flex-direction: column;
	width: 35%;
	margin-left: 16px;
	transform: translateY(-50%);
`

const BigPoster = styled.img`
	width: 100%;
`

const Info = styled.div`
	height: 50%;
	display: flex;
`

interface IModalProps {
	allData: IData[]
	bigMatch: match<{
		id?: string
	}> | null

	Y: number
}

interface ICast {
	name: string
}

const ContentModal = ({ allData, bigMatch, Y }: IModalProps) => {
	const history = useHistory()
	const { path } = useRouteMatch()
	const casts: any = useRecoilValue(atomCasts)

	const onOverlayClick = () => {
		history.goBack()
	}

	const genres = useRecoilValue(atomGenres)

	const eventSubString = useRecoilValue(atomEventSub)

	const clickedPoster =
		bigMatch?.params.id && allData?.find((data) => String(data.id) === bigMatch.params.id)

	return (
		<div>
			<Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
			<BigMovie style={{ top: Y + 80 }} layoutId={`${eventSubString}` + bigMatch?.params.id}>
				{clickedPoster && (
					<>
						<BigCover
							style={{
								backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
									clickedPoster.backdrop_path,
									'w500'
								)})`
							}}
						>
							<TitleArea>
								<BigTitle>
									{path === '/tv' ? clickedPoster.name : clickedPoster.title}
								</BigTitle>
							</TitleArea>
						</BigCover>
						<Info>
							<PosterArea>
								<BigPoster src={makeImagePath(clickedPoster.poster_path)} alt="" />
								<OverviewH4>
									Genres :{' '}
									{clickedPoster.genre_ids.map(
										(e) => genres.find((genre) => genre.id === e)?.name + ' '
									)}
								</OverviewH4>
								<OverviewH4>Grade : {clickedPoster.vote_average}</OverviewH4>
							</PosterArea>
							<BigOverview>
								<OverviewH4>
									Casts :{' '}
									{casts.cast
										? casts.cast
												.slice(0, 3)
												.map((cast: ICast) => cast.name + ', ')
										: ''}
									...
								</OverviewH4>
								<Summary>
									<p>{clickedPoster.overview}</p>
								</Summary>
							</BigOverview>
						</Info>
					</>
				)}
			</BigMovie>
		</div>
	)
}

export default ContentModal
