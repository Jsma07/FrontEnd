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
        icon: <BusinessIcon/>,
        label: 'Compras',
        subitems: [
            { label: 'Compras', route: '/compras', icon: <ShoppingBagIcon/> },
            { label: 'Proveedores', route: '/compras/proveedores', icon: <Diversity2 /> },
          ],
    },

    {
        id: 4,
        icon: <Calendar/>,
        label: 'Agendamiento',
        subitems: [
            { label: 'Agenda', route: '/agendamiento', icon: <AccessTimeFilledIcon /> },
            { label: 'Servicios', route: '/agendamiento/Servicios', icon: <BathtubIcon /> },
          ],
    },

    {
        id: 5,
        icon: <Provider/>,
        label: 'Proveedores',
        route: '/proveedores'
    },
]