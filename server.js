const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve all static files from the current directory
app.use(express.static(path.join(__dirname)));

// Fallback to welcome.html or index.html for single-page style routing if needed
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'welcome.html')); // Change to index.html if that's your main entry
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});