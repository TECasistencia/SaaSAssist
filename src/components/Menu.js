import React from "react";
import { Drawer, List, ListItem, ListItemText } from "@material-ui/core";

function Menu() {
  return (
    <Drawer variant="permanent" anchor="right">
      <List>
        <ListItem button>
          <ListItemText primary="Opción 1" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Opción 2" />
        </ListItem>
        {/* Agrega más opciones según sea necesario */}
      </List>
    </Drawer>
  );
}

export default Menu;
