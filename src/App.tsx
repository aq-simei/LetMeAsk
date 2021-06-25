import {BrowserRouter, Route, Switch} from 'react-router-dom'
import { Home } from "./Pages/Home";
import { NewRoom } from "./Pages/NewRoom";
import {AuthContextProvider} from './Contexts/AuthContext'
import { Room } from './Pages/Room';

function App() {
  return ( 
    <BrowserRouter>
    <AuthContextProvider>
    <Switch>
    <Route path='/' exact component={Home} />  
    <Route path='/rooms/new' component={NewRoom} />
    <Route path='/rooms/:id' component={Room} />
    </Switch>
    </AuthContextProvider>
  </BrowserRouter>
  );
}


export default App;
