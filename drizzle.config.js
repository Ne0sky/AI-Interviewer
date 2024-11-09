/**@type {import ("drizzle-kit").Config} */
export default{
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials:{
        url : 'postgresql://neondb_owner:PhaS8Zndj7tW@ep-proud-paper-a5gsoa5i.us-east-2.aws.neon.tech/ai-interview?sslmode=require'
    }

}