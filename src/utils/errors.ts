export const getErrorMessageFromE = (e: unknown) => {
  let msg = ''; // error under useUnknownInCatchVariables

  if (typeof e === 'string') {
    // @ts-ignore
    msg = e?.message || e.toUpperCase(); // works, `e` narrowed to string
  } else if (e instanceof Error) {
    msg = e.message; // works, `e` narrowed to Error
  }

  return msg || '';
};
