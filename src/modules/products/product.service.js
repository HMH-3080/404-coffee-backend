const prisma = require("../../lib/prisma");

// ============================================================
// Get all products
// ============================================================

const getProducts = async () => {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      types: {
        include: {
          ingredients: {
            include: {
              rawMaterial: true,
            },
          },
        },
      },

      sizes: {
        include: {
          ingredients: {
            include: {
              rawMaterial: true,
            },
          },
        },
      },

      addons: true,
    },
  });
};

// ============================================================
// Get product by ID
// ============================================================

const getProductById = async (id) => {
  const productId = Number(id);

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },

    include: {
      types: {
        include: {
          ingredients: {
            include: {
              rawMaterial: true,
            },
          },
        },
      },

      sizes: {
        include: {
          ingredients: {
            include: {
              rawMaterial: true,
            },
          },
        },
      },

      addons: true,
    },
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

// ============================================================
// Create product
// ============================================================

const createProduct = async ({ name, description, image }) => {
  if (!name) {
    const error = new Error("Product name is required");
    error.statusCode = 400;
    throw error;
  }

  const existingProduct = await prisma.product.findUnique({
    where: {
      name,
    },
  });

  if (existingProduct) {
    const error = new Error("Product already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.product.create({
    data: {
      name,
      description: description || null,
      image: image || null,
    },

    include: {
      types: true,
      sizes: true,
      addons: true,
    },
  });
};

// ============================================================
// Update product
// ============================================================

const updateProduct = async (id, data) => {
  const productId = Number(id);

  const existingProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!existingProduct) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const { name, description, image } = data;

  return prisma.product.update({
    where: {
      id: productId,
    },

    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && {
        description: description || null,
      }),
      ...(image !== undefined && {
        image: image || null,
      }),
    },

    include: {
      types: true,
      sizes: true,
      addons: true,
    },
  });
};

// ============================================================
// Delete product
// ============================================================

const deleteProduct = async (id) => {
  const productId = Number(id);

  const existingProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!existingProduct) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  return existingProduct;
};

// ============================================================
// Add product size
// ============================================================

const createProductSize = async ({
  productId,
  typeName,
  name,
  basePrice,
  finalPrice,
}) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    !typeName ||
    !name ||
    basePrice === undefined ||
    finalPrice === undefined
  ) {
    const error = new Error(
      "typeName, name, basePrice and finalPrice are required",
    );
    error.statusCode = 400;
    throw error;
  }

  const existingSize = await prisma.productSize.findFirst({
    where: {
      productId: Number(productId),
      typeName,
      name,
    },
  });

  if (existingSize) {
    const error = new Error("Product size already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.productSize.create({
    data: {
      productId: Number(productId),
      typeName,
      name,
      basePrice,
      finalPrice,
    },
    include: {
      ingredients: {
        include: {
          rawMaterial: true,
        },
      },
    },
  });
};

// ============================================================
// Get product sizes
// ============================================================

const getProductSizes = async (productId) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(productId),
    },
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.productSize.findMany({
    where: {
      productId: Number(productId),
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      ingredients: {
        include: {
          rawMaterial: true,
        },
      },
    },
  });
};

// Add ingredient to product size
const createProductSizeIngredient = async ({
  productSizeId,
  rawMaterialId,
  quantity,
  unit,
}) => {
  const productSize = await prisma.productSize.findUnique({
    where: {
      id: Number(productSizeId),
    },
  });

  if (!productSize) {
    const error = new Error("Product size not found");
    error.statusCode = 404;
    throw error;
  }

  const rawMaterial = await prisma.rawMaterial.findUnique({
    where: {
      id: Number(rawMaterialId),
    },
  });

  if (!rawMaterial) {
    const error = new Error("Raw material not found");
    error.statusCode = 404;
    throw error;
  }

  if (quantity === undefined || quantity <= 0 || !unit) {
    const error = new Error(
      "quantity and unit are required and quantity must be greater than 0",
    );
    error.statusCode = 400;
    throw error;
  }

  const existingIngredient = await prisma.productSizeIngredient.findUnique({
    where: {
      productSizeId_rawMaterialId: {
        productSizeId: Number(productSizeId),
        rawMaterialId: Number(rawMaterialId),
      },
    },
  });

  if (existingIngredient) {
    const error = new Error(
      "This raw material is already added to this product size",
    );
    error.statusCode = 409;
    throw error;
  }

  return prisma.productSizeIngredient.create({
    data: {
      productSizeId: Number(productSizeId),
      rawMaterialId: Number(rawMaterialId),
      quantity,
      unit,
    },
    include: {
      rawMaterial: true,
      productSize: true,
    },
  });
};
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductSize,
    getProductSizes,
    createProductSizeIngredient,
};