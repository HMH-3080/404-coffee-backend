const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const prisma = require("../../lib/prisma");

const { jwtSecret, jwtExpiresIn } = require("../../config/env");

const loginUser = async ({ name, password }) => {
  // Check if required data exists
  if (!name || !password) {

    const error = new Error("Name and password are required");

    error.statusCode = 400;
    throw error;
  }

  // Find user by name

  const user = await prisma.user.findFirst({
    where: {
        name,
    },
  });

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  if (user.status !== "ACTIVE") {
    const error = new Error("User account is Suspended");
    error.statusCode = 403;
    throw error;
  }

  // Compare password

  const passwordMatch = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if(!passwordMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign({
    userId: user.id,
  },
  jwtSecret,
  {
    expiresIn: jwtExpiresIn,
  }
);
return {
    user: {
        id: user.id,
        name: user.name,
        position: user.position,
        status: user.status,
    },
    token,
};
};

module.exports = {
    loginUser,
}

// login user
/**
 * الفكرة:
 * 
 * POST /api/auth/login
        ↓
نجيب الموظف
        ↓
نتأكد إن الحساب ACTIVE
        ↓
bcrypt يقارن الباسورد
        ↓
JWT يطلع Token
        ↓
Frontend يستخدم الـToken
 */
