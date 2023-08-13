function log(message: string) {
  if (process.env.NODE_ENV === 'production') return;
  const date = new Date();
  console.log(
    `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${message}`
  );
}

export default log;
