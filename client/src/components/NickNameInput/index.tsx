interface NickNameInputProps {
  input: {
    [key: string]: unknown;
  };
}

function NickNameInput({ input }: NickNameInputProps) {
  return (
    <label htmlFor="nickname">
      <span>Nickname</span>
      <input
        required
        type="text"
        name="nickname"
        maxLength={10}
        aria-label="Enter a nickname"
        placeholder="Cool nickname"
        {...input}
      />
    </label>
  );
}

export default NickNameInput;
