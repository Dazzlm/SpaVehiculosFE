import React from 'react';
import { Tooltip, Button } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const TooltipComponent = ({ tooltipText = 'Este es un tooltip informativo' }) => {
  return (
    <Tooltip title={tooltipText}   arrow placement="top">
      <HelpOutlineIcon sx={{ color: 'info.main', fontSize: 30 }} />
    </Tooltip>
  );
};

export default TooltipComponent;
