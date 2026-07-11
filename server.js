require('dotenv').config();
const express = require('express');
const { Resend } = require('resend');
const cors    = require('cors');

const app    = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

app.post('/contact', async (req, res) => {
  const { fname, lname, email, company, service, message } = req.body;

  if (!fname || !email) {
    return res.status(400).json({ ok: false, error: 'Name and email required.' });
  }

  try {
    await resend.emails.send({
      from: 'Arka Arts <onboarding@resend.dev>',
      to:   process.env.TO_EMAIL,
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
    res.json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Arka Arts server running → http://localhost:${PORT}`);
});
