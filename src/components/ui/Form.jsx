const Form = ({ children, onSubmit, ...props }) => {
  const handleSubmit = (event) => {
    event.preventDefault();

    return onSubmit(event.target.elements);
  };

  return (
    <form onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  );
};

export default Form;
