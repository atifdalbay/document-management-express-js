const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/upload', authMiddleware, documentController.uploadDocument);
router.get('/', authMiddleware, documentController.getDocuments);
router.put('/:documentId', authMiddleware, documentController.updateDocumentStatus);

module.exports = router;
