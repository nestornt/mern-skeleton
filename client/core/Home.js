import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import profileImg from './../assets/images/profile.jpg'
//* makeStyles es un hook API que proviene de Material-UI, necesita recibir una
//* función por parametro para retornarnos el acceso a nuestro tema personalizado
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        marginTop: theme.spacing(5)
    },
    title: {
        padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle 
    },
    media: {
        minHeight: 400
    }
}))
//? Los objetos JSS definidos anteriormente serán inyectados al componente usando
//? el hook personalizado que nos devuelve makeStyles

// Export de componente funcional
export default function Home() {
    const classes = useStyles()
    return (
        <Card className={classes.card}>
            <Typography variant="h6" className={classes.title}>
                Home Page
            </Typography>
            <CardMedia className={classes.media} image={profileImg} title="Unicorn Bicycle"/>
            <CardContent>
                <Typography variant="body2" component="p">
                    Welcome to MERN Skeleton home page
                </Typography>
            </CardContent>
        </Card> 
    )
}
