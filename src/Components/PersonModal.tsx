import { motion } from 'framer-motion'
import { match, useHistory } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { atomEventSub } from '../atoms'
import { makeImagePath } from '../utils'
import { IPerson, getKnownSearch } from '../api'
import { useState } from 'react'

const Overlay = styled(motion.div)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	opacity: 0;
`

const BigPerson = styled(motion.div)`
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

const BigCover = styled(motion.div)`
	width: 100%;
	background-size: cover;
	background-position: center center;
	height: 50%;
	display: flex;
`

const NameArea = styled.div`
	width: 100%;
	display: flex;
	justify-content: end;
	align-items: end;
`

const BigName = styled.h2`
	color: ${(props) => props.theme.white.lighter};
	padding: 2px 20px;
	text-align: center;
	font-size: 36px;
	position: relative;
	width: 65%;
`

const BigPoster = styled.img`
	width: 35%;
	padding: 12px;
`

const Info = styled.div`
	height: 50%;
	display: flex;
	width: 100%;
	padding: 12px;
	justify-content: space-around;
`

const InfoKnown = styled(motion.div)`
	width: 30%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
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

const PosterArea = styled.div`
	display: flex;
	flex-direction: column;
	width: 35%;
	margin-left: 16px;
	transform: translateY(-50%);
`

const WorkBigPoster = styled(motion.img)`
	width: 100%;
`

const WorkInfo = styled.div`
	height: 50%;
	display: flex;
`

const OverviewH4 = styled.h4`
	padding: 4px 0px;
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

const BackBtn = styled(motion.button)`
	background-color: transparent;
	border: none;
	font-size: 36px;
	height: 50px;
	width: 50px;
	color: ${(props) => props.theme.white.darker};
`

const btnVars = {
	normal: {
		scale: 1
	},
	hover: {
		scale: 1.2,
		transition: {
			type: 'tween'
		},
		cursor: 'pointer'
	}
}

const infoVars = {
	normal: {
		scale: 1
	},
	hover: {
		scale: 1.1,
		transition: {
			delay: 0.3,
			type: 'linear'
		},
		cursor: 'pointer'
	}
}

interface IModalProps {
	allData: IPerson[]
	bigMatch: match<{
		id?: string
	}> | null
	Y: number
}

interface IGenre {
	id: number
	name: string
}

const PersonModal = ({ allData, bigMatch, Y }: IModalProps) => {
	const history = useHistory()

	const [isWork, setIsWork] = useState(false)
	const [selectWork, setSelectWork] = useState([]) as any
	const [workId, setWorkId] = useState('')

	const onOverlayClick = () => {
		setIsWork(false)
		history.goBack()
	}
	const eventSubString = useRecoilValue(atomEventSub)

	const clickedPerson =
		bigMatch?.params.id && allData?.find((data) => String(data.id) === bigMatch.params.id)

	const onWorkClicked = async (dataId: number, mediaType: string) => {
		setWorkId(dataId + '')
		setIsWork(true)
		setSelectWork(await getKnownSearch(dataId, mediaType))
	}

	const clickBackBtn = () => {
		setIsWork(false)
	}
	return (
		<>
			<Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
			<BigPerson style={{ top: Y + 80 }} layoutId={`${eventSubString}` + bigMatch?.params.id}>
				{clickedPerson &&
					(isWork ? (
						<>
							<BigCover
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="bigCover"
								style={{
									backgroundImage: `linear-gradient(to top, black, transparent),
                                     url(${makeImagePath(selectWork.backdrop_path, 'w500')})`
								}}
							>
								<BackBtn
									variants={btnVars}
									initial="normal"
									whileHover="hover"
									onClick={clickBackBtn}
								>
									&lt;
								</BackBtn>
								<TitleArea>
									<BigTitle>{selectWork.original_title}</BigTitle>
								</TitleArea>
							</BigCover>
							<WorkInfo>
								<PosterArea>
									<WorkBigPoster
										layoutId={workId}
										src={makeImagePath(selectWork.poster_path)}
										alt=""
									/>
									<OverviewH4>
										Genres :{' '}
										{selectWork.genres &&
											selectWork.genres.map((e: IGenre) => e.name + ' ')}
									</OverviewH4>
									<OverviewH4>Grade : {selectWork.vote_average}</OverviewH4>
								</PosterArea>
								<BigOverview>
									<Summary>
										<p>{selectWork.overview}</p>
									</Summary>
								</BigOverview>
							</WorkInfo>
						</>
					) : (
						<>
							<BigCover
								style={{
									backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
										clickedPerson.known_for[0].backdrop_path,
										'w500'
									)})`
								}}
							>
								<NameArea>
									<BigPoster
										src={makeImagePath(clickedPerson.profile_path)}
										alt=""
									/>
									<BigName>{clickedPerson.name}</BigName>
								</NameArea>
							</BigCover>
							<Info>
								{clickedPerson.known_for.map((work) => (
									<InfoKnown
										key={work.id}
										onClick={() => onWorkClicked(work.id, work.media_type)}
										variants={infoVars}
										whileHover="hover"
										initial="normal"
										transition={{ type: 'tween' }}
										layoutId={work.id + ''}
									>
										<img
											style={{ width: '100%' }}
											src={makeImagePath(work.poster_path, 'w500')}
											alt=""
										/>
									</InfoKnown>
								))}
							</Info>
						</>
					))}
			</BigPerson>
		</>
	)
}

export default PersonModal
