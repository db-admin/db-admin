![](http://i.imgur.com/OpCIyES.png)

# DB Admin

## Introduction
DB Admin is a web data manager for any database supported by [Sails](http://sailsjs.com/). It allows the user to perform basic CRUD operations in their database. The management interface is user-friendly, easy to use, and includes many beneficial features (listed below). To see which databases are supported, read Sails' [Models and ORM documentation](http://sailsjs.com/documentation/concepts/models-and-orm). Specifically, the [Database Agnosticism section](http://sailsjs.com/documentation/concepts/models-and-orm#?database-agnosticism). In short, some of the databases they support are MySQL, PostgreSQL, and MongoDB. [Here](https://www.npmjs.com/search?q=sails%20adapter&page=2&ranking=optimal) are almost all the other databases supported. I don't know how this application will work with NoSQL databases.

## Terminology

These terminologies should be known for anyone reading this document or the source code:

* **model** - a representation of a database table. A model is a JavaScript object that gives key functionality to the represented table in the database. See Sails' [models](http://sailsjs.com/documentation/reference/waterline-orm/models).
* **record** - a representation of a row in a table. From Sails' documentation: A record is a uniquely identifiable object that corresponds 1-to-1 with a database entry; e.g. a row in Oracle/MSSQL/PostgreSQL/MySQL, a document in MongoDB, or a hash in Redis. See Sails' documentation on [records](http://sailsjs.com/documentation/reference/waterline-orm/records).

## Features

### List all models and record count

![](http://i.imgur.com/X7W47Np.png)

### View all records in a model's database

![](http://i.imgur.com/MF7miEx.png)

Sort by clicking on a table header column:

![](http://i.imgur.com/QqSsIdw.gif)

### Quickly view foreign references

When a foreign key exists in a model's database, instead of just showing the ID of the foreign key, DBAdmin will show the name of the foreign object.

![](http://i.imgur.com/ik8GvGU.png)

### Edit a record

![](http://i.imgur.com/sWEZCoa.gif)

Foreign keys show as select boxes. No more memorizing ids!

![](http://i.imgur.com/sFeLD4S.png)

Even supports multi select!

![](http://i.imgur.com/bVYpp0m.gif)

## Pages

There are three main pages in this application:

### 1. The Home Page

`url: '/'`

The home page is where the user of this application can see all their database tables (known as 'models'). Currently, a user can see how many rows are in each table. Perhaps we will add more information in the future.

### 2. The List Page

`url: '/models/<model-name>'`

This page is where users can see the records in the current model they're viewing. Some key features are the ability to see associations in a friendlier way rather than just seeing the ids. For example, if there were two models called `User` and `Pet`, and a user can have many pets, then the user can see exactly what pet a `User` owns, rather than only seeing the ID.

### 3. The Create / Edit Page

Two possible URLs:

* `uri: '/models/<model-name>/create'` 
* or
* `url: '/models/<model-name>/<record id>'`

This page gives the user the ability to edit a record in a database using a friendly form. The key benefits of this form is the ability to use SELECT HTML elements to reference foreign keys for one-to-one relationships, or one-to-many relationships.

## Getting Started

These are the steps to get started:

1. Have [NodeJS](https://nodejs.org/en/download/) installed.
2. Clone this repository.
3. Run `npm install`
4. Create a dba.config.json file at the root of this project. See the [example config file](https://github.com/db-admin/db-admin/blob/master/sample-dma.config.json) in this repository.
4. Install the [sails adapter](https://www.npmjs.com/search?q=sails%20adapter) for your database using NPM.
5. Use the `sails generate api` command to generate APIs for your database tables. Essentially, this means that for each table in your database, run `sails generate api <table name>` in a command prompt at the root of this project. If `sails` is not a recognized command on your computer, then run `npm -g install sails`. Then try again.
6. Edit the generated models files to add your table's columns so Sails knows how to read it. Use Sails' [attributes](http://sailsjs.com/documentation/concepts/models-and-orm/attributes) documentation to learn how to do this.
7. Run `npm start` and navigate to `localhost:1337` in your browser to start using this application! You can also run `node app.js --port=<port number>` to set the port yourself.

Have fun!

**Note:** This is a work in progress. Though it's been tested, I'm still shy of saying that this project is complete. Use it at your own risk.
