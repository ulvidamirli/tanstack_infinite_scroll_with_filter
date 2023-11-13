export const removeEmptyParams = (queryString: string) => {
  return queryString.replace(/[^=&]+=(?:&|$)/g, "");
};
