/**
 * Data store. Two interchangeable back-ends with the same async API:
 *   - FileStore  : server/data/db.json   (default, no setup)
 *   - MongoStore : MongoDB via mongoose  (when MONGODB_URI is set)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ------------------------------------------------------------------ FileStore
class FileStore {
  constructor(file = path.join(__dirname, '..', 'data', 'db.json')) {
    this.file = file;
    this.kind = 'file';
    this.db = { users: [], roster: [] };
    this.queue = Promise.resolve();
  }

  async init() {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    if (fs.existsSync(this.file)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(this.file, 'utf8'));
        this.db = { users: parsed.users || [], roster: parsed.roster || [] };
      } catch (err) {
        throw new Error(`Cannot read ${this.file}: ${err.message}`);
      }
    } else {
      this._flushSync();
    }
  }

  _flushSync() {
    const tmp = `${this.file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(this.db, null, 2));
    fs.renameSync(tmp, this.file);
  }

  _save() {
    // serialise writes so concurrent requests can never corrupt the file
    this.queue = this.queue.then(() => this._flushSync());
    return this.queue;
  }

  async findById(id) {
    return this.db.users.find((u) => u.id === id) || null;
  }
  async findByIdentifier(identifier) {
    const key = String(identifier).trim().toLowerCase();
    return this.db.users.find((u) => u.userId === key || u.email === key) || null;
  }
  async findByUserId(userId) {
    return this.db.users.find((u) => u.userId === userId.toLowerCase()) || null;
  }
  async findByEmail(email) {
    return this.db.users.find((u) => u.email === email.toLowerCase()) || null;
  }
  async createUser(user) {
    this.db.users.push(user);
    await this._save();
    return user;
  }
  async updateUser(id, updates) {
    const user = this.db.users.find((u) => u.id === id);
    if (!user) return null;
    Object.assign(user, updates);
    await this._save();
    return user;
  }
  async deleteUser(id) {
    const before = this.db.users.length;
    this.db.users = this.db.users.filter((u) => u.id !== id);
    await this._save();
    return this.db.users.length < before;
  }
  async listUsers() {
    return [...this.db.users];
  }

  async listRoster() {
    return [...this.db.roster];
  }
  async addRoster(entry) {
    this.db.roster.push(entry);
    await this._save();
    return entry;
  }
  async updateRoster(id, updates) {
    const entry = this.db.roster.find((e) => e.id === id);
    if (!entry) return null;
    Object.assign(entry, updates);
    await this._save();
    return entry;
  }
  async deleteRoster(id) {
    const before = this.db.roster.length;
    this.db.roster = this.db.roster.filter((e) => e.id !== id);
    await this._save();
    return this.db.roster.length < before;
  }
}

// ----------------------------------------------------------------- MongoStore
class MongoStore {
  constructor(uri) {
    this.uri = uri;
    this.kind = 'mongodb';
  }

  async init() {
    let mongoose;
    try {
      ({ default: mongoose } = await import('mongoose'));
    } catch {
      throw new Error('MONGODB_URI is set but "mongoose" is not installed. Run: npm install mongoose');
    }
    await mongoose.connect(this.uri);
    const userSchema = new mongoose.Schema(
      {
        id: { type: String, unique: true, index: true },
        userId: { type: String, unique: true, index: true },
        email: { type: String, unique: true, index: true },
        passwordHash: String,
        name: String,
        role: String,
        department: String,
        jobTitle: String,
        avatarId: String,
        availability: String,
        assignedOffice: String,
        dateJoined: String,
      },
      { versionKey: false }
    );
    const rosterSchema = new mongoose.Schema(
      {
        id: { type: String, unique: true, index: true },
        name: String,
        email: String,
        department: String,
        jobTitle: String,
        role: String,
        avatarId: String,
        availability: String,
        assignedOffice: String,
        dateJoined: String,
        x: Number,
        y: Number,
      },
      { versionKey: false }
    );
    this.User = mongoose.models.PSUser || mongoose.model('PSUser', userSchema);
    this.Roster = mongoose.models.PSRoster || mongoose.model('PSRoster', rosterSchema);
  }

  _lean(doc) {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return rest;
  }
  async findById(id) {
    return this._lean(await this.User.findOne({ id }).lean());
  }
  async findByIdentifier(identifier) {
    const key = String(identifier).trim().toLowerCase();
    return this._lean(await this.User.findOne({ $or: [{ userId: key }, { email: key }] }).lean());
  }
  async findByUserId(userId) {
    return this._lean(await this.User.findOne({ userId: userId.toLowerCase() }).lean());
  }
  async findByEmail(email) {
    return this._lean(await this.User.findOne({ email: email.toLowerCase() }).lean());
  }
  async createUser(user) {
    await this.User.create(user);
    return user;
  }
  async updateUser(id, updates) {
    return this._lean(await this.User.findOneAndUpdate({ id }, updates, { new: true }).lean());
  }
  async deleteUser(id) {
    return (await this.User.deleteOne({ id })).deletedCount > 0;
  }
  async listUsers() {
    return (await this.User.find().lean()).map((d) => this._lean(d));
  }
  async listRoster() {
    return (await this.Roster.find().lean()).map((d) => this._lean(d));
  }
  async addRoster(entry) {
    await this.Roster.create(entry);
    return entry;
  }
  async updateRoster(id, updates) {
    return this._lean(await this.Roster.findOneAndUpdate({ id }, updates, { new: true }).lean());
  }
  async deleteRoster(id) {
    return (await this.Roster.deleteOne({ id })).deletedCount > 0;
  }
}

export const createStore = () => (config.mongoUri ? new MongoStore(config.mongoUri) : new FileStore());
export { FileStore };
