/**
 * CampusCare Enterprise v2.0 — JWT Authentication & Role-Based Access Control (RBAC)
 * Eliminates the insecure hardcoded client-side PIN ('2468') vulnerability.
 */
const jwt = require('jsonwebtoken');
const { db } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'campuscare_super_secret_jwt_signing_key_change_in_production_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

function signToken(user) {
  return jwt.sign(
    {
      uid: user.uid,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Missing Bearer JWT token.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated request.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      logAudit(req.user, 'UNAUTHORIZED_ACCESS_ATTEMPT', req.originalUrl, `Required role: ${allowedRoles.join(',')}`, req.ip);
      return res.status(403).json({
        error: `Access denied. Role '${req.user.role}' is not authorized for this action.`
      });
    }
    next();
  };
}

function logAudit(user, action, targetId, details, ipAddress = '127.0.0.1') {
  try {
    db.prepare(`
      INSERT INTO audit_logs (actor_uid, actor_name, actor_role, action, target_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      user?.uid || 'ANONYMOUS',
      user?.name || 'Anonymous',
      user?.role || 'guest',
      action,
      targetId || null,
      typeof details === 'string' ? details : JSON.stringify(details),
      ipAddress
    );
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
}

module.exports = {
  signToken,
  authenticateJWT,
  requireRole,
  logAudit,
  JWT_SECRET
};
