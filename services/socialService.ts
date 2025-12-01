import { Post, SocialUser, DailyTotals, Comment } from '../types';

const mockUsers: SocialUser[] = [
    { id: 'user1', name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/40?u=user1' },
    { id: 'user2', name: 'John Smith', avatarUrl: 'https://i.pravatar.cc/40?u=user2' },
    { id: 'user3', name: 'Emily White', avatarUrl: 'https://i.pravatar.cc/40?u=user3' },
];

let mockPosts: Post[] = [
    {
        id: 'post1',
        author: mockUsers[0],
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        message: 'Feeling great after a long walk and a healthy lunch! Hitting my protein goals today. 💪',
        dailySummary: { calories: 1850, protein: 120, carbs: 180, fat: 70 },
        reactions: [{ userId: 'user2', emoji: '👍' }],
        comments: [
            { id: 'c1', author: mockUsers[2], timestamp: new Date(Date.now() - 3540000).toISOString(), text: "Awesome job, keep it up!" },
            { id: 'c2', author: mockUsers[1], timestamp: new Date(Date.now() - 3480000).toISOString(), text: "That's the spirit!" },
        ],
        likes: ['user2', 'user3'],
    },
    {
        id: 'post2',
        author: mockUsers[1],
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        message: 'A bit over my calorie goal today, but it was worth it for pizza night. Back on track tomorrow!',
        dailySummary: { calories: 2500, protein: 90, carbs: 300, fat: 100 },
        reactions: [],
        comments: [],
        likes: [],
    },
    {
        id: 'post3',
        author: mockUsers[2],
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        message: "Check out this amazing salad I made for dinner. So colorful and delicious.",
        dailySummary: { calories: 1600, protein: 80, carbs: 150, fat: 80 },
        reactions: [
            { userId: 'user1', emoji: '🔥' },
            { userId: 'user2', emoji: '👍' },
        ],
        comments: [
            { id: 'c3', author: mockUsers[0], timestamp: new Date(Date.now() - 172000000).toISOString(), text: "That looks so good! Recipe?" },
        ],
        likes: ['user1'],
    }
];


export const getMockFeed = (): Post[] => {
    // Return a copy to avoid mutation
    return [...mockPosts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const createPost = (author: SocialUser, message: string, dailySummary: DailyTotals): Post => {
    const newPost: Post = {
        id: `post${Date.now()}`,
        author,
        timestamp: new Date().toISOString(),
        message,
        dailySummary,
        reactions: [],
        comments: [],
        likes: [],
    };
    // In a real app, this would be an API call.
    // Here we just prepend to our mock data for the session.
    mockPosts.unshift(newPost); 
    return newPost;
};

export const toggleLike = (postId: string, userId: string): Post | undefined => {
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex > -1) {
            // User has liked, so unlike
            post.likes.splice(likeIndex, 1);
        } else {
            // User has not liked, so like
            post.likes.push(userId);
        }
        return { ...post }; // Return a new object to ensure react re-renders
    }
    return undefined;
};

export const addComment = (postId: string, author: SocialUser, text: string): Post | undefined => {
    const postIndex = mockPosts.findIndex(p => p.id === postId);
    if (postIndex > -1) {
        const newComment: Comment = {
            id: `c${Date.now()}`,
            author,
            timestamp: new Date().toISOString(),
            text,
        };
        mockPosts[postIndex].comments.push(newComment);
        return { ...mockPosts[postIndex] }; // Return a new object to ensure react re-renders
    }
    return undefined;
};

export const deletePost = (postId: string): void => {
    // In a real app, this would be an API call.
    mockPosts = mockPosts.filter(p => p.id !== postId);
};