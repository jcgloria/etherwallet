import { generateMnemonic, readMnemonic } from "./utils/bip39.js";

const words = generateMnemonic(128)
const seed = readMnemonic(words.join(' '))

console.log(words)
console.log(readMnemonic([
    'swarm',   'that',
    'coffee',  'razor',
    'easy',    'blur',
    'legend',  'polar',
    'vicious', 'level',
    'pact',    'siege'
  ].join(' ')))


