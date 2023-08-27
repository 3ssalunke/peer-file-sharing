interface FabProps {
  [key: string]: unknown;
  children: React.ReactNode;
  text?: string;
  variant?: 'sm' | 'lg' | 'auto';
  className?: string;
}

function Fab({ children, text, ...props }: FabProps) {
  return (
    <button aria-label={text} {...props}>
      {children}
      <div>{text}</div>
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
