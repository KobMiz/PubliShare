import {
  Box,
  Typography,
  Container,
  Divider,
  Button,
  useTheme,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ShareIcon from "@mui/icons-material/Share";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 6,
        minHeight: "100vh",
        backgroundColor: theme.palette.background.paper,
        animation: "fadeIn 1s ease-in",
        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <Container maxWidth="md">
        <Box textAlign="center" mb={5}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.info.light
                  : theme.palette.primary.main,
            }}
          >
            PubliSh
            <ShareIcon
              fontSize="inherit"
              sx={{
                verticalAlign: "middle",
                mx: 0.5,
                animation: "float 3s ease-in-out infinite",
                "@keyframes float": {
                  "0%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-6px)" },
                  "100%": { transform: "translateY(0px)" },
                },
              }}
            />
            are
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mt={1}>
            שתפו רעיונות. התחברו לאנשים. בנו קהילה.
          </Typography>
        </Box>

        <Divider sx={{ mb: 5 }} />

        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <InfoIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            קצת עלינו
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body1"
            paragraph
            color="text.primary"
            sx={{ mb: 2 }}
          >
            PubliShare היא פלטפורמה חברתית שנוצרה מתוך מטרה אחת ברורה: לאפשר לכל
            אחד ואחת לשתף את הרעיונות, המחשבות והיצירות שלהם – בצורה חופשית,
            פשוטה ודינמית.
          </Typography>

          <Typography
            variant="body1"
            paragraph
            color="text.primary"
            sx={{ mb: 2 }}
          >
            באתר ניתן לשתף טקסטים, תמונות, קישורים, סרטונים ועוד. ניתן לסמן
            פוסטים כאהובים, להגיב, להתחבר לאנשים אחרים ולעקוב אחר התוכן שמעניין
            אתכם באמת.
          </Typography>

          <Typography variant="body1" paragraph color="text.primary">
            כל זה קורה בתוך חוויית משתמש נוחה, מונגשת ומותאמת אישית.
          </Typography>
        </Box>

        <Divider sx={{ my: 5 }} />

        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          color="text.primary"
        >
          למה בנינו את זה?
        </Typography>

        <Typography
          variant="body1"
          paragraph
          color="text.primary"
          sx={{ mb: 2 }}
        >
          הרעיון ל־PubliShare נולד מתוך צורך במרחב שיתופי אמיתי, שבו כל משתמש
          מקבל את המקום שלו. אנחנו מאמינים בכוח של קהילה, של תוכן איכותי, ושל
          שיתוף בונה.
        </Typography>

        <Typography variant="body1" paragraph color="text.primary">
          אם הגעתם עד כאן – תודה שאתם חלק מהדרך שלנו ❤️
        </Typography>

        <Box textAlign="center" mt={6}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ContactMailIcon />}
            sx={{ px: 4, py: 1.5, fontSize: "1rem", direction: "ltr" }}
            onClick={() => navigate("/contact")}
          >
            צרו קשר
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
