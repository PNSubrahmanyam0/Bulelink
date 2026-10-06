import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Feed from './components/Feed';
import Upload from './components/Upload';
import Chat from './components/Chat';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50">
        <Navbar user={user} setUser={setUser} />

        <main className="flex-1 pb-20 md:pb-0 md:ml-64">
          <div className="max-w-6xl mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/auth" element={<Auth setUser={setUser} />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
