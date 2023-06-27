import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import styled from 'styled-components'
import { IGetMovie } from '../api'

import { makeImagePath } from '../utils'
import { useHistory } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { atomEventSub } from '../atoms'

const SubjectDiv = styled.div`
	width: 100%;
	margin-bottom: 60px;
`

const Slider = styled.div`
	display: flex;
	justify-content: space-between;
`

const SubjectTitle = styled.div`
	font-size: 32px;
	font-weight: 400;
	left: 5%;
	position: relative;
	margin-bottom: 8px;
`

const ArrowBtn = styled(motion.div)`
	height: 250px;
	width: 5%;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-size: 32px;
`

const Row = styled(motion.div)`
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 5px;
	position: absolute;
	width: 90%;
	left: 5%;
`

const Box = styled(motion.div)<{ bgphoto: string }>`
	background-color: white;
	height: 250px;
	font-size: 64px;
	background-image: url(${(props) => props.bgphoto});
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
		/* text-align: center; */
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
	data: IGetMovie
}

const genres = [
	{
		id: 28,
		name: 'Action'
	},
	{
		id: 12,
		name: 'Adventure'
	},
	{
		id: 16,
		name: 'Animation'
	},
	{
		id: 35,
		name: 'Comedy'
	},
	{
		id: 80,
		name: 'Crime'
	},
	{
		id: 99,
		name: 'Documentary'
	},
	{
		id: 18,
		name: 'Drama'
	},
	{
		id: 10751,
		name: 'Family'
	},
	{
		id: 14,
		name: 'Fantasy'
	},
	{
		id: 36,
		name: 'History'
	},
	{
		id: 27,
		name: 'Horror'
	},
	{
		id: 10402,
		name: 'Music'
	},
	{
		id: 9648,
		name: 'Mystery'
	},
	{
		id: 10749,
		name: 'Romance'
	},
	{
		id: 878,
		name: 'Science Fiction'
	},
	{
		id: 10770,
		name: 'TV Movie'
	},
	{
		id: 53,
		name: 'Thriller'
	},
	{
		id: 10752,
		name: 'War'
	},
	{
		id: 37,
		name: 'Western'
	}
]

const SubjectCom = ({ subject, title, data }: IProps) => {
	const history = useHistory()
	const [nowPlayingIndex, setNowPlayingIndex] = useState(0)
	const [back, setBack] = useState(false)
	const [leaving, setLeaving] = useState(false)

	const setEventSub = useSetRecoilState(atomEventSub)

	const toggleLeaving = () => {
		setLeaving((prev) => !prev)
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

	const onBoxClicked = async (movieId: number, subName: string) => {
		setEventSub(subName)
		history.push(`/movies/${movieId}`)
	}

	return (
		<SubjectDiv>
			<SubjectTitle>{title}</SubjectTitle>
			<Slider>
				<AnimatePresence custom={back} initial={false} onExitComplete={toggleLeaving}>
					<ArrowBtn
						onClick={() => {
							if (data) increaseIndex(data, setNowPlayingIndex)
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
						key={`${subject}` + nowPlayingIndex}
					>
						{data?.results
							.slice(1)
							.slice(offset * nowPlayingIndex, offset * nowPlayingIndex + offset)
							.map((movie) => (
								<Box
									key={`${subject}` + movie.id}
									variants={boxVars}
									whileHover="hover"
									initial="normal"
									transition={{ type: 'tween' }}
									bgphoto={makeImagePath(movie.poster_path)}
									onClick={() => onBoxClicked(movie.id, `${subject}`)}
									layoutId={`${subject}` + movie.id}
								>
									<img src="" alt="" />
									<Info variants={infoVars}>
										<h4>Grade : {movie.vote_average}</h4>
										<h4>
											Genres :{' '}
											{movie.genre_ids.map(
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
							if (data) decreaseIndex(data, setNowPlayingIndex)
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

export default SubjectCom
