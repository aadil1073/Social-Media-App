import bcrypt from 'bcrypt';

// hashed password
export const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if(err) {
                reject(err)
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) {
                    reject(err)
                }
                resolve(hash)
            })
        })
    })
}

// compare password

export const comparePassword = (password, hashed) => {
    return bcrypt.compare(password, hashed);
}