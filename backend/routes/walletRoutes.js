const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  deposit,
  withdraw,
  getSummary,
  listWallets,
  transfer,
} = require("../controllers/walletController");

router.post("/deposit", deposit);
router.post("/withdraw", withdraw);
router.post("/transfer", transfer);
router.get("/summary", getSummary);
router.get("/wallets", listWallets);

module.exports = router;