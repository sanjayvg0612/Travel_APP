const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json());

// Path helper
const DATA_DIR = path.join(__dirname, 'data');
const readJSON = (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return [];
  }
};

const writeJSON = (filename, data) => {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// 1. Health Checks (ALB Target Group Health Checks)
// Supports both '/' and '/api/health' for AWS ALB Target Group health checks
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Wanderlust Travel API',
    healthCheck: '/api/health'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Wanderlust Travel API',
    version: '1.0.0'
  });
});

// 2. Destinations Endpoints
app.get('/api/destinations', (req, res) => {
  const destinations = readJSON('destinations.json');
  const { continent, popular } = req.query;

  let filtered = destinations;
  if (continent) {
    filtered = filtered.filter(d => d.continent.toLowerCase() === continent.toLowerCase());
  }
  if (popular === 'true') {
    filtered = filtered.filter(d => d.popular);
  }

  res.json({
    success: true,
    total: filtered.length,
    data: filtered
  });
});

app.get('/api/destinations/:id', (req, res) => {
  const destinations = readJSON('destinations.json');
  const item = destinations.find(d => d.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Destination not found' });
  }
  res.json({ success: true, data: item });
});

// 3. Tour Packages Endpoints
app.get('/api/packages', (req, res) => {
  const packages = readJSON('packages.json');
  let result = packages;
  const { q, category, maxPrice, minDuration, maxDuration, destinationId, featured } = req.query;

  if (q) {
    const term = q.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(term) ||
      p.destinationName.toLowerCase().includes(term) ||
      p.summary.toLowerCase().includes(term)
    );
  }

  if (category && category !== 'all') {
    result = result.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (destinationId) {
    result = result.filter(p => p.destinationId === destinationId);
  }

  if (maxPrice) {
    const cap = parseFloat(maxPrice);
    if (!isNaN(cap)) {
      result = result.filter(p => (p.discountPriceUSD || p.priceUSD) <= cap);
    }
  }

  if (minDuration) {
    const min = parseInt(minDuration, 10);
    if (!isNaN(min)) {
      result = result.filter(p => p.durationDays >= min);
    }
  }

  if (maxDuration) {
    const max = parseInt(maxDuration, 10);
    if (!isNaN(max)) {
      result = result.filter(p => p.durationDays <= max);
    }
  }

  if (featured === 'true') {
    result = result.filter(p => p.featured);
  }

  res.json({
    success: true,
    total: result.length,
    data: result
  });
});

app.get('/api/packages/:id', (req, res) => {
  const packages = readJSON('packages.json');
  const item = packages.find(p => p.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Package not found' });
  }
  res.json({ success: true, data: item });
});

// 4. Reviews Endpoints
app.get('/api/reviews', (req, res) => {
  const reviews = readJSON('reviews.json');
  const { packageId } = req.query;

  let filtered = reviews;
  if (packageId) {
    filtered = filtered.filter(r => r.packageId === packageId);
  }

  res.json({
    success: true,
    total: filtered.length,
    data: filtered
  });
});

app.post('/api/reviews', (req, res) => {
  const { packageId, author, location, rating, trip, comment } = req.body;

  if (!author || !rating || !comment) {
    return res.status(400).json({
      success: false,
      message: 'Author name, rating (1-5), and review comment are required.'
    });
  }

  const reviews = readJSON('reviews.json');
  const newReview = {
    id: `rev-${Date.now()}`,
    packageId: packageId || 'general',
    author: author.trim(),
    avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=200&q=80`,
    location: location ? location.trim() : 'Verified Explorer',
    rating: Math.min(5, Math.max(1, parseInt(rating, 10) || 5)),
    date: new Date().toISOString().split('T')[0],
    trip: trip || 'Curated Journey',
    comment: comment.trim()
  };

  reviews.unshift(newReview);
  writeJSON('reviews.json', reviews);

  res.status(201).json({
    success: true,
    message: 'Review successfully submitted! Thank you for sharing your experience.',
    data: newReview
  });
});

// 5. Bookings Endpoints
app.get('/api/bookings', (req, res) => {
  const bookings = readJSON('bookings.json');
  const { email, code } = req.query;

  if (code) {
    const booking = bookings.find(b => b.id.toLowerCase() === code.toLowerCase());
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    return res.json({ success: true, data: booking });
  }

  if (email) {
    const filtered = bookings.filter(b => b.email.toLowerCase() === email.toLowerCase());
    return res.json({ success: true, data: filtered });
  }

  res.json({
    success: true,
    total: bookings.length,
    data: bookings
  });
});

app.post('/api/bookings', (req, res) => {
  const {
    packageId,
    packageTitle,
    travelerName,
    email,
    phone,
    travelDate,
    guests,
    roomType,
    selectedAddons,
    totalPriceUSD,
    specialRequests
  } = req.body;

  if (!travelerName || !email || !travelDate || !packageId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required booking details: travelerName, email, travelDate, packageId.'
    });
  }

  const randomRef = Math.floor(1000 + Math.random() * 9000);
  const currentYear = new Date().getFullYear();
  const bookingId = `TRV-${currentYear}-${randomRef}`;

  const newBooking = {
    id: bookingId,
    packageId,
    packageTitle: packageTitle || 'Custom Vacation Package',
    travelerName: travelerName.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : 'N/A',
    travelDate,
    guests: guests || { adults: 1, children: 0 },
    roomType: roomType || 'standard',
    selectedAddons: selectedAddons || [],
    totalPriceUSD: totalPriceUSD || 0,
    specialRequests: specialRequests ? specialRequests.trim() : '',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  const bookings = readJSON('bookings.json');
  bookings.unshift(newBooking);
  writeJSON('bookings.json', bookings);

  res.status(201).json({
    success: true,
    message: 'Booking confirmed successfully!',
    voucherCode: bookingId,
    data: newBooking
  });
});

// 6. Newsletter Subscription Endpoint
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email address is required.' });
  }

  res.json({
    success: true,
    message: 'Welcome to the Wanderlust Explorer Club! Your $150 gift voucher code is WANDER150.',
    voucherCode: 'WANDER150',
    discountAmount: 150
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`===============================================`);
  console.log(`  Wanderlust Travel API Server running!        `);
  console.log(`  Binding: http://${HOST}:${PORT}/api/health   `);
  console.log(`===============================================`);
});
