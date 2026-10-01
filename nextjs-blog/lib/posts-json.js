// Import Node.js file system module to interact with files
import fs from 'fs';
// Import Node.js path module to handle and resolve file and directory paths
import path from 'path';

// Define the directory path where the JSON data file is stored (data directory under project root)
const dataDir = path.join(process.cwd(), 'data');

// Retrieve all posts from posts.json, sort them alphabetically by title, and return metadata as string
export function getSortedPostsData() {
    // Read and parse the JSON file containing all posts data
    const jsonObj = JSON.parse(fs.readFileSync(path.join(dataDir, 'posts.json'), 'utf8'));
    
    // Sort posts alphabetically by their title
    jsonObj.sort((a, b) => a.title.localeCompare(b.title));
    
    // Map through the items to format and return an array of post metadata
    return jsonObj.map(item => ({
        id: item.id.toString(),
        title: item.title,
        date: item.date
    }));
}

// Retrieve all post IDs formatted as route parameters for Next.js dynamic routing (getStaticPaths)
export function getAllPostIds() {
    // Read and parse the posts JSON file
    const jsonObj = JSON.parse(fs.readFileSync(path.join(dataDir, 'posts.json'), 'utf8'));
    //console.log(jsonObj);
    
    // Return an array of objects matching the required format { params: { id: ... } }
    return jsonObj.map(item => ({
            params: {
                id: item.id.toString()
            }
    }));
}

// Retrieve post data by matching the provided id
export function getPostData(id) {
    // Read and parse the posts JSON file
    const jsonObj = JSON.parse(fs.readFileSync(path.join(dataDir, 'posts.json'), 'utf8'));
    
    // Filter the array to find the post that matches the given id string
    const objReturned = jsonObj.filter(obj => obj.id.toString() === id);
    
    // If no post is found, return fallback/default values
    if (objReturned.length === 0) {
        return {
            id: id,
            title: '--Blank--',
            date: '1970-01-01',
            author: 'None',
            contentHtml: '<p>No Content</p>'
        }
    } else {
        // Otherwise return the matched post object
        return objReturned[0];
    }
}