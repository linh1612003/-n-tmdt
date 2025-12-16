import React from 'react';
import { Paper, makeStyles } from '@material-ui/core';

// Tạo style cho khung báo cáo
const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    margin: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    display: 'block'
  }
}));

const PowerBIReport = () => {
  const classes = useStyles();

  // Link bảo mật nội bộ Power BI với autoAuth và ctid
  const secureLink = "https://app.powerbi.com/reportEmbed?reportId=41d0d0e2-cd15-4a2d-939e-4b84911bb59b&autoAuth=true&ctid=e7572e92-7aee-4713-a3c4-ba64888ad45f";

  return (
    <Paper elevation={3} className={classes.root}>
      <iframe
        title="tmdt"
        src={secureLink}
        className={classes.iframe}
        frameBorder="0"
        allowFullScreen={true}
      ></iframe>
    </Paper>
  );
};

export default PowerBIReport;

