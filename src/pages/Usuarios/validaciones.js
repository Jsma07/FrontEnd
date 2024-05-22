



export const ValidacionNombre = (e) =>{
    const { name, value } = e.target;
    const CaracteresEspeciales = /^[a-zA-Z\s]*$/;
    if (!CaracteresEspeciales.test(value)) {
        window.Swal.fire({
          icon: 'error',
          title: `${name.charAt(0).toUpperCase() + name.slice(1)} inválido`,
          text:`El campo ${name.charAt(0).toUpperCase() + name.slice(1)} no puede contener caracteres especiales ni números.`,
        });
        return; // No actualizar el estado si el valor no es válido
      }
}

export const ValidacionTelefono = (e) =>{
    const { name, value } = e.target;
    const validacionNumeros= /^[0-9]+$/;
    const maxNumeros = 15
      if(!validacionNumeros.test(value)){
        return;
      }
      if(value.length > maxNumeros){
        window.Swal.fire({
          icon: 'error',
          title: 'Teléfono inválido',
          text: `El campo ${name.charAt(0).toUpperCase() + name.slice(1)} no puede exceder ${maxNumeros} caracteres.`,
        });
        return;
      }
}
