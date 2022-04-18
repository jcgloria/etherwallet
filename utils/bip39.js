import { randomBytes, createHash, pbkdf2Sync } from "crypto"
import { readFile } from 'fs/promises';

const words = JSON.parse(
    await readFile(
        new URL('./english.json', import.meta.url)
    )
);

function convertBufferToBinaryString(buf) {
    let result = [];
    for (let i = 0; i < buf.length; i++) {
        result.unshift(buf[i].toString(2).padStart(8, "0"));
    }
    return result.join("");
}

//Generates an array of mnemonic words based on a 128-bit entropy.
export function generateMnemonic() {
    //Obtain seed of ENT bits. 128 <= ENT <=256 && ENT % 32 = 0.
    const bitLength = 128
    const initialSeed = randomBytes(bitLength / 8)

    //Generate checksum by taking the first ENT/32 bits of its SHA256 hash. 
    const cs = bitLength / 32
    const hash = createHash('sha256').update(initialSeed).digest()
    const checksum = convertBufferToBinaryString(hash).slice(0, cs)

    //Append checksum to initial seed.
    const seed = convertBufferToBinaryString(initialSeed) + checksum

    //Calculate number of words for mnemonic. 
    const ms = (bitLength + cs) / 11

    //Split seed into 11 bit chunks to generate the required number of mnemonic words. Map the index with the word list.
    let chunks = []
    for (let i = 1; i <= ms; i++) {
        let chunk = seed.slice((i - 1) * 11, i * 11)
        chunks.push(words[parseInt(chunk, 2)])
    }
    return chunks
}

export function readMnemonic(sentence){
    //Run pbkf2 algorithm with parameters defined in bips39 spec. No passphrase is used.
    const key = pbkdf2Sync(sentence, 'mnemonic', 2048, 64, 'sha512')
    return key.toString('hex')
}





