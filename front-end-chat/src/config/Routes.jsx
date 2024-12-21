import React from 'react'
import { Route, Routes } from 'react-router'
import App from '../App'
import ChatPage from '../components/ChatPage'

const AppRoutes = () => {
  return (
     <Routes>
    <Route path="/" element={<App />} />
    <Route path="/chat" element={<ChatPage/>} />
  <Route path="/about" element={<h1>This is about page</h1>} />
  <Route path="*" element={<h1>404 Page not found</h1>} />
  </Routes>
  )
}

export default AppRoutes