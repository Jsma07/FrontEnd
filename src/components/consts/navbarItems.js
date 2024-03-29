import PeopleIcon from '@mui/icons-material/People';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Shopping from '@mui/icons-material/ShoppingCartCheckout';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Calendar from '@mui/icons-material/CalendarMonth';
import Provider from '@mui/icons-material/AssignmentInd';

export const NavbarItems =[
    {
        id: 0,
        icon: <SettingsSuggestIcon/>,
        label: 'Roles',
        route: '/roles'
    },
    {
        id: 1,
        icon: <PeopleIcon/>,
        label: 'Usuarios',
        route: '/usuarios'
    },
    {
        id: 2,
        icon: <Shopping/>,
        label: 'Ventas',
        route: '/ventas'
    },
    {
        id: 3,
        icon: <ShoppingBagIcon/>,
        label: 'Compras',
        route: '/compras'
    },
    {
        id: 4,
        icon: <Calendar/>,
        label: 'Agendamiento',
        route: '/agendamiento'
    },
    {
        id: 5,
        icon: <Provider/>,
        label: 'Proveedores',
        route: '/proveedores'
    },
]