import express from "express";
import axios from "axios";

const app = express();

/* 🔴 EDIT THESE VALUES */
const SHOP = ".myshopify.com";
const CLIENT_ID = "";
const CLIENT_SECRET = "";
const REDIRECT_URI = "https://shopify-oauth.onrender.com/callback";
/* 🔴 END */

const SCOPES = "read_products,read_inventory";

app.get("/", (req, res) => {
  res.send("<h2>Shopify OAuth Server Running ✅</h2>");
});

app.get("/auth", (req, res) => {
  const shop = "longivitate.myshopify.com"; // 👈 REQUIRED
  const scopes = "read_products,read_inventory,write_inventory";

  const authUrl =
    `https://${shop}/admin/oauth/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&scope=${scopes}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&state=nonce`;

  res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
  const { code, shop } = req.query;

  if (!code || !shop) {
    return res.send("Authorization code or shop missing");
  }

  try {
    const tokenRes = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code
      }
    );

    res.send(`
      <h2>OAuth Successful ✅</h2>
      <pre>${tokenRes.data.access_token}</pre>
    `);
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.send("OAuth failed at token step");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);







