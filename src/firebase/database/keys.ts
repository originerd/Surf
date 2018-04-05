// remove last character to prevenft from getting last item if key is string
// minus 1 to prevent from getting last item if key is number
export const getEndAtKey = (key: string | number) => {
  if (typeof key === 'string') {
    return key.slice(0, -1);
  }

  return key - 1;
};

// add '~' to prevent from getting last item if key is string
// plus 1 to prevent from getting last item if key is number
export const getStartAtKey = (key: string | number) => {
  if (typeof key === 'string') {
    return `${key}~`;
  }

  return key + 1;
};
