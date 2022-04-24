// Function to convert a JS Buffer object to a binary string (example: '10011')
export function convertBufferToBinaryString(buf) {
    const hex2bin = (data) => data.split('').map(i =>
        parseInt(i, 16).toString(2).padStart(4, '0')).join('');
    let hex = buf.toString('hex')
    return hex2bin(hex)
}
// Function to find the parity
export function findParity(x) {
    let y = x ^ (x >> 1);
    y = y ^ (y >> 2);
    y = y ^ (y >> 4);
    y = y ^ (y >> 8);
    y = y ^ (y >> 16);
 
    // Rightmost bit of y holds the parity value
    // if (y&1) is 1 then parity is odd else even
    if (y & 1)
        return 1;
    return 0;
}