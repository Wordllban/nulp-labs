import './App.css';
import Vacancy from './components/pages/Vacancy/Vacancy';
import { useState, useEffect } from 'react';
import { IRecruiter } from './types/responses';
import { requestRecruiters } from './services/api';

function App() {
  const [recruiters, setRecruiters] = useState<IRecruiter[]>([]);

  useEffect(() => {
    requestRecruiters().then((result) => setRecruiters(result));
  }, []);

  return (
    <div>
      <Vacancy recruiters={recruiters} />
    </div>
  );
}

export default App;
