import { useState } from 'react'

function App() {
  const [books, setBooks] = useState([])
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get('name')

    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${name}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setBooks(data.docs)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-12">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <label className="block mb-4">
          <span className="text-gray-300">Title:</span>
          <input type="text" name="name" className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
        </label>
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
          Submit
        </button>
      </form>
      <div className="mt-8 w-full max-w-2xl">
        {error && <p className="text-red-500">{error}</p>}
        {books.map((doc) => (
          <div key={doc.key} className="bg-gray-800 p-6 my-4 border border-gray-700 rounded-md shadow-md flex flex-col md:flex-row">
            <div className="flex-shrink-0">
              <img src={`https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`} alt={doc.title} className="w-32 h-48 object-cover rounded-md" />
            </div>
            <div className="mt-4 md:mt-0 md:ml-6">
              <h2 className="text-2xl font-bold text-white">{doc.title}</h2>
              <p className="text-gray-400">{doc.author_name?.join(', ')}</p>
              <p className="text-gray-500">{doc.first_publish_year}</p>
              <p className="text-gray-500">{doc.publisher?.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
