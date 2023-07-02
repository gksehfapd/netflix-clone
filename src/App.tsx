import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './Routes/Home'
import Search from './Routes/Search'
import Tv from './Routes/Tv'
import Header from './Components/Header'
import { HelmetProvider } from 'react-helmet-async'

const App = () => {
	return (
		<HelmetProvider>
			<Router>
				<Header />
				<Switch>
					<Route path="/tv">
						<Tv />
					</Route>
					<Route path="/search">
						<Search />
					</Route>
					<Route path={['/', '/movies/:movieId']}>
						<Home />
					</Route>
				</Switch>
			</Router>
		</HelmetProvider>
	)
}

export default App
