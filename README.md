#sails-my-admin

## Introduction
Sails My Admin is a web data manager for any database supported by [Sails](http://sailsjs.com/). The management interface is user-friendly, easy to use, and incldues many beneficial features (listed below). To see which databases are supported, read Sails' [Models and ORM documentation]. Specifically, the [Database Agnosticism section](http://sailsjs.com/documentation/concepts/models-and-orm#?database-agnosticism). In short, some of the databases they support are MySQL, PostgreSQL, and MongoDB. [Here](https://www.npmjs.com/search?q=sails%20adapter&page=2&ranking=optimal) are almost all the other databases supported. I don't know how this application will work with NoSQL databases.

## Terminilogy

These terminologies should be known for anyone reading this document or the source code:

* **model** - a representation of a database table. A model is a JavaScript object that gives key functionality to the represented table in the database. See Sails' [models](http://sailsjs.com/documentation/reference/waterline-orm/models).
* **record** - a representation of a row in a table. From Sails' documentation: A record is a uniquely identifiable object that corresponds 1-to-1 with a database entry; e.g. a row in Oracle/MSSQL/PostgreSQL/MySQL, a document in MongoDB, or a hash in Redis. See Sails' documentation on [records](http://sailsjs.com/documentation/reference/waterline-orm/records).

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

* `uri: /models/<model name>/create` 
* or
* `url: /models/<model name>/<record id>`

This page gives the user the ability to edit a record in a database using a friendly form. The key benefits of this form is the ability to use SELECT HTML elements to reference foreign keys for one-to-one relationships, or one-to-many relationships.
