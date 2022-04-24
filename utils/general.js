export function convertBufferToBinaryString(buf) {
    const hex2bin = (data) => data.split('').map(i =>
        parseInt(i, 16).toString(2).padStart(4, '0')).join('');
    let hex = buf.toString('hex')
    return hex2bin(hex)
}