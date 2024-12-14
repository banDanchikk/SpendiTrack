
import MainPage from './pages/Main-Page';
import ProfilePage from './pages/Profile-Page'
import StatisticPage from './pages/Statistic-Page'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './register-components/LoginPage';
import PrivateRoute from './register-components/PrivateRoute';
import AuthProvider from './register-components/AuthContext';
import RegisterPage from './register-components/RegisterPage';

function App() {
  return (
      <AuthProvider>
          <Router>
              <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                      path="/profile"
                      element={
                          <PrivateRoute>
                              <ProfilePage />
                          </PrivateRoute>
                      }
                  />
                  <Route
                      path="/statistics"
                      element={
                          <PrivateRoute>
                              <StatisticPage />
                          </PrivateRoute>
                      }
                  />
              </Routes>
          </Router>
      </AuthProvider>
  );
}

export default App;
