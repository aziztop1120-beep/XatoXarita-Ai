export default function Field({ label, id, error, icon: Icon, children, ...props }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        {Icon && <Icon size={18} />}
        {children || <input id={id} {...props} />}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
