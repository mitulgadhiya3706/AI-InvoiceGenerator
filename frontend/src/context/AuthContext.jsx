// import React, { createContext, useContext, useEffect, useState } from 'react'

// export const AuthContext = createContext(null)

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const storedUser = localStorage.getItem('authUser')
//     if (storedUser) {
//       setUser(JSON.parse(storedUser))
//     }
//     setLoading(false)
//   }, [])

//   const login = (userData) => {
//     setUser(userData)
//     localStorage.setItem('authUser', JSON.stringify(userData))
//   }

//   const logout = () => {
//     setUser(null)
//     localStorage.removeItem('authUser')
//   }

//     return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext)