import {scrypt,randomBytes}  from 'crypto';

const salt = 'fc5643fb686c96e633b16c200c901ad1'; // randomBytes(16).toString("hex")

async function _hash(password:string):Promise<string> {
    return new Promise((resolve, reject) => {
       scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey.toString('hex'))
        });
    })
};
    
async function _verify(password:string, hash:string):Promise<boolean> {
    return new Promise((resolve, reject) => {
        scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(hash == derivedKey.toString('hex'))
        });
    })
}

export const hash = _hash;
export const verify = _verify;