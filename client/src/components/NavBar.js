import React, { Component } from 'react'
import AppBar  from "@material-ui/core/AppBar";
import Toolbar  from "@material-ui/core/Toolbar";
import Typography  from "@material-ui/core/Typography";


export default function NavBar() {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="title" color="inhreit">
                        React & Material-UI
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    )
}
