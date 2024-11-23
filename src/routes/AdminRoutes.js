const express = require('express');
const router = express.Router();
const { authAdminMiddleware } = require('../middleware/authMiddleware');

router.post('/', authAdminMiddleware, (req, res) => {
    // Nếu qua được middleware, người dùng có quyền admin, trả về trang admin
    res.send('Welcome to Admin Dashboard');
});

module.exports = router;
