import React, { useState, useEffect } from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase'
import firebase from 'firebase'
import moment from 'moment'

function Post({ user, username, caption, imageUrl, postId, time }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map(doc => doc.data()));
                })
        }
        return () => {
            unsubscribe();
        }
    }, [postId])

    const postComment = (e) => {
        e.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('');
    }
    return (
        <div className="post">
            <div className="post__header">
                <Avatar alt={username} src="/broken-image.jpg" className="post__avatar" />
                <h3 className="post__username">{username}</h3>
            </div>
            <img
                src={imageUrl}
                alt="react logo"
                className="post__image" />
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>

            <div className="post__comments">
                {comments.map(comment => (
                    <p><strong>{comment.username}</strong> {comment.text}</p>
                ))}
            </div>
            <p className="post__time">{moment(time.toDate()).fromNow()}</p>

            <form className="post__commentContainer">
                <input type="text"
                    className="post__input"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    className="post__button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}
                >
                    Post
                </button>
            </form>
        </div>
    )
}

export default Post
