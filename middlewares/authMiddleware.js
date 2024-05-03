const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).send({message: 'Access denied. No token provided.' , success: false});
     try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.employeeId) {
            req.body.employeeId = decoded.employeeId;
            req.body.isEmployee = true;
        } else if (decoded.studentId) {
            req.body.studentId = decoded.studentId;
            req.body.isEmployee = false;
        } else {
            throw new Error('Invalid token payload.');
        }
        next();
    } catch (error) {
        return res.status(500).send({message: 'Access denied. Invalid token.' , success: false});
    }

}