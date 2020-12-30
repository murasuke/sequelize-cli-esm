 export default {
  async up(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Await any promises to handle asynchronicity.

      Example:
      return await queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const now = new Date();
    return await queryInterface.bulkInsert("Users",[
      { name: "name1", username: "username1", email: "email1", password: "password1", createdAt: now, updatedAt: now},
      { name: "name2", username: "username2", email: "email2", password: "password2", createdAt: now, updatedAt: now},
      { name: "name3", username: "username3", email: "email3", password: "password3", createdAt: now, updatedAt: now},
      { name: "name4", username: "username4", email: "email4", password: "password4", createdAt: now, updatedAt: now},
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Await any promises to handle asynchronicity.

      Example:
      return await queryInterface.bulkDelete('Person', null, {});
    */
   return await queryInterface.bulkDelete("Users", null, {} );
  }
};
