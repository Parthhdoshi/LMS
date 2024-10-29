import React from "react";
import { BsWhatsapp } from "react-icons/bs";
import { WhatsAppIcon } from "../components/Admin/sidebar/Icon";
import { Icon, Tooltip } from "@mui/material";

const WhatsAppHelpDesk = () => {
  return (
    <>
      <div className="fixed bottom-2 right-3 z-11150">
        <a
          rel="noopener"
          target="_blank"
          >
          <WhatsAppIcon fontSize="large" color="success"/>
        </a>
      </div>
    </>
  );
};

export default WhatsAppHelpDesk;
