# New City News RESTful API
![New City News API Banner](https://github.com/ClaudioCamba/portfolio-website/blob/main/assets/projects/be-nc-news/nc-news-slide-1.png)

## Project Summary

This is a backend project created to maintain users, articles, topics and comments data within a relational database management system.
The database respondes to specific HTTPS requests such as POST, GET, PATCH and DELETE in order to manage the data within the tables.
This RESTful API has been built utilising Node.js, PostgreSQL and Express.js framework it enables clients to perform CRUD (Create, Read, Update, Delete) operations,
and it has been thoroughly tested using Jest framework and Supertest library to ensure the endpoints respond as expected.

## Live Endpoints

The available endpoints and expected responses are documented within the [endpoints.json](https://github.com/ClaudioCamba/be-nc-news/blob/main/endpoints.json) file at the root of this repository. 
You can also access the live version via the URL ( https://nc-news-qvgz.onrender.com/api ).

Below are some examples of the currently live endpoints available.
- Articles: https://nc-news-qvgz.onrender.com/api/articles
- Users: https://nc-news-qvgz.onrender.com/api/users
- Topics: https://nc-news-qvgz.onrender.com/api/topics

CRUD Operation examples using the article table within the database.
| CRUD | HTTP | ENDPOINTS | RESPONSE |
| --- | --- | --- | --- |
| CREATE | POST | /api/articles | Posted article object|
| READ | GET | /api/articles/:article_id | Gets article object by id|
| PATCH | PATCH | api/articles/:article_id | Updates article votes by id|
| DELETE | DELETE | /api/articles/:article_id | Deletes articles by id|

## Run Locally

1. Install git (https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and node (https://nodejs.org/en/download/)
2. Clone this repository by running the following command `git clone https://github.com/ClaudioCamba/be-nc-news.git` in the terminal / CLI
3. Install the project dependencies by running the following command `npm install`
4. Create .env.development and .env.test files in the be-nc-news root directory
5. Assign database to each file (.env.test file should have `PGDATABASE=nc_news_test` and for .env.development `PGDATABASE=nc_news`). The database name can be found in (db/ seeds/ setup.sql), assign appropriate database names in each file. 
6. run `npm run setup-dbs` to create the databases
7. run `npm run seed` to seed the databases
8. Now you have the databases setup you can run tests by running `npm run test` command to begin running tests on each endpoint within the (__tests__/app.test.js) file directory.

## Minimum Requirement (Versions)
- Node: v10.24.1
- Postgres: v8.7.3
