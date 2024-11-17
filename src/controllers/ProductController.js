const ProductService = require("../services/ProductService");
const admin = require("firebase-admin");
const multer = require("multer");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
});

const bucket = admin.storage().bucket();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadProductImages = upload.fields([
  { name: "image", maxCount: 2 },
  { name: "banner", maxCount: 2 }
]);

const createProduct = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.files) {
      if (req.files["image"] && req.files["image"].length > 0) {
        const imageFile = req.files["image"][0];
        const folderName = "DACN/products";
        const imageFileName = `${folderName}/${Date.now()}-${
          imageFile.originalname
        }`;
        const fileUpload = bucket.file(imageFileName);
        const token = uuidv4();

        await fileUpload.save(imageFile.buffer, {
          contentType: imageFile.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: token
          }
        });

        data.imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
          process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
        }/o/${encodeURIComponent(imageFileName)}?alt=media&token=${token}`;
      }

      if (req.files["banner"] && req.files["banner"].length > 0) {
        const bannerFile = req.files["banner"][0];
        const folderName = "DACN/banner";
        const bannerFileName = `${folderName}/${Date.now()}-${
          bannerFile.originalname
        }`;

        const fileUpload = bucket.file(bannerFileName);
        const bannerToken = uuidv4();

        await fileUpload.save(bannerFile.buffer, {
          contentType: bannerFile.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: bannerToken
          }
        });

        data.bannerUrl = `https://firebasestorage.googleapis.com/v0/b/${
          process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
        }/o/${encodeURIComponent(
          bannerFileName
        )}?alt=media&token=${bannerToken}`;
      }
    }

    const result = await ProductService.createProduct(data);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Đã xảy ra lỗi khi thêm sản phẩm: " + error.message);
  }
};

const updateProduct = async (req, res) => {
  const dataUpdate = { ...req.body };

  if (
    Object.keys(dataUpdate).length === 0 &&
    (!req.files || Object.keys(req.files).length === 0)
  ) {
    return res.status(400).send({ message: "Không có dữ liệu" });
  }

  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "Product ID is required."
      });
    }

    if (req.files && req.files["image"] && req.files["image"].length > 0) {
      const imageFile = req.files["image"][0];
      const folderName = "DACN/products";
      const imageFileName = `${folderName}/${Date.now()}-${
        imageFile.originalname
      }`;
      const fileUpload = bucket.file(imageFileName);
      const token = uuidv4();

      await fileUpload.save(imageFile.buffer, {
        contentType: imageFile.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: token
        }
      });

      dataUpdate.imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
        process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
      }/o/${encodeURIComponent(imageFileName)}?alt=media&token=${token}`;
    }

    if (req.files && req.files["banner"] && req.files["banner"].length > 0) {
      const bannerFile = req.files["banner"][0];
      const folderName = "DACN/banner";
      const bannerFileName = `${folderName}/${Date.now()}-${
        bannerFile.originalname
      }`;
      const fileUpload = bucket.file(bannerFileName);
      const bannerToken = uuidv4();

      await fileUpload.save(bannerFile.buffer, {
        contentType: bannerFile.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: bannerToken
        }
      });

      dataUpdate.bannerUrl = `https://firebasestorage.googleapis.com/v0/b/${
        process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
      }/o/${encodeURIComponent(bannerFileName)}?alt=media&token=${bannerToken}`;
    }

    if (typeof dataUpdate.imageUrl !== "string") {
      delete dataUpdate.imageUrl;
    }
    if (typeof dataUpdate.bannerUrl !== "string") {
      delete dataUpdate.bannerUrl;
    }

    const result = await ProductService.updateProduct(productId, dataUpdate);

    if (result.status === "ERR") {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      status: "ERR",
      message: "Error updating product",
      error: error.message
    });
  }
};

const express = require("express");
const app = express();
app.put(
  "/api/product/update/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "banner", maxCount: 1 }
  ]),
  updateProduct
);

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "the userId is required "
      });
    }
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e
    });
  }
};

const deleteManyProduct = async (req, res) => {
  try {
    const ids = req.body;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "the ids is required "
      });
    }
    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const response = await ProductService.getAllProduct();
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      message: "An error occurred while fetching products.",
      error: error.message
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "the productId is required "
      });
    }
    const response = await ProductService.getDetailsProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e
    });
  }
};

const getAllType = async (req, res) => {
  try {
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e
    });
  }
};

module.exports = {
  uploadProductImages,
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  deleteManyProduct,
  getAllProduct,
  getAllType
};
