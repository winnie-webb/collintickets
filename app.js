const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const qr = require("qr-image");
const { db } = require("./firebaseConfig");
const { upload, uploadToFirebase } = require("./multerConfig");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("dashboard");
});
app.get("/generator", (req, res) => {
  res.render("generator");
});
app.post("/generate", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.render("generator", { msg: err });
    } else {
      if (
        !req.files ||
        !req.files["backgroundImage"] ||
        !req.files["eventLogo"]
      ) {
        res.render("generator", { msg: "No file selected!" });
      } else {
        const { title, date, location, endDate, numTickets } = req.body;

        const backgroundImageFile = req.files["backgroundImage"][0];
        const eventLogoFile = req.files["eventLogo"][0];
        const backgroundImageUrl = await uploadToFirebase(backgroundImageFile);
        const eventLogoUrl = await uploadToFirebase(eventLogoFile);

        const tickets = [];
        for (let i = 0; i < numTickets; i++) {
          const ticketId = uuidv4();
          const qrSvg = qr.imageSync(ticketId, { type: "svg" });

          const ticket = {
            id: ticketId,
            title,
            backgroundImage: backgroundImageUrl,
            eventLogo: eventLogoUrl,
            date,
            location,
            numTickets,
            // endDate,
            qrSvg,
            scanned: false,
          };

          await db.collection("tickets").doc(ticketId).set(ticket);
          tickets.push(ticket);
        }

        res.render("ticket", { tickets });
      }
    }
  });
});

app.get("/scan", (req, res) => {
  res.render("scan");
});

app.get("/scanner/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ticketRef = db.collection("tickets").doc(id);
    const ticketDoc = await ticketRef.get();

    if (ticketDoc.exists) {
      const ticket = ticketDoc.data();
      if (ticket.scanned) {
        res.send("Already scanned!!! Scan another ticket!");
      } else {
        await ticketRef.update({ scanned: true });
        res.send("Ticket successfully scanned. Scan another ticket!");
      }
    } else {
      res.send("Invalid ticket!");
    }
  } catch (error) {
    res.status(500).send("Error scanning ticket: " + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
