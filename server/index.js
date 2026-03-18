import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs-extra';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.CORS_ORIGIN || "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    methods: ["GET", "POST", "DELETE", "PUT"]
  }
});

const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data', 'contacts.json');
const EVENTS_FILE = path.join(__dirname, 'data', 'events.json');
const WELFARE_FILE = path.join(__dirname, 'data', 'welfare.json');
const LEADERS_FILE = path.join(__dirname, 'data', 'leaders.json');
const SHARING_FILE = path.join(__dirname, 'data', 'sharing.json');
const MICHAEL_GALLERY_FILE = path.join(__dirname, 'data', 'michael_gallery.json');
const RAPHAEL_GALLERY_FILE = path.join(__dirname, 'data', 'raphael_gallery.json');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'st-michael-church',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage });

// Middleware
app.use(cors({
  origin: [process.env.CORS_ORIGIN || "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true
}));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use(bodyParser.json());

// Ensure data directory and file exist
const ensureDataFile = async () => {
  const dir = path.dirname(DATA_FILE);
  if (!(await fs.pathExists(dir))) {
    await fs.ensureDir(dir);
  }
  if (!(await fs.pathExists(DATA_FILE))) {
    await fs.writeJson(DATA_FILE, []);
  }
  if (!(await fs.pathExists(EVENTS_FILE))) {
    await fs.writeJson(EVENTS_FILE, []);
  }
  if (!(await fs.pathExists(WELFARE_FILE))) {
    await fs.writeJson(WELFARE_FILE, []);
  }
  if (!(await fs.pathExists(LEADERS_FILE))) {
    await fs.writeJson(LEADERS_FILE, []);
  }
  if (!(await fs.pathExists(SHARING_FILE))) {
    await fs.writeJson(SHARING_FILE, []);
  }
  if (!(await fs.pathExists(MICHAEL_GALLERY_FILE))) {
    await fs.writeJson(MICHAEL_GALLERY_FILE, []);
  }
  if (!(await fs.pathExists(RAPHAEL_GALLERY_FILE))) {
    await fs.writeJson(RAPHAEL_GALLERY_FILE, []);
  }
};

ensureDataFile();

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// API Endpoints

// POST: Save contact submission
app.post('/api/contacts', async (req, res) => {
  try {
    const newSubmission = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...req.body
    };

    const contacts = await fs.readJson(DATA_FILE);
    contacts.push(newSubmission);
    await fs.writeJson(DATA_FILE, contacts, { spaces: 2 });

    // Emit real-time update
    io.emit('new_submission', newSubmission);

    res.status(201).json({ message: 'Submission saved successfully', data: newSubmission });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET: Retrieve all submissions (Admin only)
app.get('/api/admin/contacts', async (req, res) => {
  try {
    const contacts = await fs.readJson(DATA_FILE);
    res.json(contacts);
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE: Remove contact submission
app.delete('/api/admin/contacts/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`[DELETE] Request to delete submission ID: ${id}`);
  
  try {
    let contacts = await fs.readJson(DATA_FILE);
    const initialCount = contacts.length;
    contacts = contacts.filter(sub => String(sub.id) !== String(id));
    
    if (contacts.length === initialCount) {
      console.warn(`[DELETE] No submission found with ID: ${id}`);
    } else {
      console.log(`[DELETE] Successfully removed submission ID: ${id}`);
    }
    
    await fs.writeJson(DATA_FILE, contacts, { spaces: 2 });
    io.emit('new_submission_deleted', id);
    res.json({ message: 'Submission deleted' });
  } catch (error) {
    console.error(`[DELETE] Error deleting contact ${id}:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET: All events
app.get('/api/events', async (req, res) => {
  try {
    const events = await fs.readJson(EVENTS_FILE);
    res.json(events);
  } catch (error) {
    console.error('Error retrieving events:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE: Remove event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let events = await fs.readJson(EVENTS_FILE);
    events = events.filter(e => String(e.id) !== String(id));
    await fs.writeJson(EVENTS_FILE, events, { spaces: 2 });
    io.emit('events_updated', events);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST: Add new event with image
app.post('/api/events', upload.single('image'), async (req, res) => {
  try {
    console.log('Received event upload request:', req.body);
    if (req.file) {
      console.log('File received:', req.file.filename);
    } else {
      console.log('No file received in request');
    }

    const { title, title_ta, tag, tag_ta, description, description_ta } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and Description are required' });
    }

    const newEvent = {
      id: Date.now(),
      title,
      title_ta,
      tag,
      tag_ta,
      description,
      description_ta,
      image: req.file ? req.file.path : ''
    };
    
    const events = await fs.readJson(EVENTS_FILE);
    events.push(newEvent);
    await fs.writeJson(EVENTS_FILE, events, { spaces: 2 });

    // Emit real-time update
    io.emit('events_updated', events);
    console.log('Event added successfully and emitted update');

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('CRITICAL Error adding event:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// WELFARE ENDPOINTS

// GET: All welfare members
app.get('/api/welfare', async (req, res) => {
  try {
    const welfare = await fs.readJson(WELFARE_FILE);
    res.json(welfare);
  } catch (error) {
    console.error('Error fetching welfare data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST: Add new member
app.post('/api/welfare', upload.single('image'), async (req, res) => {
  try {
    const { name, name_ta, phone, designation, designation_ta, group } = req.body;
    const newMember = {
      id: Date.now(),
      name, name_ta, phone,
      designation: designation || '',
      designation_ta: designation_ta || '',
      group: group || 'general',
      image: req.file ? req.file.path : ''
    };
    
    const members = await fs.readJson(WELFARE_FILE);
    members.push(newMember);
    await fs.writeJson(WELFARE_FILE, members, { spaces: 2 });
    io.emit('welfare_updated', members);
    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error adding welfare member:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT: Update member
app.put('/api/welfare/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.path;
    }

    const members = await fs.readJson(WELFARE_FILE);
    const index = members.findIndex(m => String(m.id) === String(id));
    if (index === -1) return res.status(404).json({ message: 'Member not found' });

    members[index] = { ...members[index], ...updateData };
    await fs.writeJson(WELFARE_FILE, members, { spaces: 2 });
    io.emit('welfare_updated', members);
    res.json(members[index]);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE: Remove member
app.delete('/api/welfare/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let members = await fs.readJson(WELFARE_FILE);
    members = members.filter(m => String(m.id) !== String(id));
    await fs.writeJson(WELFARE_FILE, members, { spaces: 2 });
    io.emit('welfare_updated', members);
    res.json({ message: 'Member deleted' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// VILLAGE LEADERS ENDPOINTS

// GET: All village leaders
app.get('/api/leaders', async (req, res) => {
  try {
    const leaders = await fs.readJson(LEADERS_FILE);
    res.json(leaders);
  } catch (error) {
    console.error('Error fetching leaders data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT: Update village leader
app.put('/api/leaders/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.path;
    }

    const leaders = await fs.readJson(LEADERS_FILE);
    const index = leaders.findIndex(l => String(l.id) === String(id));
    if (index === -1) return res.status(404).json({ message: 'Leader not found' });

    leaders[index] = { ...leaders[index], ...updateData };
    await fs.writeJson(LEADERS_FILE, leaders, { spaces: 2 });
    io.emit('leaders_updated', leaders);
    res.json(leaders[index]);
  } catch (error) {
    console.error('Error updating village leader:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// SHARING / TESTIMONIALS ENDPOINTS

// GET: All sharing entries
app.get('/api/sharing', async (req, res) => {
  try {
    const sharing = await fs.readJson(SHARING_FILE);
    // Return in reverse chronological order
    res.json(sharing.reverse());
  } catch (error) {
    console.error('Error fetching sharing data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST: Add new sharing entry
app.post('/api/sharing', upload.single('image'), async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ message: 'Name and message are required' });
    }

    const newEntry = {
      id: Date.now(),
      name,
      email: email || '',
      message,
      photo: req.file ? req.file.path : '',
      date: new Date().toLocaleDateString()
    };
    
    const sharing = await fs.readJson(SHARING_FILE);
    sharing.push(newEntry);
    await fs.writeJson(SHARING_FILE, sharing, { spaces: 2 });
    
    // Emit real-time update
    io.emit('sharing_updated', sharing.slice().reverse());
    
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error in POST /api/sharing:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE: Remove sharing entry
app.delete('/api/sharing/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let sharing = await fs.readJson(SHARING_FILE);
    sharing = sharing.filter(s => String(s.id) !== String(id));
    await fs.writeJson(SHARING_FILE, sharing, { spaces: 2 });
    io.emit('sharing_deleted', id);
    res.json({ message: 'Sharing entry deleted' });
  } catch (error) {
    console.error('Error deleting sharing entry:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PHOTO GALLERY ENDPOINTS

// GET: All gallery items for a category
app.get('/api/gallery/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const file = category === 'michael' ? MICHAEL_GALLERY_FILE : RAPHAEL_GALLERY_FILE;
    if (!await fs.pathExists(file)) return res.json([]);
    const photos = await fs.readJson(file);
    res.json(photos.reverse()); // Latest first
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST: Add new gallery photo
app.post('/api/gallery/:category', upload.single('image'), async (req, res) => {
  try {
    const { category } = req.params;
    const { caption } = req.body;
    const targetFile = category === 'michael' ? MICHAEL_GALLERY_FILE : RAPHAEL_GALLERY_FILE;

    const newPhoto = {
      id: Date.now(),
      caption: caption || '',
      src: req.file ? req.file.path : '',
      timestamp: new Date().toISOString()
    };

    const photos = await fs.readJson(targetFile);
    photos.push(newPhoto);
    await fs.writeJson(targetFile, photos, { spaces: 2 });

    io.emit('gallery_updated', { category, photos: photos.slice().reverse() });
    res.status(201).json(newPhoto);
  } catch (error) {
    console.error('Error adding gallery photo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE: Remove gallery photo
app.delete('/api/gallery/:category/:id', async (req, res) => {
  try {
    const { category, id } = req.params;
    const targetFile = category === 'michael' ? MICHAEL_GALLERY_FILE : RAPHAEL_GALLERY_FILE;
    
    let photos = await fs.readJson(targetFile);
    photos = photos.filter(p => String(p.id) !== String(id));
    await fs.writeJson(targetFile, photos, { spaces: 2 });

    io.emit('gallery_updated', { category, photos: photos.slice().reverse() });
    res.json({ message: 'Photo deleted' });
  } catch (error) {
    console.error('Error deleting gallery photo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
