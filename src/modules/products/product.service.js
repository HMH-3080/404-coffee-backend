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
// Get product by barcode (POS scan)
// ============================================================

const getProductByBarcode = async (barcode) => {
  if (!barcode) {
    const error = new Error("Barcode is required");
    error.statusCode = 400;
    throw error;
  }

  const product = await prisma.product.findUnique({
    where: {
      barcode: String(barcode),
    },

    include: {
      types: true,

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
    const error = new Error("Product not found for this barcode");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

// ============================================================
// Create product
// ============================================================

const createProduct = async ({ name, description, image, barcode }) => {
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

  if (barcode !== undefined && barcode !== "") {
    const existingBarcode = await prisma.product.findUnique({
      where: {
        barcode: String(barcode),
      },
    });

    if (existingBarcode) {
      const error = new Error("Barcode already used by another product");
      error.statusCode = 409;
      throw error;
    }
  }

  return prisma.product.create({
    data: {
      name,
      description: description || null,
      image: image || null,
      barcode: barcode || null,
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

  const { name, description, image, barcode } = data;

  if (barcode !== undefined && barcode !== "") {
    const existingBarcode = await prisma.product.findUnique({
      where: {
        barcode: String(barcode),
      },
    });

    if (existingBarcode && existingBarcode.id !== productId) {
      const error = new Error("Barcode already used by another product");
      error.statusCode = 409;
      throw error;
    }
  }

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
      ...(barcode !== undefined && {
        barcode: barcode || null,
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
// ============================================================
// Product types
// ============================================================

const getProductTypes = async (productId) => {
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

  return prisma.productType.findMany({
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

const createProductType = async ({ productId, name }) => {
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

  if (!name) {
    const error = new Error("Type name is required");
    error.statusCode = 400;
    throw error;
  }

  const existingType = await prisma.productType.findUnique({
    where: {
      productId_name: {
        productId: Number(productId),
        name,
      },
    },
  });

  if (existingType) {
    const error = new Error("Product type already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.productType.create({
    data: {
      productId: Number(productId),
      name,
    },
    include: {
      ingredients: true,
    },
  });
};

const updateProductType = async (typeId, data) => {
  const productType = await prisma.productType.findUnique({
    where: {
      id: Number(typeId),
    },
  });

  if (!productType) {
    const error = new Error("Product type not found");
    error.statusCode = 404;
    throw error;
  }

  const { name } = data;

  if (name !== undefined) {
    const existingType = await prisma.productType.findFirst({
      where: {
        productId: productType.productId,
        name,
        id: { not: productType.id },
      },
    });

    if (existingType) {
      const error = new Error("Product type already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  return prisma.productType.update({
    where: {
      id: productType.id,
    },
    data: {
      ...(name !== undefined && { name }),
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

const deleteProductType = async (typeId) => {
  const productType = await prisma.productType.findUnique({
    where: {
      id: Number(typeId),
    },
  });

  if (!productType) {
    const error = new Error("Product type not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.productType.delete({
    where: {
      id: productType.id,
    },
  });

  return productType;
};

const addProductTypeIngredient = async ({ productTypeId, rawMaterialId }) => {
  const productType = await prisma.productType.findUnique({
    where: {
      id: Number(productTypeId),
    },
  });

  if (!productType) {
    const error = new Error("Product type not found");
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

  const existingIngredient = await prisma.productTypeIngredient.findUnique({
    where: {
      productTypeId_rawMaterialId: {
        productTypeId: productType.id,
        rawMaterialId: Number(rawMaterialId),
      },
    },
  });

  if (existingIngredient) {
    const error = new Error(
      "This raw material is already added to this product type",
    );
    error.statusCode = 409;
    throw error;
  }

  return prisma.productTypeIngredient.create({
    data: {
      productTypeId: productType.id,
      rawMaterialId: Number(rawMaterialId),
    },
    include: {
      rawMaterial: true,
      productType: true,
    },
  });
};

const removeProductTypeIngredient = async ({ productTypeId, rawMaterialId }) => {
  const ingredient = await prisma.productTypeIngredient.findUnique({
    where: {
      productTypeId_rawMaterialId: {
        productTypeId: Number(productTypeId),
        rawMaterialId: Number(rawMaterialId),
      },
    },
  });

  if (!ingredient) {
    const error = new Error("Ingredient not found in this product type");
    error.statusCode = 404;
    throw error;
  }

  await prisma.productTypeIngredient.delete({
    where: {
      id: ingredient.id,
    },
  });

  return ingredient;
};

// ============================================================
// Product addons
// ============================================================

const getAddons = async (productId) => {
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

  return prisma.productAddon.findMany({
    where: {
      productId: Number(productId),
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

const createAddon = async ({ productId, name, price, notes }) => {
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

  if (!name || price === undefined || price < 0) {
    const error = new Error("name and a non-negative price are required");
    error.statusCode = 400;
    throw error;
  }

  const existingAddon = await prisma.productAddon.findUnique({
    where: {
      productId_name: {
        productId: Number(productId),
        name,
      },
    },
  });

  if (existingAddon) {
    const error = new Error("Addon already exists for this product");
    error.statusCode = 409;
    throw error;
  }

  return prisma.productAddon.create({
    data: {
      productId: Number(productId),
      name,
      price,
      notes: notes || null,
    },
  });
};

const updateAddon = async (addonId, data) => {
  const addon = await prisma.productAddon.findUnique({
    where: {
      id: Number(addonId),
    },
  });

  if (!addon) {
    const error = new Error("Addon not found");
    error.statusCode = 404;
    throw error;
  }

  const { name, price, notes } = data;

  if (name !== undefined) {
    const existingAddon = await prisma.productAddon.findFirst({
      where: {
        productId: addon.productId,
        name,
        id: { not: addon.id },
      },
    });

    if (existingAddon) {
      const error = new Error("Addon already exists for this product");
      error.statusCode = 409;
      throw error;
    }
  }

  if (price !== undefined && price < 0) {
    const error = new Error("price must be non-negative");
    error.statusCode = 400;
    throw error;
  }

  return prisma.productAddon.update({
    where: {
      id: addon.id,
    },
    data: {
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price }),
      ...(notes !== undefined && { notes: notes || null }),
    },
  });
};

const deleteAddon = async (addonId) => {
  const addon = await prisma.productAddon.findUnique({
    where: {
      id: Number(addonId),
    },
  });

  if (!addon) {
    const error = new Error("Addon not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.productAddon.delete({
    where: {
      id: addon.id,
    },
  });

  return addon;
};

module.exports = {
    getProducts,
    getProductById,
    getProductByBarcode,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductSize,
    getProductSizes,
    createProductSizeIngredient,
    getProductTypes,
    createProductType,
    updateProductType,
    deleteProductType,
    addProductTypeIngredient,
    removeProductTypeIngredient,
    getAddons,
    createAddon,
    updateAddon,
    deleteAddon,
};