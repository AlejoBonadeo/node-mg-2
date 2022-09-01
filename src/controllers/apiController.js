const db = require("../database/models");

const controller = {
  getProducts: async (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    if (offset < 0 || limit < 0 || isNaN(limit) || isNaN(offset)) {
      return res.status(400).json({
        ok: false,
        msg: "Limit and offset must be positive numbers",
      });
    }
    const products = await db.Product.findAll({ limit, offset });

    const count = await db.Product.count();

    const countByCategory = {};

    for (const product of products) {
      const category = await db.Category.findOne({
        where: { id: product.category_id },
      });

      countByCategory[category.name] =
        (countByCategory[category.name] || 0) + 1;
    }

    const next =
      products.length < limit
        ? undefined
        : `http://localhost:3000/api/products?limit=${limit}&offset=${
            offset + limit
          }`;

    const previous =
      offset === 0
        ? undefined
        : `http://localhost:3000/api/products?limit=${Math.min(
            limit,
            offset
          )}&offset=${Math.max(offset - limit, 0)}`;

    res.json({
      ok: true,
      count,
      countByCategory,
      products,
      next,
      previous,
    });
  },
  getProduct: async (req, res) => {
    const { id } = req.params;

    const product = await db.Product.findOne({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({
        ok: false,
        msg: "Product not found",
      });
    }
    res.json({ ok: true, product });
  },
  getUsers: async (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    if (offset < 0 || limit < 0 || isNaN(limit) || isNaN(offset)) {
      return res.status(400).json({
        ok: false,
        msg: "Limit and offset must be positive numbers",
      });
    }
    const users = await db.User.findAll({
      limit,
      offset,
      attributes: { exclude: ["password"] },
    });

    const count = await db.User.count();

    const next =
      users.length < limit
        ? undefined
        : `http://localhost:3000/api/users?limit=${limit}&offset=${
            offset + limit
          }`;

    const previous =
      offset === 0
        ? undefined
        : `http://localhost:3000/api/users?limit=${Math.min(
            limit,
            offset
          )}&offset=${Math.max(offset - limit, 0)}`;

    
    res.json({
      ok: true,
      count,
      users,
      next,
      previous,
    });
  },
  getUser: async (req, res) => {
    const { id } = req.params;

    const user = await db.User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    delete user.password;

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      });
    }
    res.json({
      ok: true,
      user,
    });
  },
};

module.exports = controller;
