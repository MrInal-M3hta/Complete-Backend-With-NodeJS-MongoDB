import express from 'express'; // It is an ES module, so we use import to import it

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.get('/api/jokes', (req, res)=>{
    const jokes = [
        {
            id:1,
            title:"Why don't scientists trust atoms?",
            joke:"Why don't scientists trust atoms? Because they make up everything!"
        },
        {
            id:2,
            title:"Why did the scarecrow win an award?",
            joke:"Why did the scarecrow win an award? Because he was outstanding in his field!"
        },
        {
            id:3,
            title:"Why don't skeletons fight each other?",
            joke:"Why don't skeletons fight each other? They don't have the guts!"
        }
    ];
    res.json(jokes);
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});