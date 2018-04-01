// remove last character to prevenft from getting last item
export const getEndAtKey = (key: string) => key.slice(0, -1);

// added '~' to prevent from getting last item
export const getStartAtKey = (key: string) => `${key}~`;
