import mongoose from "mongoose";
import Products from "../models/products.models.js";

//Add Product

const addProduct = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400).json({
      message: "title or description required",
    });
    return;
  }

  const product = await Products.create({
    title,
    description,
  });

  res.status(201).json({
    message: "Product added successfully",
  });
};

//Add Product

// get all products
const getAllProducts = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 3;
  
    const skip = (page - 1) * limit;
  
    const products = await Products.find({}).skip(skip).limit(limit);
    res.status(200).json({
        products,
        });
  };
  
// get all products

// get single product
const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Not valid Id" });
  }

  const product = await Products.findById(id);
  if (!product) {
    res.status(404).json({
      message: "no product found",
    });
  }
  res.status(200).json(product);
};
// get single product

// delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Not valid Id" });
  }

  const product = await Products.findOneAndDelete({ _id: id });

  res.status(200).json({
    message: "product deleted successfully",
    product,
  });
};
// delete product


// edit product

const editProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Not valid Id" });
  }

  const product = Products.findOneAndUpdate(
    {
      _id: id,
    },
    { ...req.body }
  );

  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }
  res.json(product);
};
// edit product


export { addProduct, getAllProducts, getSingleProduct, deleteProduct, editProduct };