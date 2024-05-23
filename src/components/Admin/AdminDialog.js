import { Dialog, DialogContent } from "@mui/material";
import React from "react";
import ModalAdmin from "../../modals/ModalAdmin";

const AdminDialog = ({ open, handleClose, isEdit, admin }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <ModalAdmin isEdit={isEdit} admin={admin} handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default AdminDialog;
