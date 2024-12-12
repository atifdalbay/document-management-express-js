const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');

require('dotenv').config();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
