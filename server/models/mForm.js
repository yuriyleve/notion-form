const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const formSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    notionDBID: {
      type: Object,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  {
    collection: "form",
  }
);
// add pagination library
formSchema.plugin(mongoosePaginate);

const form = mongoose.model("form", formSchema);

module.exports = form;
