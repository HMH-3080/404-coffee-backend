const bcrypt = require("bcryptjs");

const prisma = require("../lib/prisma");


const createUser = async ({ name, password, position }) => {
  // Check if required data exists
  if (!name || !password || !position) {
    const error = new Error("Name, password and position are required");
    error.statusCode = 400;
    throw error;
  }

  // Hash password before saving it
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      passwordHash,
      position,
    },
    select: {
      id: true,
      name: true,
      position: true,
      status: true,
      createdAt: true,
    },
  });

  return user;
};

module.exports = {
  createUser,
};