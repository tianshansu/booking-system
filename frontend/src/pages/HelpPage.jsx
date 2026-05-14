import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Typography,
} from "@mui/material";
import PageContainer from "../components/common/PageContainer";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AiAssistant from "../components/aiAssistant/AiAssistant";

export default function HelpPage() {
  const faqItems = [
    {
      question: "How do I add a new patient or staff member?",
      answer:
        "Go to the People page and click Add Person. Fill in the required details, select the correct role, and save the record.",
    },
    {
      question: "How do I create a new session?",
      answer:
        "Go to the Sessions page and click Add Session. Select the patient, staff member, date, time, and session details before saving.",
    },
    {
      question: "Can I edit or delete existing records?",
      answer:
        "Yes. Use the Edit or Delete actions in the People or Sessions tables to update or remove records.",
    },
  ];
  return (
    <PageContainer>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Card sx={{ px: 2, py: 2, width: { xs: "100%", sm: 800 } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Contact Support
            </Typography>
            <Typography variant="body2">
              Our support team is here to help you with any questions or
              concerns.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <EmailIcon sx={{ color: "primary.main" }} />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2">Email</Typography>
                <Typography variant="body1">
                  support@bookingsystem.com
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <PhoneIcon sx={{ color: "primary.main" }} />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body2">Phone</Typography>
                <Typography variant="body1">(03) 5550 1234</Typography>
              </Box>
            </Box>
          </Box>
        </Card>
        <Card sx={{ px: 2, py: 2, width: { xs: "100%", sm: 800 } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Frequently Asked Questions
            </Typography>
            <Typography variant="body2">
              Quick answers to common questions
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {faqItems.map((item, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{item.question}</Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Typography variant="body2">{item.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Box>
        </Card>
      </Box>

      <AiAssistant></AiAssistant>
    </PageContainer>
  );
}
