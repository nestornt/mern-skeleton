import { signout } from './api-auth'
 
const auth = {

    authenticate(jwt, cb) {
        if (typeof window !== "undefined")
        // Guarda las credenciales en sessionStorage del navegador una vez que se sepa que haya una ventana activa
        // asegurándose de que el código se está ejecutando en un navegador
            sessionStorage.setItem('jwt', JSON.stringify(jwt))
            // Función callback que habilita el componente donde Sign-in es llamado
            cb()
    },

    isAuthenticated() {

        if (typeof window == "undefined")
            return false

        if (sessionStorage.getItem('jwt'))
            return JSON.parse(sessionStorage.getItem('jwt'))
        else
            return false
    },

    clearJWT(cb) {
        if (typeof window !== "undefined")
        // Elimina la credencial de autenticación de sessionStorage
            sessionStorage.removeItem('jwt')
        // cb permite al componente llamar a la función signout    
        cb()
        // Opcional para las cookies
        signout().then((data) => {
            document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        })
    }
}

export default auth