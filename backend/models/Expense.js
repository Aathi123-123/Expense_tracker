const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      default: 'Misc',
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    notes: {
      type: String,
      default: '',
    },
    receipt: {
      type: String, // Storing base64 string
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
