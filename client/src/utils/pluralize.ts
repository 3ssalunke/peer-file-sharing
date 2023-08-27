export default function pluralize(
  numItems: number,
  singularStr: string,
  pluralStr: string
) {
  return numItems > 1 ? pluralStr : singularStr;
}
