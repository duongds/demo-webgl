import { createBrowserRouter, RouterProvider } from 'react-router'
import About from '../pages/About'
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'

/**
 * Application Router Configuration
 * 
 * Routes:
 * - / : Home (3D Gallery)
 * - /about : About page
 * - * : 404 Not Found
 */
const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/about',
        element: <About />,
    },
    {
        path: '*',
        element: <NotFound />,
    },
])

const AppRouter = () => {
    return <RouterProvider router={router} />
}

export default AppRouter
