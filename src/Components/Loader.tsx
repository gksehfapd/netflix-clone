import { motion } from 'framer-motion'
import styled from 'styled-components'
import { BsHourglassBottom } from 'react-icons/bs'

const LoaderDiv = styled(motion.div)`
	height: 20vh;
	display: flex;
	justify-content: center;
	align-items: center;
`

const Loader = () => {
	return (
		<LoaderDiv
			transition={{ type: 'spring', duration: 1, mass: 1, repeat: Infinity }}
			animate={{ rotateZ: 360 }}
		>
			<BsHourglassBottom />
		</LoaderDiv>
	)
}

export default Loader
