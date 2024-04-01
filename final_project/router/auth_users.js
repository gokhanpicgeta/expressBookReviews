const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"a","password":"b"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

const verifyLogin = (username,password)=>{
  
  let validUsers = users.filter((user)=> user.username == username && user.password == password)
  if(validUsers.length > 0){
    return true
  }
  return false

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  username = req.body.username
  password = req.body.password
  console.log(req.session)
  if(username && password){

      if(verifyLogin(username,password)){
        let accessToken = jwt.sign({data:password},'access',{expiresIn: 60*60})
        req.session.authorization = {accessToken,username}
       
        return res.status(200).send("User successfully logged in")
      }
      else{
        return res.status(208).json({message: "Invalid login"});
      }
  }
  else{
    return res.status(404).json({message: "Error logging in "});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  console.log(req.session)
  username = req.session.authorization.username
  isbn = req.params.isbn
  review = req.body.review
  book = books[isbn]
  reviews = book.reviews

  for(const [key,val] of Object.entries(reviews)){
    if(val.username == username){
      reviews[username] = review
      books[isbn].reviews = reviews
      return res.status(200).send("Review successfully changed")
    }
  }

  reviews[username] = review
  books[isbn].reviews = reviews
  return res.status(200).send("Review successfully Added")


  //return res.status(300).json({message: "Yet to be implemented"});
});


regd_users.delete("/auth/review/:isbn", (req,res) => {

  username = req.session.authorization.username
  isbn = req.params.isbn
  reviews = books[isbn].reviews
  if(username in reviews){
     books[isbn].reviews.username = {}
     return res.status(200).send("Review successfully Deleted")
  }

  return res.status(404).send("Error deleting review")
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
