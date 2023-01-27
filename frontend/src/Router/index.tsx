import Layout from 'Layout'
import ActiveProjects from 'Pages/ActiveProjects'
import Home from 'Pages/Home'
import Proposals from 'Pages/Proposals'
import Rewards from 'Pages/Rewards'
import Votes from 'Pages/Votes'
import React from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import routes from 'routes'
import authHeader from 'services/auth-header'
import LogIn from 'User/Auth/LogIn'
import SignUp from 'User/Auth/SignUp'
import ThanksPage from 'User/Auth/ThanksPage'
import history from './history'

export default () => {
  const [accessToken, setAccessToken] = React.useState<string>(authHeader().Authorization)

  return (
    <Router history={history}>
      <Switch>
        <Route path={routes.auth.root()} render={() =>
          <Switch>
            <Route path={routes.auth.logIn()}>
              <LogIn setAccessToken={(str: string) => setAccessToken(str)} />
            </Route>
            <Route path={routes.auth.signUp()}>
              <SignUp setAccessToken={(str: string) => setAccessToken(str)} />
            </Route>
            <Route path={routes.auth.thanksPage()}>
              <ThanksPage setAccessToken={(str: string) => setAccessToken(str)} />
            </Route>
          </Switch>
        } />
        <Route render={() => accessToken ? <Layout>
          <Switch>
            <Route path={routes.root()} exact component={Home} />
            <Route path={routes.proposals()} exact component={Proposals} />
            <Route path={routes.votes()} exact component={Votes} />
            <Route path={routes.activeProjects()} exact component={ActiveProjects} />
            <Route path={routes.rewards()} exact component={Rewards} />
          </Switch>
        </Layout> : <Redirect to={routes.auth.logIn()} />} />
      </Switch>
    </Router>
  )
}