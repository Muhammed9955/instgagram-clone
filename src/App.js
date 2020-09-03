import React, { useState, useEffect } from "react";
// import logo from "./logo.svg";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
// import InstagramEmbed from "react-instagram-embed";
import { BiImageAdd } from "react-icons/bi";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "80vw",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [addPost, setAddPost] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [user, setUser] = useState(null);
  const { email, password, userName } = formData;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log({ authUser });
        setUser(authUser);
      } else {
        // user has logged out...
        setUser(null);
      }
    });

    return () => {
      // preform some cleanup actions
      unsubscribe();
    };
  }, [user, userName]);

  // const handleLogin = (e) => {};
  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: userName,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };
  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignin(false);
  };

  // console.log({ posts });
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // everytime a new pots added this code fires
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
            doc,
          }))
        );
      });
  }, []);
  console.log({ posts });
  return (
    <div className="app">
      {console.log({ user })}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://fontmeme.com/images/instagram-new-logo.png"
                alt=""
              />
            </center>

            <Input
              placeholder="USER NAME"
              type="text"
              value={userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
            />
            <Input
              placeholder="EMAIL"
              type="text"
              value={email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              placeholder="PASSWORD"
              type="Password"
              value={password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <Button type="submit" onClick={signUp}>
              SIGN UP
            </Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignin}
        onClose={() => setOpenSignin(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://fontmeme.com/images/instagram-new-logo.png"
                alt=""
              />
            </center>

            <Input
              placeholder="EMAIL"
              type="text"
              value={email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              placeholder="PASSWORD"
              type="Password"
              value={password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <Button type="submit" onClick={signIn}>
              LOGIN
            </Button>
          </form>
        </div>
      </Modal>
      {/* Header */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://fontmeme.com/images/instagram-new-logo.png"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>LOGOUT</Button>
        ) : (
          <div className="app__loginContianer">
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
            <Button onClick={() => setOpenSignin(true)}>Login</Button>
          </div>
        )}
      </div>
      {/* Header */}

      {/* Posts */}
      <div className="app__posts">
        <div className=" app__postsRight">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              userName={post.username}
              caption={post.caption}
              imgUrl={post.imageUrl}
            />
          ))}
        </div>

        {/* <div className="app__postsLeft ">
          <InstagramEmbed
            url="https://www.instagram.com/p/B-_f1HHnxID/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div> */}
      </div>

      <Modal
        open={addPost}
        onClose={() => setOpenSignin(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <center style={{ padding: "10px" }}>
            {user?.displayName ? (
              <ImageUpload userName={user.displayName} />
            ) : (
              <center>
                <h3 className="sorryMsg">Sorry you need to login to uplaod</h3>
              </center>
            )}
          </center>
        </div>
      </Modal>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          border: "1px solid lightgrey",
          boxShadow: "0px -5px 10px rgba(10, 0, 000, 0.3)",
          position: "fixed",
          bottom: 0,
          zIndex: 2,
          backgroundColor: "white",
          width: "100%",
        }}
        // className="addPost"
      >
        <Button onClick={() => setAddPost(true)}>
          <BiImageAdd style={{ fontSize: "1.5rem", padding: "5px 0 5px 0" }} />
          Add Post
        </Button>
      </div>
    </div>
  );
}

export default App;
