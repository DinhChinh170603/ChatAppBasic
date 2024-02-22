import {Routes, Route, Navigate} from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from 'react-bootstrap';
import NavBar from './components/NavBar';
import { ChatContextProvider } from './context/ChatContext';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <ChatContextProvider user={user}>
        <NavBar />
        <Container className='text-secondary'>
          <Routes>
            <Route path="/" element={user ? <Chat /> : <Login />} />              {/* Home */}
            <Route path="/login" element={user ? <Chat /> : <Login />} />
            <Route path="/register" element={user ? <Chat /> : <Register />} />
            <Route path="*" element={<Navigate to="/" />} />       {/* 404 */}
          </Routes>
        </Container>
      </ChatContextProvider>
    </>
  );
}

export default App;
