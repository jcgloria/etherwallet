import { generateMnemonic, readMnemonic } from "./utils/bip39.js";

const words = generateMnemonic(128)
const seed = readMnemonic(words.join(' '))

console.log(words)
console.log(seed)


