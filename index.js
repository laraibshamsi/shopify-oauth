import express from "express";
import axios from "axios";

const app = express();

/* 🔴 EDIT THESE VALUES */
const SHOP = "longivitate.myshopify.com";
const CLIENT_ID = "eee6afe3a382bdc3eb1e49978bd50828";
const CLIENT_SECRET = "3f532f5795070f54a2ef833bd26ad647";
const REDIRECT_URI = "https://YOUR_DOMAIN/callback";
/* 🔴 END */

const SCOPES = "read_products,read_inventory";

app.get("/", (req, res) => {
  res.send("<h2>Shopify OAuth Server Running ✅</h2>");
});

app.get("/auth", (req, res) => {
  const authUrl =
    `https://${SHOP}/admin/oauth/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&scope=${SCOPES}` +
    `&redirect_uri=${REDIRECT_URI}`;

  res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.send("Missing authorization code");
  }

  try {
    const tokenResponse = await axios.post(
      `https://${SHOP}/admin/oauth/access_token`,
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code
      }
    );

    const accessToken = tokenResponse.data.access_token;

    res.send(`
      <h2>OAuth Successful ✅</h2>
      <p><strong>Access Token (valid 24 hours):</strong></p>
      <textarea rows="5" cols="80">${accessToken}</textarea>
      <p>Copy this token and use it for GraphQL / REST calls.</p>
    `);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.send("OAuth failed. Check server logs.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

