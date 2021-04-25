import mongoose from "mongoose";

function startAll() {
  String.prototype.toObjectId = function() {
    var ObjectId = mongoose.Types.ObjectId;
    return new ObjectId(this.toString());
  };
}

export default {
  startAll,
};
