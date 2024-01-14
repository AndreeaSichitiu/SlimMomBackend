 
const moongose = require("mongoose");
const Schema = moongose.Schema;

 
const summarySchema = new Schema({
  date: String,
  kcalLeft: Number,
  kcalConsumed: Number,
  percentsOfDailyRate: Number,
  dailyRate: Number,
  userId: Schema.Types.ObjectId,
});
 
 
const Summary = moongose.model("summary", summarySchema);

module.exports = Summary;