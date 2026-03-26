import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios.get('/api/jokes')
      .then(response => {
        setJokes(response.data)
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error fetching jokes:', error)
      })
  }, [])

  return (
    <>
      <h1>Connecting Backend with Frontend</h1>
      <h3>Total Number of Jokes: {jokes.length}</h3>
      {
        jokes.map((joke, index)=>{
          return (
            <div key={joke.id}>
              <span>{index+1}</span>
              <h2>{joke.title}</h2>
              <p>{joke.joke}</p>
            </div>
          )
        })
      }
    </>
  )
}

export default App
