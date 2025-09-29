// Importing the Supabase client and dotenv for environment variables
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create a Supabase client instance using the URL and service key from the environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Function to test the connection to the database by performing a simple query
const testConnection = async () => {
  try {
    // Example query to test connection
    const { data, error } = await supabase
      .from('users') // Assuming you have a 'users' table in your Supabase database
      .select('*') // Select all rows
      .limit(1); // Limit to 1 row for testing
    
    if (error) throw error;
    console.log('Database connection has been established successfully:', data);
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  }
};

// Export the Supabase client instance and the testConnection function
module.exports = {
  supabase,
  testConnection
};
