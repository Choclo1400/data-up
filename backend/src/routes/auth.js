import express from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { auditLog } from '../middleware/audit.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  validateRequest,
  auditLog('login', 'user'),
], async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    if (user.isLocked()) {
      return res.status(423).json({ message: 'Cuenta bloqueada temporalmente' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Resetear intentos de login
    if (user.loginAttempts > 0) {
      await user.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 }
      });
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      },
      requiresTwoFactor: user.twoFactorEnabled,
    });
  } catch (error) {
    logger.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/auth/verify-2fa:
 *   post:
 *     summary: Verificar código 2FA
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verificación exitosa
 */
router.post('/verify-2fa', [
  authenticate,
  body('token').isLength({ min: 6, max: 6 }),
  validateRequest,
  auditLog('verify_2fa', 'user'),
], async (req, res) => {
  try {
    const { token } = req.body;
    const user = req.user;

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA no está habilitado' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!verified) {
      return res.status(401).json({ message: 'Código 2FA inválido' });
    }

    // Marcar como verificado en la sesión
    const newToken = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        twoFactorVerified: true 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Verificación 2FA exitosa',
      token: newToken,
    });
  } catch (error) {
    logger.error('Error en verificación 2FA:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/auth/setup-2fa:
 *   post:
 *     summary: Configurar 2FA
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.post('/setup-2fa', [
  authenticate,
  auditLog('setup_2fa', 'user'),
], async (req, res) => {
  try {
    const user = req.user;

    const secret = speakeasy.generateSecret({
      name: `Gestión Servicios (${user.email})`,
      issuer: 'Gestión Servicios Técnicos',
    });

    // Generar QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Guardar secret temporalmente (se confirmará con verify-2fa-setup)
    user.twoFactorSecret = secret.base32;
    await user.save();

    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
    });
  } catch (error) {
    logger.error('Error configurando 2FA:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener información del usuario actual
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      profile: req.user.profile,
      twoFactorEnabled: req.user.twoFactorEnabled,
      lastLogin: req.user.lastLogin,
    },
  });
});

export default router;