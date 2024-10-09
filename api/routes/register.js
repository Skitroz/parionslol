const db = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
const i18n = require('../i18n');
require('dotenv').config();
const router = Router();

router.post('/', async (req, res) => {
    const lang = req.headers['accept-language'] || 'fr';
    i18n.setLanguage(lang);

    const { username, password, email } = req.body;

    if (!username){
        return res.status(400).json({ message: i18n.translate('MISSING_USERNAME') });
    } else if (!password){
        return res.status(400).json({ message: i18n.translate('MISSING_PASSWORD') });
    } else if (!email){
        return res.status(400).json({ message: i18n.translate('MISSING_EMAIL') });
    } else if (!username || !password || !email) {
        return res.status(400).json({ message: i18n.translate('MISSING_FIELDS') });
    } else if (!email.includes('@')) {
        return res.status(400).json({ message: i18n.translate('EMAIL_INVALID') });
    } else if (email.length < 6 || email.length > 50) {
        return res.status(400).json({ message: i18n.translate('EMAIL_LENGTH') });
    } else if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ message: i18n.translate('USERNAME_LENGTH') });
    } else if (password.length < 6 || password.length > 20) {
        return res.status(400).json({ message: i18n.translate('PASSWORD_LENGTH') });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            throw err;
        }

        if (results.length > 0) {
            return res.status(400).json({ message: i18n.translate('USER_EXISTS') });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO users SET ?', { username: username, password: hashedPassword, email: email }, (err, results) => {
            if (err) {
                throw err;
            }
            const token = jwt.sign({ id: results.insertId }, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.status(201).json({ message: i18n.translate('USER_CREATED'), token });
        });
    });
});

module.exports = router;