import { generateMnemonic, readMnemonic } from "./bip39.js";

const words = generateMnemonic()
const seed = readMnemonic(words.join(' '))

console.log(seed)