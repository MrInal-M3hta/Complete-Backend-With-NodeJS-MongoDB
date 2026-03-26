import express from "express";

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// 📦 Array to store notes
let notes = [];

/*
-----------------------------------
GET → Get all notes
-----------------------------------
*/
app.get("/notes", (req, res) => {
  res.json(notes);
});

/*
-----------------------------------
POST → Add new note
-----------------------------------
*/
app.post("/notes", (req, res) => {
  const { text } = req.body;
  // console.log("req.body for POST:",req.body)

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  const newNote = {
    id: Date.now(),
    text
  };

  notes.push(newNote);

  res.status(201).json({
    message: "Note added",
    note: newNote
  });
});

/*
-----------------------------------
PUT → Update note
-----------------------------------
*/
app.put("/notes/:id", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  const note = notes.find(n => n.id == id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  note.text = text;

  res.json({
    message: "Note updated",
    note
  });
});

/*
-----------------------------------
DELETE → Delete note
-----------------------------------
*/
app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  console.log(id)

  const index = notes.findIndex((element, index, array) => {
    console.log("element",element)
    console.log('index:', index)
    console.log("array", array)
    return element.id === id
  });
  console.log("return index", index)
/*
|____________________________________|
|Argument  |    Meaning              |
|__________|_________________________|
|element   |   Current item in array |
|index     |    Current position     |
|array     |    Full array           |
|------------------------------------|
*/
  if (index === -1) {
    return res.status(404).json({ message: "Note not found" });
  }

  const deletedNote = notes.splice(index, 1);
/*
  👉 splice() does 2 things:
	1.	Removes item from array
	2.	Returns removed item
*/

  res.json({
    message: "Note deleted",
    note: deletedNote
  });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});