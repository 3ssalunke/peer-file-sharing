import './index.scss';

interface FabProps {
  [key: string]: unknown;
  children: React.ReactNode;
  text?: string;
  variant?: 'sm' | 'lg' | 'auto';
  className?: string;
}

function Fab({ children, className, text, variant, ...props }: FabProps) {
  return (
    <button
      className={`btn fab ${variant} ${className}`}
      aria-label={text}
      {...props}
    >
      {children}
      <div className="lg-text">{text}</div>
      <slot />
    </button>
  );
}

Fab.defaultProps = {
  variant: 'auto',
  text: '',
  className: '',
};

export default Fab;
