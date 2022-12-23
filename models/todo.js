"use strict";
const { Model,Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }
    markAsCompleted() {
      return this.update({ completed: true });
    }
    static getTodo() {
      return this.findAll();
    }

    static overdue() {
      const s= this.findAll({
        where: {
          dueDate: { [Op.lt]: new Date().toLocaleDateString("en-CA") }
        },
      });
      return s;
    }
    static dueToday() {
      const m=this.findAll({
        where: {
          dueDate: { [Op.eq]: new Date().toLocaleDateString("en-CA") }
        },
      });
      return m;
    }
    static dueLater() {
      const d= this.findAll({
        where: {
          dueDate: { [Op.gt]: new Date().toLocaleDateString("en-CA") }
        },
      });
      return d;
    }

    static deleteTodo(id) {
      return this.destroy({
        where: { id: id },
      });
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
