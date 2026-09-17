// Needed for admin password
function requireAdmin(req, res, next) {
    if (req.body.admin_password === process.env.ADMIN_PASSWORD) return next();
    return res.status(403).send("Wrong admin password");
}

module.exports = requireAdmin;