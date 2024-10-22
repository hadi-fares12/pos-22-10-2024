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

export default function InvKindDialog(props) {
  const handleCloseTotalDetails = () => {
    props.setOpenInvKind(false);
  };
  return (
    <Dialog open={props.openInvKind} onClose={handleCloseTotalDetails}>
      <DialogTitle sx={{ fontSize: "1.8rem" }}>Invoice Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h1">Delivery:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h1" align="right">
              {props.countDelivery}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h1">TakeAway:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h1" align="right">
              {" "}
              {props.countTakeaway}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h1">Table:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h1" align="right">
              {props.countTable}
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
}
