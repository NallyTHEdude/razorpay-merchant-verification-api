// TODO: this is mock implementation of phone number verificaiton, call api in production
export const verifyPhoneNumber = async (phoneNumber: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        // Simulate an API call
        setTimeout(() => {
            if (phoneNumber && phoneNumber.length === 10) {
                resolve(true);
            } else {
                reject(new Error('Invalid phone number'));
            }
        }, Math.random() * 1000 + 500); // .5 - 1.5s delay
    });
};