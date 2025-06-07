import React, { useState, useEffect } from 'react';
import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import Flashcard from './components/Flashcard';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  const [p, setP] = useState('');
  const [filter, setFilter] = useState('all');

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

  const editCard = async (card) => {
    const newQ = prompt('Pregunta', card.question);
    if (newQ === null) return;
    const newA = prompt('Respuesta', card.answer);
    if (newA === null) return;
    const newP = prompt('Período', card.periodo);
    if (newP === null) return;
    await updateDoc(doc(db, 'flashcards', card.id), {
      question: newQ,
      answer: newA,
      periodo: newP,
    });
    setFlashcards(
      flashcards.map((f) =>
        f.id === card.id ? { ...f, question: newQ, answer: newA, periodo: newP } : f
      )
    );
  };

  const periods = Array.from(new Set(flashcards.map((f) => f.periodo)));
  const filteredCards = flashcards.filter(
    (f) => filter === 'all' || f.periodo === filter
  );

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
        <select className="filter" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Todos</option>
          {periods.map(per => (
            <option key={per} value={per}>{per}</option>
          ))}
        </select>
        <div className="cards">
          {filteredCards.map(f => (
            <div key={f.id}>
              <Flashcard data={f} />
              {user && f.userId === user.uid && (
                <div className="card-actions">
                  <button className="edit" onClick={() => editCard(f)}>✏️ Edit</button>
                  <button className="delete" onClick={() => deleteCard(f.id)}>🗑️ Delete</button>
                </div>
              )}
            </div>
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