import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { Modal, makeStyles, Button, Input, Avatar } from '@material-ui/core';
import ImageUpload from './ImageUpload';

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
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        setUser(authUser);

        if (authUser.displayName) {
          // don't update username
        } else {
          // if we just create someone
          return authUser.updateProfile({
            displayName: username
          })
        }
      } else {
        //user has logged out
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data(),
      })))
    })
  }, [])

  const signUp = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .then(()=> {
        setOpen(false);
        setUsername('');
        setEmail('');
        setPassword('');
      })
      .catch((error) => alert(error.message))
  }

  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then( ()=> {
        setOpenSignIn(false);
        setEmail('');
        setPassword('');
      }        
      )
      .catch(error => alert(error.message))
  }

  return (
    <div className="app">      
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="instagram logo"
              className="app__headerImage" />
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="instagram logo"
              className="app__headerImage" />
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram logo"
          className="app__headerImage" />
           {user ? (
           <div className="app__logoutContainer">
             <Button type="submit" onClick={() => auth.signOut()}>Logout</Button>
             <Avatar alt={user.displayName} src="/broken-image.jpg" />
           </div>) :
        (<div className="app__loginContainer">
          <Button type="submit" onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button type="submit" onClick={() => setOpen(true)}>Sign Up</Button>
        </div>)}
      </div>   
      <div className="uploadSection">
        {user?.displayName? (<ImageUpload username={user.displayName}/>):(
          <h1>Login to upload posts</h1>
        )}
      </div>
      <div className="posts">
        {posts.map(({ id, post }) => (          
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} time={post.timestamp} />
        ))}
      </div>
      
    </div>
  );
}

export default App;
