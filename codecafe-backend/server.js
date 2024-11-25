const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db"); // ייבוא חיבור מסד הנתונים

const app = express();
const PORT = 5000; // השרת ירוץ על פורט 5000

// Middleware
app.use(cors()); // מאפשר ל-Frontend לתקשר עם השרת
app.use(bodyParser.json()); // מאפשר לנתח בקשות בפורמט JSON

// *** API ENDPOINTS ***

// שמירת מפגש חדש
app.post("/api/meetups", (req, res) => {
  const { name, location, date, time } = req.body;

  const query = `INSERT INTO meetups (name, location, date, time) VALUES (?, ?, ?, ?)`;
  db.run(query, [name, location, date, time], function (err) {
    if (err) {
      console.error("Error inserting meetup:", err);
      res.status(500).json({ message: "שגיאה בשמירת המפגש" });
    } else {
      res.status(201).json({
        message: "מפגש נשמר בהצלחה",
        meetup: { id: this.lastID, name, location, date, time },
      });
    }
  });
});

// קבלת כל המפגשים
app.get("/api/meetups", (req, res) => {
  const query = `SELECT * FROM meetups`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching meetups:", err);
      res.status(500).json({ message: "שגיאה בקבלת המפגשים" });
    } else {
      res.json(rows);
    }
  });
});

// מחיקת מפגש לפי ID
app.delete("/api/meetups/:id", (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM meetups WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      console.error("Error deleting meetup:", err);
      res.status(500).json({ message: "שגיאה במחיקת המפגש" });
    } else {
      res.json({ message: "המפגש נמחק בהצלחה", deletedID: id });
    }
  });
});

app.put("/api/meetups/:id", (req, res) => {
    const { id } = req.params;
    const { name, location, date, time } = req.body;
  
    const query = `UPDATE meetups SET name = ?, location = ?, date = ?, time = ? WHERE id = ?`;
    db.run(query, [name, location, date, time, id], function (err) {
      if (err) {
        console.error("Error updating meetup:", err);
        res.status(500).json({ message: "שגיאה בעדכון המפגש" });
      } else {
        res.json({ message: "המפגש עודכן בהצלחה", updatedID: id });
      }
    });
  });
  

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
