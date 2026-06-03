const BASE = 'http://localhost:8080/api';

export const api = {
  // POST /api/auth/register → { id, name, email }
  register: async (name, email) => {
    const res = await fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // GET /api/user?email=x → { id, name, email }
  // NEW endpoint — fetches user info by email without re-registering
  getUserByEmail: async (email) => {
    const res = await fetch(`${BASE}/user?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error('User not found');
    return res.json(); // { id, name, email }
  },

  // GET /api/questions
  getQuestions: async () => {
    const res = await fetch(`${BASE}/questions`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // POST /api/assessment/submit?userId=1
  submitAssessment: async (userId, answers) => {
    const res = await fetch(`${BASE}/assessment/submit?userId=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    });
    if (!res.ok) throw new Error(await res.text() || 'Submission failed');
    return res.json();
  },

  // POST /api/user/energy  { email } → { coolBlue, earthGreen, sunshineYellow, fieryRed, dominantEnergy, name? }
  getUserEnergy: async (email) => {
    const res = await fetch(`${BASE}/user/energy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    if (!data || !data.dominantEnergy) throw new Error('No profile');
    return data;
  },

  // POST /api/email/analyze → plain rewritten string
  // recipientEmail is used to look up recipient's energy profile for rewriting
  analyzeEmail: async (userId, recipientName, recipientEmail, emailContent) => {
    const res = await fetch(`${BASE}/email/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, recipientName, recipientEmail, emailContent }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.text();
  },

  // POST /api/email/send → { rewrittenEmail, sent, message }
  // senderName + senderEmail are used for From display name and Reply-To header
  analyzeAndSend: async (userId, recipientName, recipientEmail, emailContent, senderName, senderEmail) => {
    const res = await fetch(`${BASE}/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        recipientName,
        recipientEmail,
        emailContent,
        senderName,    // e.g. "Ayush"          → shown as "Ayush via Insights"
        senderEmail,   // e.g. "236320015@gkv.ac.in" → set as Reply-To
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

export const mapEnergyType = (type) => ({
  COOL_BLUE: 'blue', EARTH_GREEN: 'green',
  SUNSHINE_YELLOW: 'yellow', FIERY_RED: 'red',
})[type] ?? type?.toLowerCase();

export const mapScores = (data) => ({
  blue:   Math.round(data.coolBlue      ?? 0),
  green:  Math.round(data.earthGreen    ?? 0),
  yellow: Math.round(data.sunshineYellow?? 0),
  red:    Math.round(data.fieryRed      ?? 0),
  dominantEnergy: mapEnergyType(data.dominantEnergy),
});
