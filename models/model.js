const { DataTypes,Sequelize } = require('sequelize');
const sequelize = require('../util/database');


exports.getAllTables = async () => {
  try {
    // Use raw SQL query to fetch all table names in the 'expenses' schema
    const result = await sequelize.query(
      'SHOW TABLES',
      { type: sequelize.QueryTypes.SHOWTABLES }
    );


    return result;
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error fetching tables' };
  }
};
// Function to create a table dynamically
exports.createTable = async (tableName, fields) => {
  try {
    const modelFields = {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
    };
    fields = Object.entries(fields);
    fields.forEach(([fieldName, fieldType]) => {
      modelFields[fieldName] = {
        type: fieldType === 'string' ? DataTypes.STRING : DataTypes.INTEGER,
        allowNull: true, // Modify as needed
      };
    });
    modelFields.id = {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull:false,
      primaryKey: true,
    };

    // Create the dynamic model for the new table
    const DynamicModel = sequelize.define(tableName, modelFields);

    // Synchronize the model with the database (creates the table)
    await DynamicModel.sync({ force: true }); // Using force true to recreate the table if it exists
    console.log("this is the table created",await DynamicModel.describe())
    return await DynamicModel.describe();;
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error creating table' };
  }
};
exports.getTable = async (tableName) => {
   //tableName=tableName.slice(0,-1)
  
  try {
    // Use raw SQL query to fetch the specified table name in the 'expenses' schema
    const result = await sequelize.query(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = :schema AND table_name = :tableName',
      {
        replacements: { schema: 'expenses', tableName },
        type: sequelize.QueryTypes.SELECT,
      }
    );
  

    if (result.length === 0) {
      throw new Error(`Table '${tableName}' not found`);
    }

    // Fetch the columns (table structure) using Sequelize's describe method
    const columns = await sequelize.define(result[0].TABLE_NAME, {}).describe();

    // Fetch the data from the specified table
    const dataQuery = `SELECT * FROM ${result[0].TABLE_NAME}`;
    const data = await sequelize.query(dataQuery, {
      type: sequelize.QueryTypes.SELECT,
    });

    const cols=Object.keys(columns)
    // console.log("Columns:", Object.keys(columns));
    // console.log("Data:", data);

    return { cols, data };
  } catch (error) {
    console.error(error);
    return { error: `Error fetching table structure and data for table '${tableName}'` };
  }
};


exports.deleteData=async(table,id)=>{
  try{
    const tb=sequelize.models[table];
    if(!tb){
      console.log("table does not exist...");
    }
   await tb.destroy({
    where:{id:id,
    },
   })
   return { success: true };
  }
  catch(error){
    console.log(error)
  }
}


/// Function to insert data into a dynamically created table using raw SQL query
exports.insertData = async (tableName,vals) => {
  console.log("table to insert data", tableName);
  console.log("the tables present are", sequelize.models);
  console.log("data to be stored=", vals);
  

  try {
    // Find the dynamic model based on the table name
    const DynamicModel = await sequelize.models[tableName];
    console.log(DynamicModel)

    if (!DynamicModel) {
      throw new Error('Table does not exist');
    }
    console.log("description ",await DynamicModel.describe())
    const createdAt= new Date();
    const updatedAt = createdAt;
    const modifiedVals = {
      ...vals,
      createdAt,
      updatedAt,
    };
    console.log("before inserting data my values=",vals)
    //i tried to to insert data using create method but it did not work
    //const result = await sequelize.models[tableName].create(vals);
    console.log("modifled vals are",modifiedVals)
    const fields = Object.keys(modifiedVals).join(', ');
    const values = Object.values(modifiedVals).map(value => sequelize.escape(value)).join(', ');
    console.log("keys are",fields,"values are",values)
    const query = `
  INSERT INTO ${tableName} (${fields})
  VALUES (${values})
`;
 await sequelize.query(query, { type: sequelize.QueryTypes.INSERT });
 const selectQuery = `
 SELECT * FROM ${tableName}
 WHERE id = LAST_INSERT_ID()
`;

const [result] = await sequelize.query(selectQuery, {
 type: sequelize.QueryTypes.SELECT,
});

console.log('Inserted record so confirm this :', result);
    return result;
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error inserting data' };
  }
};
