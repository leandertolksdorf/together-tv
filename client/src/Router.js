import { Redirect, Route, Switch } from "wouter"
import App from "./App"
import Subpage from "./Subpage"

function Router() {
  const getRandomId = () => Math.random().toString(36).substr(2, 12)
  return (
    <Switch>
      <Route path="/imprint">
        <Subpage>
          <h1>Imprint</h1>
          <p>
            Leander Tolksdorf<br />
            Onckenstr. 15<br />
            12435 Berlin<br />
            Germany
          </p>
          <p>
            admin@leander-tolksdorf.de
          </p>
        </Subpage>
      </Route>
      <Route path="/about">
        <Subpage>
          <h1>
            About this project
          </h1>
          <p>
            TogetherTV was built for fun and educational purposes.
          </p>
          <p>
            The app uses <a href="https://expressjs.com/">ExpressJS</a> and <a href="https://developer.mozilla.org/de/docs/Web/API/WebSockets_API">WebSockets</a> for the backend and <a href="https://reactjs.org/">React</a> for the frontend.
            TogetherTV is open source. The code is available and open for contribution on GitHub.
          </p>
          <h1>
            About the author
          </h1>
          <p>
            I'm Leander Tolksdorf, a web developer from Berlin, Germany.<br />
            You can visit my website on <a href="https://farbig.media">farbig | media</a>.
          </p>
        </Subpage>
      </Route>
      <Route path="/room/:id">
        {params => <App id={params.id} />}
      </Route>
      <Route>
        <Redirect to={`/room/${getRandomId()}`} />
      </Route>
    </Switch>
  )
}

export default Router