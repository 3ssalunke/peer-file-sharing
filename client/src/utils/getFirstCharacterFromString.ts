export default function getFirstCharacterFromString(str: string) {
  return String.fromCodePoint(str.codePointAt(0)!);
}
