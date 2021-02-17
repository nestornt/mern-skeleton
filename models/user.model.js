import mongoose from 'mongoose'

//? Trim: Parsea los espacios en blanco y los reduce solo al texto introducido
//? La password actual (no en encriptada) no se guarda en la bd por seguridad

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    // Para indicar cuando un usuario es creado
    created: {
        type: Date,
        default: Date.now
      },
    // Para indicar cuando un usuario es creado 
    updated: Date,
    // Representa la password encriptada
    hashed_password: {
        type: String,
        required: "Password is required"
    },
    // Almacena el texto generado por la funcion de encriptacion
    salt: String
})

//? La password definida por el usuario no se define en el documento de usuario,
//? por lo que será definida cómo un campo virtual por motivos de seguridad
// Funcion manejadora de recibir y encriptar la password
UserSchema
    // Propiedades virtuales no se reflejan en la bd (tienen set y get)
    .virtual('password')
    // Define la password con el setter
    .set(function(password) {
        //? _password es atributo interno de clase UserSchema
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    // Recibe la password con el getter
    .get(function() {
        return this._password
    })

UserSchema.methods = {
    //* Este metodo verifica los intentos de logueo de un usuario comparando la passsword introducida con la de la bd
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    //* Genera un hash encriptado a partir de la password (en texto plano) + un valor salt unico usando el modulo crypto de node
    encryptPassword: function(password) {
        if (!password) return ''
        try {
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex')
        } catch (err) {
            return ''
        }
    },
    //* Metodo que genera un unico y un aleatorio valor salt usando el tiempo actual y la funcion rand
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}

// Añade validación con restricciones para que sea una password segura
UserSchema.path('hashed_password').validate(function(v) {
    if (this._password && this._password.length < 6) {
      this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password) {
      this.invalidate('password', 'Password is required')
    }
}, null)

export default mongoose.model('User', UserSchema)