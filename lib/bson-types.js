'use babel';

import {
  Binary,
  Code,
  Map,
  DBRef,
  Double,
  Int32,
  Long,
  MinKey,
  MaxKey,
  ObjectID,
  ObjectId,
  Symbol,
  Timestamp,
  BSONRegExp,
  Decimal128,
} from 'mongodb';

class CheckBSONType {
  constructor() {
    this.types = [
      String,
      Array,
      Binary,
      Code,
      Map,
      DBRef,
      Double,
      Int32,
      Long,
      MinKey,
      MaxKey,
      ObjectID,
      ObjectId,
      Symbol,
      Timestamp,
      BSONRegExp,
      Decimal128,
      Object,
      Number,
    ];
  }

  check(value) {
    for (let i = 0; i < this.types.length; i++) {
      if (value !== null && (value).constructor === this.types[i]) {
        return this.types[i].name;
      }
    }

    return 'Unknow';
  }
}

const checkBSONType = new CheckBSONType();
export default checkBSONType;
