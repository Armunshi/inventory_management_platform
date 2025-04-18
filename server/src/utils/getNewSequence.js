// utils/getNextSequence.js
import {Counter} from '../models/Counter.js'
async function getNextSequence(name) {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
}

export {getNextSequence};
