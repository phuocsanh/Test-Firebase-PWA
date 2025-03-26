import forbidden from './assets/images/403.jpg';

import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './components/ui/button';
import { backToHomeLabel } from './constant';

const Error403 = () => {
  const navigate = useNavigate();

  return (
    <div className=" flex h-full w-full flex-col items-center justify-center">
      <img src={forbidden} width={400} height={800} />
      <Button className="gap-2" onClick={() => navigate('/sign-in')}>
        <Home size={16} />
        {backToHomeLabel}
      </Button>
    </div>
  );
};

export default Error403;
