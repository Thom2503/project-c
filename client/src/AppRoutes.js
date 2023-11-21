import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Agenda } from "./components/Agenda";
import { Kamers } from "./components/Kamers";
import {Supplies} from "./components/Supplies";
import { Nieuws } from './components/Nieuws';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import {CreateAccount} from "./components/CreateAccount";
=======
import { ModifyNews } from './components/ModifyNews'; 
import { ReadNews } from './components/ReadNews';
>>>>>>> Stashed changes
=======
import { ModifyNews } from './components/ModifyNews'; 
import { ReadNews } from './components/ReadNews';
>>>>>>> Stashed changes

const AppRoutes = [
  {
    element: <Home />
  },
  {
    index: true,
    path: '/login',
    element: <Login />
  },
  {
    path: '/agenda',
    element: <Agenda />
  },
  {
    path: '/kamers',
    element: <Kamers />
  },
  {
    path: '/voorzieningen',
    element: <Supplies />
  },
  {
    path: '/Nieuws',
    element: <Nieuws />
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  },
  {
	path: '/create',
	element: <CreateAccount />
=======
=======
>>>>>>> Stashed changes
  },
  {
    path: '/nieuws/modify/:newsId',
    element: <ModifyNews />
  },
  {
    path: '/nieuws/read/:newsId',
    element: <ReadNews />
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  }
];

export default AppRoutes;