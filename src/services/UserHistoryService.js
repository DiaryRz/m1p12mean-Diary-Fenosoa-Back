const UserHistory = require('../models/UserHistory');

class UserHistoryService {
    async createUserHistory(user) {
        try {
            const userHistory = new UserHistory({
                _id: user._id,
                date_registration: user.date_registration,
                name: user.name,
                firstname: user.firstname,
                mail: user.mail,
                phone: user.phone,
                password: user.password,
                birth_date: user.birth_date,
                CIN: user.CIN,
                gender: user.gender,
                role_id: user.role_id,
                date_dismissal: new Date()
            });
            return await userHistory.save();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserHistoryService();