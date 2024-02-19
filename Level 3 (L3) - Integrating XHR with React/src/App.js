import React, { useState, useEffect } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        return response.json();
      })
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PostForm({ onAddPost }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add post');
        }
        return response.json();
      })
      .then(data => {
        setSuccessMessage('Post added successfully!');
        onAddPost({ title, body, id: data.id });
        // fetchPosts();
        setTitle('');
        setBody('');
      })
      .catch(error => {
        setErrorMessage(error.message);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={event => setTitle(event.target.value)}
          required
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={event => setBody(event.target.value)}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

function App() {
  const [allPosts, setAllPosts] = useState([]);

  const handleAddPost = newPost => {
    setAllPosts([...allPosts, newPost]);
  };

  return (
    <div>
      <h1>Posts</h1>
      <PostList />
      <PostForm onAddPost={handleAddPost} />
      <h2>All Posts</h2>
      <ul>
        {allPosts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
