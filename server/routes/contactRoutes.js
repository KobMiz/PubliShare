const express = require("express");
const router = express.Router();
const { sendContactMessage } = require("../controllers/contactController");

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Send a contact message
 *     description: Allows a user to send a message through the contact form. The message will be processed server-side (e.g., sent via email).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               message:
 *                 type: string
 *                 example: I'd like to ask about...
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Validation error or missing fields
 *       500:
 *         description: Internal server error
 */
router.post("/", sendContactMessage);

module.exports = router;
