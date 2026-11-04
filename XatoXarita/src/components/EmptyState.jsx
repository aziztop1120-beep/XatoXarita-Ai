import { Inbox } from 'lucide-react';

export default function EmptyState({ title, text, action }) {
  return (
    <div className="state-box">
      <Inbox size={34} />
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}
