import axios from 'axios';
import { useState } from 'react';

const API_URL = 'https://pronostico-api.facyndev.repl.co/api/weather'

function App() {

  const [fields, setFields] = useState({
    query: ""
  })
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const { query } = fields;

  const onChange = async (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value })
    setErrors(null)

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setLoading(true)
    setTypingTimeout(
      setTimeout(async () => {
        try {
          const response = await axios.post(API_URL, fields);
          setResults([response.data.data]);
        } catch (error) {
          setErrors(error.response.data.message);
        } finally {
          setLoading(false)
        }
      }, 2000)
    )
  }

  const onSubmit = async () => {
    setLoading(true)
    await axios.post(API_URL, fields)
      .then(({ data }) => {
        setResults([data.data])
      })
      .catch((e) => {
        setErrors(e.response.data.message)
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <div className="w-full h-screen">
      <h1 className="text-center text-4xl font-bold text-gray-50 bg-blue-400 w-fit mx-auto p-5 rounded-xl mt-3">Pronostico Grieco</h1>
      <div className="flex flex-col justify-center my-10 w-3/4 mx-auto gap-10">
        <div className="w-full">
          <label for="query" class="block mb-2 text-lg font-medium text-gray-50">Ubicación</label>
          <div className='flex items-center gap-2'>
            <input
              type="text"
              id="query"
              name="query"
              class="transition-all text-lg rounded-lg block w-full p-3 bg-gray-700 placeholder-gray-400 text-white focus:outline focus:outline-blue-400 focus:ring-4"
              placeholder="Ingrese ubicación..."
              value={query}
              onChange={(e) => onChange(e)}
              required />
            <button className='p-3 rounded-lg text-white bg-blue-400 text-lg' onClick={onSubmit}>Buscar</button>
          </div>
          {errors && <p className='mt-2 text-red-400'>{errors}</p>}
        </div>
        <div>
          <span className="block mb-2 text-lg font-medium text-gray-50">Resultados</span>
          {loading ? (
            <p className='text-yellow-400'>Obteniendo resultados...</p>
          ) : (
            <>
              {results && !errors ? (
                <>
                  {fields.query ? <p className='text-green-400'>Resultados para <strong>{fields.query}</strong> obtenidos correctamente.</p> : <></>}
                  <div className='flex flex-col gap-2 p-3 bg-gray-700 rounded-lg border border-gray-500 text-white'>
                    {results?.map(({ current, location }) => (
                      <div className='flex items-start justify-between'>
                        <div>
                          <span className='text-gray-300'>Resultados para <strong>{location.name}, {location.region}</strong></span>
                          <div className='flex items-center gap-2'>
                            <img
                              className='w-24 h-24'
                              src={current.condition.icon}
                              alt={current.condition.text} />
                            <h3 className='font-bold text-2xl'>{current.temp_c} °C | {current.temp_f} °F</h3>
                          </div>
                          <div className='flex flex-col text-xs text-gray-300'>
                            <span>Humedad: {current.humidity}%</span>
                            <span>Viento: a {current.wind_kph} km/h ({current.wind_mph} mp/h)</span>
                          </div>
                        </div>
                        <div className='text-xl font-bold'>
                          es de {current.is_day === 1 ? <span className='text-yellow-400'>Día</span> : <span className='text-slate-950'>Noche</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className='text-yellow-400'>Sin resultados</p>
              )}
            </>
          )}
        </div>
      </div>

      <h3 className='w-3/4 mx-auto text-center text-xl text-white'>Proyecto realizado por <a href="https://facyn.xyz" target='_blank' className='font-bold text-blue-400'>Facundo Grieco</a>.</h3>
    </div>
  )
}

export default App
