import React, {useState} from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import auth from './../auth/auth-helper'
import {remove} from './api-user.js'
import {Redirect} from 'react-router-dom'

// DeleteUser recibe props (userId en este caso) del componente padre (Profile)
export default function DeleteUser(props) {
  // Se define open como falso para el componente del dialogo 
  const [open, setOpen] = useState(false)
  // Se define redirect como falso para que no se renderice por defecto
  const [redirect, setRedirect] = useState(false)

  const jwt = auth.isAuthenticated()

  const clickButton = () => {
    setOpen(true)
  }
  const deleteAccount = () => { 
    remove({
      userId: props.userId
    }, {t: jwt.token}).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        auth.clearJWT(() => console.log('deleted'))
        setRedirect(true)
      }
    })
  }
  const handleRequestClose = () => {
    setOpen(false)
  }

  if (redirect) {
    return <Redirect to='/'/>
  }
    return (<span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <DeleteIcon/>
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{"Delete Account"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteAccount} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>)

}
// Verifica el tipo de las props recogidas por este componente
DeleteUser.propTypes = {
  userId: PropTypes.string.isRequired
}