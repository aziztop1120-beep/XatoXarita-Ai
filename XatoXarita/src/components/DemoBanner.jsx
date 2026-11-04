import { FlaskConical } from 'lucide-react';

export default function DemoBanner({ children }) {
  return (
    <div className="demo-banner" role="status">
      <FlaskConical size={16} /> <span>{children}</span>
    </div>
  );
}
