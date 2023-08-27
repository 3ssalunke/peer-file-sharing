import './Pill.scss';

const Pill = (props: { children: string[] }) => {
  return <span className="pill" {...props} />;
};

export default Pill;
