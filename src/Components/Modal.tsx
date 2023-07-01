import { motion } from 'framer-motion'
import { match, useHistory, useRouteMatch } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { atomEventSub } from '../atoms'
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

interface IModalProps {
	allData: IData[]
	bigMatch: match<{
		id?: string
	}> | null
	Y: number
}

const Modal = ({ allData, bigMatch, Y }: IModalProps) => {
	const history = useHistory()
	const { path } = useRouteMatch()

	const onOverlayClick = () => {
		if (path === '/tv') {
			history.push('/tv')
		} else {
			history.push('/')
		}
	}

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
						/>
						<Info>
							<BigTitle>
								{path === '/tv' ? clickedPoster.name : clickedPoster.title}
							</BigTitle>
							<BigOverview>{clickedPoster.overview}</BigOverview>
						</Info>
					</>
				)}
			</BigMovie>
		</div>
	)
}

export default Modal
