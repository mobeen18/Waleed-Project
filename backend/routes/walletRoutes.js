const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  deposit,
  withdraw,
  getSummary,
  listWallets,
  transfer,
  getTransactions,
} = require("../controllers/walletController");

router.post("/deposit", protect, deposit);
router.post("/withdraw", protect, withdraw);
router.post("/transfer", protect, transfer);
router.get("/summary", protect, getSummary);
router.get("/wallets", protect, listWallets);
router.get("/transactions", protect, getTransactions);

module.exports = router;