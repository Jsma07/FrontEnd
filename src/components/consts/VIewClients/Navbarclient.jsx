import React from "react";

function NavbarClient() {
  return (
    <nav className="bg-white shadow-md py-4 font-sans fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <Menu />
        <div className="flex items-center">
          <Auth />
        </div>
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <div className="flex items-center ml-4 lg:ml-10">
      <img src="/jacke.png" alt="Logo" className="h-12 w-12 mr-2" />
      <span className="text-lg font-bold text-black">Jake Nails</span>
    </div>
  );
}

function Menu() {
  return (
    <ul className="flex justify-end items-center space-x-10">
      <MenuItem href="/vistaInicio" text="Inicio" />
      <MenuItem href="/servicios" text="Servicios" />
      <MenuItem href="/agendamiento" text="Agendamiento" />
      <MenuItem href="/contacto" text="Contacto" />
    </ul>
  );
}

function MenuItem({ href, text }) {
  return (
    <li>
      <a
        href={href}
        className="text-black hover:text-purple-900 transition duration-300 ease-in-out"
      >
        <span className="uppercase">{text}</span>
      </a>
    </li>
  );
}

function Auth() {
  return (
    <a
      href="/iniciarSesion"
      className="text-black hover:text-purple-900 transition duration-300 ease-in-out flex items-center ml-4 lg:ml-2"
    >
      <span className="uppercase">Iniciar sesión</span>
      <i className="bx bxs-user-circle text-4xl text-black-700 ml-2"></i>
    </a>
  );
}

export default NavbarClient;
