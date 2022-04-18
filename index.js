import { generateMnemonic, readMnemonic } from "./utils/bip39.js";

const words = generateMnemonic()
const seed = readMnemonic(words.join(' '))

console.log(seed)