const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = function (req, res, next) {
const authHeader = req.headers['authorization'] || '';
const token = authHeader.split(' ')[1];
if (!token) return res.status(401).json({ message: 'No token provided' });
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = payload;
next();
} catch (err) {
return res.status(401).json({ message: 'Invalid or expired token' });
}
};