import PeopleIcon from '@mui/icons-material/People';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Shopping from '@mui/icons-material/ShoppingCartCheckout';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Calendar from '@mui/icons-material/CalendarMonth';
import Provider from '@mui/icons-material/AssignmentInd';
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import BathtubIcon from '@mui/icons-material/Bathtub';

export const NavbarItems =[
    {
        id: 0,
        icon: <SettingsSuggestIcon/>,
        label: 'Configuración',
        subitems: [
            { label: 'Roles', route: '/configuracion/roles', icon: <PeopleIcon /> },
          
          ],
    },
    {
        id: 1,
        icon: <PeopleIcon />,
        label: 'Usuarios',
        subitems: [
          { label: 'Administradores', route: '/Usuarios/Administradores', icon: <PeopleIcon /> },
          { label: 'Empleados', route: '/Usuarios/Empleados', icon: <PeopleIcon /> },
          { label: 'Clientes', route: '/Usuarios/Clientes',icon: <PeopleIcon /> },
        ],
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
        subitems: [
            { label: 'Compras', route: '/compras', icon: <PeopleIcon /> },
            { label: 'Proveedores', route: '/compras/Proveedores', icon: <PeopleIcon /> },
          ],
    },
    {
        id: 4,
        icon: <ShoppingBagIcon/>,
        label: 'Insumos',
        subitems: [
            { label: 'Insumos', route: '/insumos', icon: <PeopleIcon /> },
            { label: 'Categorias', route: '/insumos/Categorias', icon: <PeopleIcon /> },
          ],
    },
    {
        id: 5,
        icon: <Calendar/>,
        label: 'Agendamiento',
        subitems: [
            { label: 'Agenda', route: '/agendamiento', icon: <CleanHandsIcon /> },
            { label: 'Servicios', route: '/agendamiento/Servicios', icon: <BathtubIcon /> },
          ],
    },

]