document.addEventListener("DOMContentLoaded", main);

function main() {
  // shows all the posts when running
  displayPosts();

  // prepare the form to add a post
  addNewPostListener();
}

function displayPosts() {
  fetch("http://localhost:3000/posts")
    .then((res) => res.json())
    .then((posts) => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = ""; // we clean it first so it does not repeat the headlines

      posts.forEach((post) => {
        // we go through every post
        const postItem = document.createElement("div");
        postItem.textContent = post.title; // write the headline inside
        postItem.classList.add("post-title"); // class to organise it later 
        postItem.style.cursor = "pointer"; // to make the mouse change when you go over it

        // when the user click the headline               
        postItem.addEventListener("click", () => {
          handlePostClick(post);
        });

        postList.appendChild(postItem);
        // adding it to the list on the page
      });
    });
}

// this function shows the full details of a post
function handlePostClick(post) {
  const detail = document.getElementById("post-detail");

  detail.innerHTML = `
    <h2>${post.title}</h2>
    <p><em>By ${post.author}</em></p>
    <img src="${post.image}" alt="post image" />
    <p>${post.content}</p>
    <div id="post-actions">
      <button id="delete-post">Delete</button>
    </div>
  `;

  // Delete button logic
  const deleteBtn = document.getElementById("delete-post");
  deleteBtn.addEventListener("click", () => {
    fetch(`http://localhost:3000/posts/${post.id}`, {
      method: "DELETE"
    })
    .then(() => {
      // remove post title from list
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";
      displayPosts();

      // clear post detail
      detail.innerHTML = "<h2>Select a post</h2>";
    });
  });
}

// this function listens to the add post form
function addNewPostListener() {
  const form = document.getElementById("new-post-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent page reload on form submit

    // get values from the form fields
    const title = form.title.value;
    const author = form.author.value;
    const image = form.image.value;
    const content = form.content.value;

    // create a new post object
    const newPost = {
      title,
      author,
      image,
      content
    };

    // Send new post to server
    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPost)
    })
    .then((res) => res.json())
    .then((createdPost) => {
      const postList = document.getElementById("post-list");

      const postItem = document.createElement("div");
      postItem.textContent = createdPost.title;
      postItem.classList.add("post-title");
      postItem.style.cursor = "pointer";

      postItem.addEventListener("click", () => {
        handlePostClick(createdPost);
      });

      postList.appendChild(postItem);
      handlePostClick(createdPost);
      form.reset();
    });
  });
}