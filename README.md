# pgnodejs-customercare
Nodejs meets postgres in a RESTful way to manage customer tasks assigned to personnel


What?
--------
Fullstack app built in postgresSQL, Express, ReactJS and NodeJS. Backend is REST api. Uses these technologies to build a web platform where authenticated company personnel get to view their customer care tasks.

Setup
--------
Create a postgresSQL database and start it.<br />
Clone and cd into that directory. You will run yarn install twice. Run first yarn install here for backend.<br />
For frontend, cd into `client` directory and run the second yarn install.<br />
Fill out your `.env` as necessary. See `.env.example` file.<br />
Note: your backend host port no. should align with the proxy entry in `package.json`.<br />
Run migrations and seeds.<br />
Note: tables are created in the plural to best leverage npx, sequelize and api consistency adopted.<br />
Run both servers simultaneously. You may run concurrently with one command. Inspect `package.json`<br />
Use REST query samples in `restexamples.txt` after setup.<br />
Make sure to register or signin as a personnel to access the customer care tasks.<br />
CRUD actions or views may be enabled if the user is admin[personnel_type_id=3].<br />
Screenshots in PR.

Heroku
--------
Visit hosted frontend app <a href='https://lno-customercare.herokuapp.com'> here</a>.<br />
Visit hosted backend rest api <a href='https://lno-customercare.herokuapp.com/api'> here</a>.

Licence
--------
This app is protected by MIT licence.<br />
