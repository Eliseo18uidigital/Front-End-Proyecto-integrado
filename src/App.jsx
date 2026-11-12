import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import Generos from './pages/Generos';
import Directores from './pages/Directores';
import Productoras from './pages/Productoras';
import Tipos from './pages/Tipos';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
        <span className="navbar-brand">Películas Admin</span>
        <div className="navbar-nav">
          <NavLink className="nav-link" activeClassName="active" to="/generos">Géneros</NavLink>
          <NavLink className="nav-link" activeClassName="active" to="/directores">Directores</NavLink>
          <NavLink className="nav-link" activeClassName="active" to="/productoras">Productoras</NavLink>
          <NavLink className="nav-link" activeClassName="active" to="/tipos">Tipos</NavLink>
          {/* Media: lo agregan tus compañeros */}
        </div>
      </nav>

      <div className="container mt-4">
        <Switch>
          <Route path="/generos" component={Generos} />
          <Route path="/directores" component={Directores} />
          <Route path="/productoras" component={Productoras} />
          <Route path="/tipos" component={Tipos} />
          <Route exact path="/" component={Generos} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;