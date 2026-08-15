import mongoose from "mongoose";

const querySchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["CODING", "CREATIVE", "GENERAL"],
    },
    engineUsed: {
      type: String,
      required: true,
      enum: [
        "gemini-flash-latest",
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "gemma-2-9b-it",
      ],
    },
    response: {
      type: String,
      required: true,
    },
    latencyMs: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

querySchema.index({ createdAt: -1 });

const Query = mongoose.model("Query", querySchema);

export default Query;