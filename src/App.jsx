import { useState, useEffect } from 'react'

function App() {
  const [books, setBooks] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [visibleBooks, setVisibleBooks] = useState(10)
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  const loadMoreBooks = () => {
    setVisibleBooks((prev) => prev + 10)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true)
      } else {
        setShowScrollToTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-12">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">LibSearch 📚</h1>
        <p className="text-lg text-gray-600">Encontre seus livros favoritos de forma rápida e fácil! 🔍</p>
      </header>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <label className="block mb-4">
          <span className="text-gray-300">Title:</span>
          <input type="text" name="name" className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white" />
        </label>
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
          Submit
        </button>
      </form>
      {loading && <p>Carregando...</p>}
      <div className="mt-8 w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
        {error && <p className="text-red-500">{error}</p>}
        {books.slice(0, visibleBooks).map((doc) => (
          <div key={doc.key} className="bg-gray-800 p-4 border border-gray-700 rounded-md shadow-md flex flex-col">
            <div className="flex-shrink-0">
              <img src={`https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`} alt={doc.title} className="w-full h-48 object-cover rounded-md" />
            </div>
            <div className="mt-4 flex-grow">
              <h2 className="text-xl font-bold text-white">{doc.title}</h2>
              <p className="text-gray-400">{doc.author_name?.join(', ')}</p>
              <p className="text-gray-500">{doc.first_publish_year}</p>
              <p className="text-gray-500">{doc.publisher?.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
      {visibleBooks < books.length && (
        <button onClick={loadMoreBooks} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Carregar mais
        </button>
      )}
      {showScrollToTop && (
        <button onClick={scrollToTop} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
          Voltar ao topo
        </button>
      )}
      <footer className="mt-8 text-center">
        <p>Desenvolvido por Abné Lourenço</p>
        <a href="https://github.com/jedin01/libsearch" target="_blank" rel="noopener noreferrer" className="text-blue-400 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2c-5.523 0-10 4.477-10 10 0 4.418 2.867 8.164 6.843 9.486.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.783.604-3.375-1.344-3.375-1.344-.454-1.153-1.107-1.46-1.107-1.46-.905-.617.069-.605.069-.605 1 .069 1.617 1.031 1.617 1.031.889 1.52 2.334 1.08 2.91.826.092-.645.349-1.08.634-1.327-2.221-.252-4.555-1.11-4.555-4.938 0-1.09.39-1.983 1.029-2.684-.103-.252-.446-1.271.098-2.646 0 0 .84-.27 2.75 1.026A9.563 9.563 0 0112 6.837a9.563 9.563 0 012.25.303c1.91-1.296 2.75-1.026 2.75-1.026.544 1.375.201 2.394.098 2.646.64.701 1.029 1.594 1.029 2.684 0 3.84-2.337 4.684-4.56 4.938.36.309.68.92.68 1.85 0 1.335-.012 2.414-.012 2.743 0 .267.18.577.684.482C21.133 20.164 24 16.418 24 12c0-5.523-4.477-10-10-10z" />
          </svg>
          Repositório no GitHub
        </a>
      </footer>
    </div>
  )
}

export default App
