import { createHmac, createHash } from 'crypto'
import pkg from 'bs58';
const { encode }  = pkg;
import { generatePublicKeyFromPrivateKeyData ,uint256} from '@enumatech/secp256k1-js';
import { convertBufferToBinaryString, findParity } from './general.js'

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
    const privateKey = uint256(Il, 16)
    const publicKey = generatePublicKeyFromPrivateKeyData(privateKey)
    const yString = convertBufferToBinaryString(Buffer.from(publicKey.y, 'hex'))
    let data_pub;
    if(findParity(yString)){
        data_pub = Buffer.concat([Buffer.from('02', 'hex'), Buffer.from(publicKey.x, 'hex')])
    }else{
        data_pub = Buffer.concat([Buffer.from('03', 'hex'), Buffer.from(publicKey.x, 'hex')])
    }
    const data_priv = Buffer.concat([Buffer.alloc(1),Il])
    const raw_priv = Buffer.concat([version_priv,depth,fp,child,Ir,data_priv])
    const raw_pub = Buffer.concat([version_pub, depth,fp,child,Ir,data_pub])
    const priv_hash = createHash('sha256').update(raw_priv).digest()
    const priv_hash2 = createHash('sha256').update(priv_hash).digest()
    const pub_hash = createHash('sha256').update(raw_pub).digest()
    const pub_hash2 = createHash('sha256').update(pub_hash).digest()
    //Concat checksum (double sha256) and base58 encode
    const xpriv = encode(Buffer.concat([raw_priv,priv_hash2.slice(0,4)]))
    const xpub = encode(Buffer.concat([raw_pub, pub_hash2.slice(0,4)])) 
    console.log('XPUB')
    console.log(xpub)
    console.log('xpub661MyMwAqRbcGczjuMoRm6dXaLDEhW1u34gKenbeYqAix21mdUKJyuyu5F1rzYGVxyL6tmgBUAEPrEz92mBXjByMRiJdba9wpnN37RLLAXa')
    console.log('XPRIV')
    console.log(xpriv)
    console.log('xprv9s21ZrQH143K48vGoLGRPxgo2JNkJ3J3fqkirQC2zVdk5Dgd5w14S7fRDyHH4dWNHUgkvsvNDCkvAwcSHNAQwhwgNMgZhLtQC63zxwhQmRv')

}

generateMasterKey('3ddd5602285899a946114506157c7997e5444528f3003f6134712147db19b678')
