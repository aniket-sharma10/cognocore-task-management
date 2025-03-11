import { Loader2 } from 'lucide-react';

const Spinner = () => (
    <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
    </div>
);

export default Spinner;
