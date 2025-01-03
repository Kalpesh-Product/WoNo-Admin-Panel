import { RouterProvider } from 'react-router-dom';
import { routes } from './routes/Routes';

function App() {
  return (
    <div className='flex w-full'>
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
