const nodemailer = require("nodemailer");

const sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "חובה למלא את כל השדות" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"PubliShare" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, 
      subject: `הודעה חדשה מ-${name}`,
      html: `
        <h3>פנייה חדשה מהאתר:</h3>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>אימייל:</strong> ${email}</p>
        <p><strong>הודעה:</strong><br/>${message}</p>
      `,
    });

    res.json({ message: "ההודעה נשלחה בהצלחה!" });
  } catch (error) {
    console.error("שגיאה בשליחת מייל:", error);
    res.status(500).json({ error: "שליחת ההודעה נכשלה, נסה שוב מאוחר יותר" });
  }
};

module.exports = { sendContactMessage };
