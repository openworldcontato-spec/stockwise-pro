import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import POS from './pages/POS';
import Help from './pages/Help';
import Sales from './pages/Sales';
import Customers from './pages/Customers';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Products": Products,
    "POS": POS,
    "Help": Help,
    "Sales": Sales,
    "Customers": Customers,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};