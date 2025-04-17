import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', // '/api' если используешь прокси
  timeout: 10000,
})

// Interceptor для обработки ошибок и логирования
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Можно добавить глобальное логирование или обработку ошибок
    if (error.response) {
      // Сервер вернул ошибку
      console.error('API error:', error.response.status, error.response.data)
      alert(`Ошибка API: ${error.response.status}`)
    } else if (error.request) {
      // Нет ответа от сервера
      console.error('Нет ответа от сервера')
      alert('Нет ответа от сервера')
    } else {
      // Ошибка при настройке запроса
      console.error('Ошибка запроса:', error.message)
      alert('Ошибка запроса: ' + error.message)
    }
    return Promise.reject(error)
  }
) 