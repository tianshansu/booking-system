import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function SummaryCard(props) {
  return (
    <Card sx={{ minWidth: 100 }}>
      <CardContent>
        <Typography>{props.title}</Typography>
        <Typography sx={{ fontSize: "30px", fontWeight: "600" }}>
          {props.count}
        </Typography>
        <Typography sx={{ fontSize: "12px" }}>{props.comment}</Typography>
      </CardContent>
    </Card>
  );
}
