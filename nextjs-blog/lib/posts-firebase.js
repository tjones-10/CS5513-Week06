// Import the initialized Firebase Firestore database instance
import { db } from "./firebase";
// Import Firestore SDK helper methods for querying collections and documents
import { collection, getDocs, query, where, documentId } from "firebase/firestore";

// Fetch all posts from Firestore, sorted alphabetically by title
export async function getSortedPostsData(){
    // Reference the "posts" collection in Firestore
    const myCollectionRef = collection(db, "posts");
    // Retrieve all documents from the "posts" collection
    const querySnapshot = await getDocs(myCollectionRef);
    // Combine each document's Firestore ID with its data fields into an array of objects
    //const jsonObj = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    //Had to use Object.assign because Esprima didn't like the ... spread operator
    const jsonObj = querySnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));

    // Sort posts alphabetically by their title
    jsonObj.sort((a, b) => a.title.localeCompare(b.title));

    // Map through the items to format and return an array of post metadata
    return jsonObj.map(item => ({
        id: item.id.toString(),
        title: item.title,
        date: item.date
    }));
}

// Retrieve all post IDs for Next.js getStaticPaths dynamic routing
export async function getAllPostIds(){
    // Reference the "posts" collection in Firestore
    const myCollectionRef = collection(db, "posts");
    // Retrieve all documents from the "posts" collection
    const querySnapshot = await getDocs(myCollectionRef);
    // Extract document IDs into an array of objects
    const jsonObj = querySnapshot.docs.map(doc => ({id: doc.id}));

    // Return an array of objects matching the required format { params: { id: ... } }
    return jsonObj.map(item => ({
        params: {
            id: item.id.toString()
        }
    }));
}

// Fetch complete post data for a specific document by its ID
export async function getPostData(id){
    // Reference the "posts" collection in Firestore
    const myCollectionRef = collection(db, "posts");
    // Create a query to filter documents where documentId matches the given id
    const searchQuery = query(myCollectionRef, where(documentId(), "==", id));
    // Execute the query to get the snapshot of matched documents
    const querySnapshot = await getDocs(searchQuery);
    // Combine document ID and fields into an array
    //const jsonObj = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    //Had to use Object.assign because Esprima didn't like the ... spread operator
    const jsonObj = querySnapshot.docs.map(doc => Object.assign({ id: doc.id }, doc.data()));

    // If no post is found, return fallback/default values
    if (jsonObj.length === 0) {
        return {
            id: id,
            title: '--Blank--',
            date: '1970-01-01',
            author: 'None',
            contentHTML: '<p>No Content</p>'
        }
    } else {
        // Otherwise return the matched post object
        return jsonObj[0];
    }
}