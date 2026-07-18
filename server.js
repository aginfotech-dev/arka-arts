require('dotenv').config();
const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');

const app = express();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

app.post('/contact', async (req, res) => {
  const { fname, lname, email, company, service, message } = req.body;

  if (!fname || !email) {
    return res.status(400).json({ ok: false, error: 'Name and email required.' });
  }

  try {
    const info = await transporter.sendMail({
      from: `Arka Arts <${process.env.SMTP_USER}>`,
      to:   process.env.TO_EMAIL,
      cc:   email,
      replyTo: email,
      subject: `New Enquiry from ${fname} ${lname}`,
      html: `
        <h2 style="color:#e07c24;">New Project Enquiry — Arka Arts</h2>
        <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;">
          <tr><td style="padding:6px 16px 6px 0;color:#888;">Name</td>    <td><strong>${fname} ${lname}</strong></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#888;">Email</td>   <td><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#888;">Company</td> <td>${company || '—'}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#888;">Service</td> <td>${service || '—'}</td></tr>
        </table>
        <h3 style="margin-top:20px;color:#888;">Message</h3>
        <p style="white-space:pre-wrap;background:#f5f5f5;padding:12px;border-radius:6px;">${message || '—'}</p>
      `,
    });
    console.log('SMTP accepted:', info.accepted, '| rejected:', info.rejected, '| response:', info.response);
    res.json({ ok: true });
  } catch (err) {
    console.error('SMTP error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Arka Arts server running → http://localhost:${PORT}`);
});
