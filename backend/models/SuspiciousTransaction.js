const mongoose = require("mongoose");

const suspiciousTransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    ruleTriggered: {
      type: String,
      enum: [
        "large_transfer",
        "rapid_transfers",
        "multiple_failed_attempts",
        "round_number_pattern",
        "unusual_hour",
        "high_frequency_withdrawals",
        "new_account_large_transfer",
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    reviewed: {
      type: Boolean,
      default: false,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SuspiciousTransaction",
  suspiciousTransactionSchema
);