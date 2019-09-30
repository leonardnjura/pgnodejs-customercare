const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('x-auth-token');

  // check for token
  // ensure to return from function to avoid resending headers
  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    // verify token
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));

    // add personnel from payload
    req.personnel = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Invalid token' });
  }
}

function generateToken(personnel) {
  return jwt.sign(
    {
      personnel_id: personnel.personnel_id,
      personnel_onames: personnel.personnel_onames,
      personnel_fname: personnel.personnel_fname,
      personnel_phone: personnel.personnel_phone,
      personnel_status: personnel.personnel_status,
      personnel_type_id: personnel.personnel_type_id
    },
    config.get('JWT_SECRET'),
    { expiresIn: 3600 * 24 }
  );
}

function adminOnly(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token provided' });
  try {
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));
    req.personnel = decoded;
    if (req.personnel.personnel_type_id != 3)
      return res.status(401).json({ msg: 'Admin only' });
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Invalid token' });
  }
}

module.exports = { auth, adminOnly, generateToken };
