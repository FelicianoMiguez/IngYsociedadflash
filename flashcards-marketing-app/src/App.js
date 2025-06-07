import React, { useState, useEffect } from 'react';
import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import Flashcard from './components/Flashcard';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  const [p, setP] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, 'flashcards'));
      setFlashcards(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetch();
  }, []);

  const login = async () => {
    const res = await signInWithPopup(auth, provider);
    setUser(res.user);
  };
  const logout = () => {
    signOut(auth);
    setUser(null);
  };
  const addCard = async () => {
    if (!q || !a || !p || !user) return;
    const docRef = await addDoc(collection(db, 'flashcards'), {
      question: q, answer: a, periodo: p, userId: user.uid
    });
    setFlashcards([...flashcards, { id: docRef.id, question: q, answer: a, periodo: p, userId: user.uid }]);
    setQ(''); setA(''); setP('');
  };
  const deleteCard = async (id) => {
    await deleteDoc(doc(db, 'flashcards', id));
    setFlashcards(flashcards.filter(f => f.id !== id));
  };

  return (
    <div className="container">
      <header>
        <h1>Ingeniería y Sociedad</h1>
        {user ? (
          <div><span>Hola, {user.displayName}</span><button onClick={logout}>Salir</button></div>
        ) : (
          <button onClick={login}>Entrar con Google</button>
        )}
      </header>
      <section className="flashcards">
        <h2>Flashcards</h2>
        <div className="cards">
          {flashcards.map(f => (
            <Flashcard key={f.id} data={f} onDelete={user && f.userId === user.uid ? () => deleteCard(f.id) : null} />
          ))}
        </div>
        {user && (
          <div className="form">
            <input placeholder="Pregunta" value={q} onChange={e => setQ(e.target.value)} />
            <input placeholder="Respuesta" value={a} onChange={e => setA(e.target.value)} />
            <input placeholder="Período" value={p} onChange={e => setP(e.target.value)} />
            <button onClick={addCard}>Añadir</button>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;