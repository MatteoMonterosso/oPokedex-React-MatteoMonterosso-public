import { DataTypes, Model } from "sequelize";
import { sequelize } from "./dbClientSequelize.js";

export class Type extends Model {}

Type.init({
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  color: {
    type: DataTypes.STRING(7), // VARCHAR(7)
    defaultValue: "#ffffff"
  }
}, {
  sequelize,
  tableName: "type"
});
