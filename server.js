const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");
const app = express();
const Web3 = require('web3');
const web3 = new Web3('https://ropsten.infura.io/v3/N26hx9en3dhiBFfTrRYVUdMXYxGPjOOVlg2Wq6LJuGx35SN0dfUs6hOQgGubjKA7');
const Web3Strategy = require('passport-web3').Strategy;
passport.use(new Web3Strategy({
  web3: web3,
  addressField: 'ethereumAddress'
}, (ethereumAddress, done) => {
  const user = { id: 1, ethereumAddress: ethereumAddress };
  return done(null, user);
}));
app.use(session({
  secret: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjM5MjVhNDljLWQ2ZjAtNGZiMi05ZmMzLTMyMDIwMzBlZjIyNSIsIm9yZ0lkIjoiMzUxMjMzIiwidXNlcklkIjoiMzYxMDAxIiwidHlwZUlkIjoiZGE4M2NlNWEtZWQ4NS00NWY0LWJkYmUtMjdjZWY4NTg3YmYxIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTA5Njg5ODcsImV4cCI6NDg0NjcyODk4N30.5Rr4iHZR469UYbygHN8KvYEMzoDUMl0jh5hxx7h43cI',
  resave: false,
  saveUninitialized: false
}));

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = { id: 2, username: 'testuser', password: 'testpassword' };
    if (username === user.username && password === user.password) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  }
));
app.use(bodyParser.json());
const db = require("./config/keys").mongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));
app.use(passport.initialize());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const users = [{ id: 1, ethereumAddress: '0xabcde' }, { id: 2, username: 'testuser' }];
  const user = users.find((user) => user.id === id);
  done(null, user);
});

require("./config/passport")(passport);
app.use("/api/users", users);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
app.get('/web3-auth', async (req, res) => {
  try {
    const user = await Moralis.authenticate({ signingMessage: 'Sign in to our dApp' });
    res.json({ user });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});
app.post('/passport-login', passport.authenticate('local'), (req, res) => {
  res.send('Passport.js authentication successful!');
});
