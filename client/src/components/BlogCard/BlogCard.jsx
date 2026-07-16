import "./BlogCard.css";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <article className="blog-card">
      <div className="blog-image">
        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
          />
        )}
      </div>

      <div className="blog-content">
        <h3>{blog.title}</h3>

        <p>{blog.excerpt}</p>

        <Link to={`/blog/${blog.slug}`}>
          Read More
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;