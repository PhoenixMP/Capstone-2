"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");
const { API_token } = require("../../config");
const { UnauthorizedError } = require("../../expressError");


/** Middleware: Check API Token.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * If not, raises Unauthorized.
 */

function checkAPIToken(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError();
    }
    const token = authHeader.replace(/^[Bb]earer /, "").trim();
    if (token !== API_token) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}


/** Middleware to use when they be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */

function ensureAdmin(req, res, next) {
  try {
    if (!res.locals.user || !res.locals.user.isAdmin) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  checkAPIToken,
  ensureAdmin
};

