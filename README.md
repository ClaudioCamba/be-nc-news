# Northcoders News API

# Live Endpoints

The available endpoints and expected responses are documented within the 'endpoints.json' file at the root of this repository.

Below are some examples of the currently live endpoints available.

- Endpoints: https://nc-news-qvgz.onrender.com/api
- Articles: https://nc-news-qvgz.onrender.com/api/articles
- Users: https://nc-news-qvgz.onrender.com/api/users
- Topics: https://nc-news-qvgz.onrender.com/api/topics
- Comments: https://nc-news-qvgz.onrender.com/api/articles/:article_id/comments

# Project Summary

This is a backend project leveraging Node.js, PostgreSQL and Express.js framework to build RESTful API.
The API enables clients to perform CRUD (Create, Read, Update, Delete) operations by making HTTP requests to a relational database.

The project has been thoroughly tested using Jest framework and Supertest library to ensure the endpoints respond as expected.

# Run Locally

- How to clone repository using CLI (Command Line Interface)
1. Install git (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and node (https://nodejs.org/en/download/)
2. Run the following command 'git clone https://github.com/ClaudioCamba/be-nc-news.git' in the CLI
3. Install the project dependencies by running the following command 'npm install'
4. Create .env.development and .env.test files in the be-nc-news directory
5. Assign correct database to each file e.g PGDATABASE=database_name. The database name can be found in (db/ seeds/ setup.sql), assign appropriate database names in each file e.g PGDATABASE=database_name_test inside the .env.test file. 
6. run 'npm run setup-dbs' to create the databases
7. run 'npm run seed' to seed the databases
8. Now you have the databases setup you can run tests by running 'npm run test' command to begin running tests on each endpoint within the (__tests__/app.test.js) file

# Minimum Requirement (Versions)
- Node: v10.24.1
- Postgres: v8.7.3
