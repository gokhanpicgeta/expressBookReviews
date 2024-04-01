const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios")


const doesExist = (username) => {
  let dupeUsers = users.filter((user)=> user.username == username)
  if(dupeUsers.length > 0){
    return true
  }else{
    return false
  }
}


public_users.post("/register", (req,res) => {
  //Write your code here
  username = req.body.username
  password = req.body.password
  console.log(username,password)

  if(username && password){
    if(!doesExist(username)){
      users.push({"username":username,"password":password})
      res.status(200).json({message:"User successfully registered"})
    }
    else{
      res.status(404).json({message:"User already exists"})
    }
  }
  else{
    res.status(404).json({message:"Error registering user"})
  }

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
//Task 10 using await/async
public_users.get('/',async function (req, res) {

  try{
    const bookList = await books 
    res.send(JSON.stringify(books))
  }
  catch(err){
    res.status(404).send(err)
  }
  //res.send(JSON.stringify(books))
});

// Get book details based on ISBN
//Task 11 using async/await
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  isbn = req.params.isbn
  book = await books[isbn]
  res.send(book)
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
//Task 12 using async/await
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  author = req.params.author
  result = []
  for(const [key,val] of Object.entries(await books)){
    if(val.author == author){
      result.push(val)
    }
  }
  res.send(result)

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
//Task 13 using async/await
public_users.get('/title/:title',async function (req, res) {
  title = req.params.title
  result = []
  for(const [key,val] of Object.entries(await books)){
    if(val.title == title){
      result.push(val)
    }
  }
  res.send(result)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  isbn = req.params.isbn
  book = books[isbn]
  res.send(book.reviews)


  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
