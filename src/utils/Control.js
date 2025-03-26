const control_phone_number = (phone_number) => {
    try {
        if (!phone_number.startsWith("261")) {
            throw new Error("Le numéro de téléphone doit commencer par 261");
        }
        if (phone_number.length !== 12) {
            throw new Error("Le numéro de téléphone doit contenir 12 chiffres avec le 261");
        }
        return phone_number;
    } catch (error) {
        throw error; 
    }
};

const generateTicket = () => {
    // Générer la date et heure actuelle au format YYYYMMDDHHmmss
    const now = new Date();
    const dateStr = now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');

    // Générer 4 lettres aléatoires
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomLetters = '';
    for(let i = 0; i < 4; i++) {
        randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    // Générer 4 chiffres aléatoires
    const randomNumbers = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

    let randomLetters2 = '';
    for(let i = 0; i < 4; i++) {
        randomLetters2 += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    // Combiner le tout
    return `${dateStr}${randomLetters}${randomNumbers}${randomLetters2}`;
};

module.exports = {
    control_phone_number,
    generateTicket
};
