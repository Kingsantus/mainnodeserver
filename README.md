welcome on board 

this project is about running server with node.js alone

it is not too pretty to look at but a knowledge of javascript is needed to read through out this file

the node modules were not imported but the files with require(' ') are node.module

before beginning first

npm init

this code will help start up the node development area 

it will ask you to answer yes or no to some things

after everything a package.json is created

inside the package.json on the script {
    //add
    "start": "node server",
    "dev": "nodemon server"
}

above code will ensure that the server.js file is the app that carries everything, 
while the nodemon is a module that helps to restart after we make changes like liveserver

the views folder is where my html file is stored
the css folder is where my css file is stored
the img folder is where my image file is stored

read the file of server.js to get the code for routing and the emitter for logging event
read the file of logEvents.js to get the syntax for reading files, appending, writing, deleting.
