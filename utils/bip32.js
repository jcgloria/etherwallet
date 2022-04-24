import { createHmac, createECDH, createHash } from 'crypto'
import pkg from 'bs58';
const { encode }  = pkg;

function generateMasterKey(seed){
    const hmac = createHmac('sha512', 'Bitcoin seed')
    const I = hmac.update(Buffer.from(seed, 'hex')).digest()
    const Il = I.slice(0,32) //secret key
    const Ir = I.slice(32,64) //chain code
    const version_priv = Buffer.from('0488ADE4', 'hex')
    const version_pub = Buffer.from('0488B21E', 'hex')
    const depth = Buffer.alloc(1) //single byte
    const fp = Buffer.alloc(4)
    const index = 0
    const child = Buffer.alloc(4)
    child.writeUInt32BE(index)
    const k_priv = createECDH('secp256k1')
    k_priv.setPrivateKey(Il)
    const K_priv = k_priv.getPublicKey() 
    const data_priv = Buffer.concat([Buffer.alloc(1),k_priv.getPrivateKey()])

    const raw_priv = Buffer.concat([version_priv,depth,fp,child,Ir,data_priv])
    //const raw_pub = xpub + depth + fp + child + Ir + data_pub

    const priv_hash = createHash('sha256').update(raw_priv).digest()
    const priv_hash2 = createHash('sha256').update(priv_hash).digest()
    //Concat checksum (double sha256) and base58 encode
    const xpriv = encode(Buffer.concat([raw_priv,priv_hash2.slice(0,4)])) 
    console.log(xpriv)
    console.log('xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U')

}

generateMasterKey('fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542')
