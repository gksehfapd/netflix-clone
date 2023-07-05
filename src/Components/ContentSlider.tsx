import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import styled from 'styled-components'
import { IGetData, getMovieCast, getTvCast } from '../api'
import { makeImagePath } from '../utils'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { atomCasts, atomEventSub, atomGenres } from '../atoms'

const SubjectDiv = styled.div`
	width: 100%;
	margin-bottom: 60px;
	height: 50vh;
`

const Slider = styled.div`
	display: flex;
	justify-content: space-between;
	height: 90%;
`

const SubjectTitle = styled.div`
	font-size: 32px;
	font-weight: 400;
	left: 5%;
	position: relative;
	margin-bottom: 8px;
`

const ArrowBtn = styled(motion.div)`
	width: 5%;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-size: 32px;
	height: 90%;
`

const Row = styled(motion.div)`
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 5px;
	position: absolute;
	width: 90%;
	left: 5%;
	height: 40%;
`

const Box = styled(motion.div)<{ photo: string }>`
	height: 100%;
	background-color: white;
	font-size: 64px;
	background-image: url(${(props) => props.photo});
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
		font-size: 8px;
	}
`

const boxVars = {
	normal: {
		scale: 1
	},
	hover: {
		scale: 1.5,
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
		scale: 1.5
	}
}

const rowVars = {
	hidden: (isBack: boolean) => ({
		x: isBack ? window.innerWidth + 5 : -window.innerWidth - 5
	}),
	visible: { x: 0 },
	exit: (isBack: boolean) => ({ x: isBack ? -window.innerWidth - 5 : window.innerWidth + 5 })
}

const offset = 6

interface IProps {
	subject: string
	title: string
	data: IGetData
}

const ContentSlider = ({ subject, title, data }: IProps) => {
	const history = useHistory()
	const [dataIndex, setDataIndex] = useState(0)
	const [back, setBack] = useState(false)
	const [leaving, setLeaving] = useState(false)

	const setEventSub = useSetRecoilState(atomEventSub)
	const setCasts = useSetRecoilState(atomCasts)

	const toggleLeaving = () => {
		setLeaving((prev) => !prev)
	}

	const genres = useRecoilValue(atomGenres)

	const increaseIndex = (
		fetchData: IGetData,
		setIndex: React.Dispatch<React.SetStateAction<number>>
	) => {
		setBack(false)
		if (fetchData) {
			if (leaving) return
			toggleLeaving()
			const totalMovies = fetchData.results.length - 1
			const maxIndex = Math.floor(totalMovies / offset) - 1
			setIndex((prev) => (prev === maxIndex ? 0 : prev + 1))
		}
	}

	const decreaseIndex = (
		fetchData: IGetData,
		setIndex: React.Dispatch<React.SetStateAction<number>>
	) => {
		setBack(true)
		if (fetchData) {
			if (leaving) return
			toggleLeaving()
			const totalMovies = fetchData.results.length - 1
			const maxIndex = Math.floor(totalMovies / offset) - 1
			setIndex((prev) => (prev === maxIndex ? 0 : prev + 1))
		}
	}

	const { path } = useRouteMatch()

	const onBoxClicked = async (dataId: number, subName: string) => {
		setEventSub(subName)
		console.log(history.location)

		if (path === '/tv') {
			setCasts(await getTvCast(dataId))
		} else {
			setCasts(await getMovieCast(dataId))
		}

		if (history.location.pathname === '/') {
			history.push(`${'/movies'}/${dataId}`)
		} else if (history.location.pathname === '/tv') {
			history.push(`${'/tv'}/${dataId}`)
		} else if (history.location.pathname === '/search/' && history.location.search) {
			history.push(`${'/search'}/${dataId}${history.location.search}`)
		}
	}

	return (
		<SubjectDiv>
			<SubjectTitle>{title}</SubjectTitle>
			<Slider>
				<AnimatePresence custom={back} initial={false} onExitComplete={toggleLeaving}>
					<ArrowBtn
						onClick={() => {
							if (data) increaseIndex(data, setDataIndex)
						}}
						variants={btnVars}
						whileHover="hover"
						key="leftArrow"
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
						key={`${subject}` + dataIndex}
					>
						{data?.results
							.slice(1)
							.slice(offset * dataIndex, offset * dataIndex + offset)
							.map((fetchData) => (
								<Box
									key={`${subject}` + fetchData.id}
									variants={boxVars}
									whileHover="hover"
									initial="normal"
									transition={{ type: 'tween' }}
									photo={makeImagePath(fetchData.poster_path)}
									onClick={() => onBoxClicked(fetchData.id, `${subject}`)}
									layoutId={`${subject}` + fetchData.id}
								>
									<Info variants={infoVars}>
										<h4>Grade : {fetchData.vote_average}</h4>
										<h4>
											Genres :{' '}
											{fetchData.genre_ids.map(
												(e) =>
													genres.find((genre) => genre.id === e)?.name +
													' '
											)}
										</h4>
									</Info>
								</Box>
							))}
					</Row>
					<ArrowBtn
						onClick={() => {
							if (data) decreaseIndex(data, setDataIndex)
						}}
						variants={btnVars}
						whileHover="hover"
					>
						&gt;
					</ArrowBtn>
				</AnimatePresence>
			</Slider>
		</SubjectDiv>
	)
}

export default ContentSlider
