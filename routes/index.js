var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts')
const passport = require('passport');
const upload = require('./multer')
const localStrategy = require("passport-local");
const posts = require('./posts');

passport.use(new localStrategy(userModel.authenticate()));


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/login', function (req, res, next) {
  res.render('login', { error: req.flash('error') });
});
router.get('/feed', function (req, res, next) {
  res.render('feed');
});
router.get('/feed', function (req, res, next) {
  res.render('feed');
});

router.get('/profile', isLoggedIn, async function (req, res, next) {
  try {
    const finduser = await userModel.findOne({
      username: req.session.passport.user,                       //user login hua details jo ,isLoggedIn,sesstion me store reta hai so thatswhy sess.passport
    })
    .populate("posts")

    console.log("this is user ::---------------->:",finduser)
    res.render('profile', { finduser });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server err in proile');
  }
});

router.post("/upload", isLoggedIn, upload.single('file'), async function (req, res) {

  try {
    if (!req.file) {
      return res.status(400).send("no file added");
    } else {
      const finduser = await userModel.findOne({ username: req.session.passport.user });
      console.log("Username from session-------->:", req.session.passport.user );
      console.log("this is user :::-->",finduser)
      const postData = await postModel.create({
        imageText: req.body.filecaption,
        image: req.file.filename,
        user: finduser._id,
      })
      console.log(":::findUser::", postData)
      finduser.posts.push(finduser._id)
      await finduser.save();
      res.send(":::::DONE:::::")
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error { somthing wrong during upload }");
  }
})

router.post('/register', function (req, res, next) {

  const { username, email, fullname } = req.body
  const userData = new userModel({ username, email, fullname })

  userModel.register(userData, req.body.password)
    .then(function (registeredUser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile")
        console.log('::::::Registration successful:::::', registeredUser);
      })
    })
    .catch(function (err) {
      console.error('Registration failed-->:', err);
    });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err) }
    res.redirect('/');
  })
})


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
























//add user
router.get('/add', async function (req, res) {
  const creatUse = await userModel.create({
    username: "rahul",
    email: "rahul@gmail.com",
    password: "thisisrahul",
    posts: [],
    dp: "th is DP"
  });
  res.send(creatUse)
});

//add post
router.get('/addpost', async function (req, res) {
  const addpost = await postModel.create({
    postText: "thired post",
    user: ["656b19037fc04d70c1b7d45b"]
  });
  const user = await userModel.findOne({ _id: "656b19037fc04d70c1b7d45b" })
  user.posts.push(addpost._id)
  user.save();
  res.send(addpost)
});

module.exports = router;
