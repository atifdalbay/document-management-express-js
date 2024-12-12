const { body, validationResult } = require('express-validator');
const { User, Document } = require('../models');
const multer = require('multer');
const path = require('path');
const { where } = require('sequelize');

const filePath = '/uploads/documents/';

// Dosya yükleme ayarları (sadece .pdf dosyalarını kabul eder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public' + filePath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.pdf`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

// 1. Doküman Yükleme Endpointi
exports.uploadDocument = [
  upload.single('document'),

  async (req, res) => {
    try {
      const { id: user_id } = req.user; // Kullanıcı ID'si, JWT ile authenticate edilmiş kullanıcıdan alınır.
      // Dosya var mı kontrol et
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Dokümanı kaydet
      const document = await Document.create({
        user_id,
        document: filePath + req.file.filename,
      });

      res.status(201).json({ message: 'Document uploaded successfully', document });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

// 2. Kullanıcı Evrak Listesi ve Durumu Endpointi
exports.getDocuments = async (req, res) => {
  try {

    // Kullanıcıyı bul
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let documents;

    // Kullanıcının rolüne göre dokümanları al
    if (user.role === 'third_party') {
      documents = await Document.findAll({ where: { user_id: req.user.id } });
    } else {
      documents = await Document.findAll();
    }

    res.status(200).json({ documents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDocumentStatus = [
  body('status').isIn(['approved', 'pending','rejected']).withMessage('Status must be approved or rejected'),
  body('comment').optional().isString().withMessage('Comment must be a string'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { documentId } = req.params;
      const { status, comment } = req.body;
      //const user = await User.findByPk(req.user.id);

      if (req.user.role !== 'human_resources') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const document = await Document.findByPk(documentId);
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      document.status = status;
      document.comment = comment || null;
      await document.save();

      res.status(200).json({ message: `Document ${status} successfully`, document });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];
