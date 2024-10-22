import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
} from "@mui/material";

export default function InvTotalDialog(props) {
     const handleCloseTotalDetails = () => {
       props.setOpenTotalDetail(false);
     };
  return (
    <Dialog open={props.openTotalDetail} onClose={handleCloseTotalDetails}>
      <DialogTitle sx={{ fontSize: "1.8rem" }}>Invoice Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h1">Total Qty:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h1" align="right">
              {Number(props.totalQty).toFixed(3)}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h1">Gross Total:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h1" align="right">
              {Number(props.grossTotal).toFixed(3)}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h1">Service:</Typography>
          </Grid>
          {/* <Grid item xs={4}>
            <Typography variant="h1" align="right">
              {props.srv}%
            </Typography>
          </Grid> */}
          <Grid item xs={6}>
            <Typography variant="h1" align="right">
              {Number(props.srvValue).toFixed(3)}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h1">Discount</Typography>
          </Grid>
          {/* <Grid item xs={4}>
            <Typography variant="h1" align="right">
              {props.disc}%
            </Typography>
          </Grid> */}
          <Grid item xs={6}>
            <Typography variant="h1" align="right">
              {Number(props.discValue).toFixed(3)}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h1">Total</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h1" align="right">
              {Number(props.totalDiscount).toFixed(3)}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h1">Tax</Typography>
          </Grid>
          {/* <Grid item xs={4}>
            <Typography variant="h1" align="right">
              {`11%`}
            </Typography>
          </Grid> */}
          <Grid item xs={6}>
            <Typography variant="h1" align="right">
              {Number(props.totalTax).toFixed(3)}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h1">Total</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h1" align="right">
              {Number(props.totalInv).toFixed(3)}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleCloseTotalDetails}
          color="secondary"
          variant="contained"
          sx={{ fontSize: "1rem" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

