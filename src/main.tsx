import ReactDOM from 'react-dom/client';
import App from './components/App/App.tsx';
import './index.scss';
import 'bulma/css/bulma.min.css';

import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
